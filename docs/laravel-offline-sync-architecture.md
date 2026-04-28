# Laravel Multi-tenant Offline Sync Architecture (Implementation Spec)

Scope: production backend for offline-first mobile/web clients with strict tenant isolation, idempotent bidirectional sync, Redis-backed queues/cache/rate limiting, and zero data loss under retries.

## 1) System Architecture Diagram (Text)

```text
[Client (Mobile/Web)]
  ├─ local DB (offline data)
  ├─ op_queue (create/update/delete ops)
  └─ sync_worker
      ├─ POST /api/v1/sync/push
      └─ GET  /api/v1/sync/pull?cursor=...

[Laravel API Gateway]
  ├─ Auth middleware (Sanctum token)
  ├─ Tenant resolver middleware
  ├─ Idempotency middleware (Redis key lock + lookup)
  ├─ Validation + policy checks
  └─ enqueue ProcessSyncBatchJob (non-blocking)

[Redis]
  ├─ queues:* (jobs, retries)
  ├─ idem:{tenant}:{request_id} (idempotency state)
  ├─ ratelimit:* (per-tenant/user limits)
  ├─ cache:tenant:{id}:* (hot reads)
  └─ sync_state:{tenant}:{device_id} (ephemeral sync status)

[Workers (Horizon)]
  ├─ ProcessSyncBatchJob
  │   ├─ upsert entities with tenant scope
  │   ├─ conflict resolution
  │   ├─ write sync_log + audit_log
  │   └─ emit domain events
  └─ BroadcastChangeJob / Notification jobs

[MySQL/PostgreSQL]
  ├─ tenants, users, tenant_users
  ├─ customers, orders, order_items
  ├─ idempotency_keys
  ├─ sync_logs, sync_operations, sync_cursors
  └─ audit_logs
```

## 2) Offline Sync Flow (Step-by-step)

1. **Client offline**: user CRUD is persisted locally in `op_queue` with `operation_id`, `entity_version`, `timestamp`.
2. **Reconnect**: client batches queued ops and sends `POST /api/v1/sync/push` with `request_id`.
3. **API ingress**: validate auth + tenant + idempotency, persist `sync_logs(status=received)`, dispatch async job, return `202`.
4. **Queue worker**: process each operation idempotently, resolve conflicts, apply DB writes, emit events, log per-op status.
5. **Cursor update**: advance device cursor only after atomic commit.
6. **Pull delta**: client calls `GET /api/v1/sync/pull?cursor=...` and applies server deltas.

## 3) Multi-tenant Isolation (Mandatory)

- Tenant resolution middleware must bind tenant from token claims plus optional tenant header verification.
- All tenant models include `tenant_id`.
- Global model scope applies tenant filter automatically.
- `creating` hook auto-injects `tenant_id`.
- Policies must validate tenant ownership for read/write/delete.
- Unique constraints must be tenant-scoped.

Example:

```php
trait BelongsToTenant {
  protected static function booted() {
    static::addGlobalScope('tenant', fn($q) => $q->where('tenant_id', tenant()->id));
    static::creating(fn($m) => $m->tenant_id = tenant()->id);
  }
}
```

Hard rule: never use unscoped raw table queries in application domain paths.

## 4) Database Schema (Detailed)

### Core Tables

- `tenants`
  - `id ULID PK`, `name`, `slug`, `status`, `plan`, `created_at`
  - indexes: `UNQ(slug)`, `IDX(status)`
- `users`
  - `id ULID PK`, `email`, `password_hash`, `status`, `created_at`
  - indexes: `UNQ(email)`, `IDX(status)`
- `tenant_users`
  - `tenant_id`, `user_id`, `role`, `status`, `joined_at`
  - indexes: `PK(tenant_id,user_id)`, `IDX(user_id)`
- `devices`
  - `id ULID PK`, `tenant_id`, `user_id`, `device_uuid`, `platform`, `last_seen_at`
  - indexes: `UNQ(tenant_id,device_uuid)`, `IDX(tenant_id,last_seen_at)`
- `customers`
  - `id ULID PK`, `tenant_id`, `entity_uuid`, `name`, `phone`, `email`, `deleted_at`, `server_version BIGINT`
  - indexes: `UNQ(tenant_id,entity_uuid)`, `IDX(tenant_id,updated_at)`, `IDX(tenant_id,phone)`
- `orders`
  - `id ULID PK`, `tenant_id`, `entity_uuid`, `customer_id`, `status`, `total_cents`, `ordered_at`, `deleted_at`, `server_version`
  - indexes: `UNQ(tenant_id,entity_uuid)`, `IDX(tenant_id,customer_id)`, `IDX(tenant_id,ordered_at)`
- `order_items`
  - `id ULID PK`, `tenant_id`, `order_id`, `sku`, `qty`, `unit_price_cents`
  - indexes: `IDX(tenant_id,order_id)`
- `sync_logs`
  - `id ULID PK`, `tenant_id`, `device_id`, `request_id`, `direction(push/pull)`, `status`, `received_at`, `finished_at`, `error_json`
  - indexes: `UNQ(tenant_id,request_id)`, `IDX(tenant_id,device_id,received_at)`
- `sync_operations`
  - `id ULID PK`, `tenant_id`, `sync_log_id`, `operation_id`, `entity_type`, `entity_uuid`, `op(create/update/delete)`, `client_ts`, `status`, `conflict_json`
  - indexes: `UNQ(tenant_id,operation_id)`, `IDX(tenant_id,entity_type,entity_uuid)`
- `sync_cursors`
  - `tenant_id`, `device_id`, `last_pulled_version BIGINT`, `last_pushed_at`
  - indexes: `PK(tenant_id,device_id)`
- `idempotency_keys`
  - `id ULID PK`, `tenant_id`, `request_id`, `request_hash`, `response_json`, `status`, `expires_at`
  - indexes: `UNQ(tenant_id,request_id)`, `IDX(expires_at)`
- `audit_logs`
  - `id ULID PK`, `tenant_id`, `actor_user_id`, `entity_type`, `entity_id`, `action`, `before_json`, `after_json`, `created_at`
  - indexes: `IDX(tenant_id,entity_type,entity_id)`, `IDX(tenant_id,created_at)`

### Migration Rules

- Use ULID/UUID public identifiers for sync entities.
- Add `server_version BIGINT NOT NULL DEFAULT 1` to mutable synced entities.
- Increment `server_version` on every successful mutation.
- Soft delete synced entities (`deleted_at`) and increment version.
- Avoid hard deletes on sync path; archive with maintenance jobs.

## 5) Sync API (Implementation-ready)

### `POST /api/v1/sync/push`

```json
{
  "request_id": "01J....",
  "device_id": "01J....",
  "client_timestamp": "2026-04-28T10:20:30Z",
  "operations": [
    {
      "operation_id": "01J....",
      "operation": "create|update|delete",
      "entity_type": "customer|order|order_item",
      "entity_uuid": "c_123",
      "client_version": 7,
      "client_timestamp": "2026-04-28T10:20:30Z",
      "payload": {}
    }
  ]
}
```

Response `202`:

```json
{
  "ok": true,
  "code": "SYNC_ACCEPTED",
  "data": {
    "sync_log_id": "01J...",
    "request_id": "01J...",
    "accepted_operations": 50
  },
  "meta": { "tenant_id": "t_001", "trace_id": "..." }
}
```

### `GET /api/v1/sync/pull?cursor=12345&limit=500`

```json
{
  "ok": true,
  "code": "SYNC_DELTA",
  "data": {
    "cursor": 12890,
    "has_more": true,
    "changes": [
      {
        "entity_type": "customer",
        "entity_uuid": "c_123",
        "operation": "update",
        "server_version": 12876,
        "server_timestamp": "2026-04-28T10:22:02Z",
        "payload": {}
      }
    ]
  }
}
```

### `GET /api/v1/sync/status/{request_id}`

```json
{
  "ok": true,
  "code": "SYNC_STATUS",
  "data": {
    "status": "processing|completed|partial_failed|failed",
    "processed": 48,
    "failed": 2,
    "failures": [{ "operation_id": "...", "reason": "CONFLICT" }]
  }
}
```

## 6) Idempotency Design (Critical)

### Layers

- HTTP batch level:
  - Redis key: `idem:{tenant_id}:{request_id}`
  - TTL: 24h
  - duplicate requests return stored response
- operation level:
  - DB unique key: `(tenant_id, operation_id)` in `sync_operations`
- fallback:
  - table `idempotency_keys` unique `(tenant_id, request_id)`
  - retention 7d

### Processing Pseudocode

```text
1) hash payload -> request_hash
2) if redis idem key exists:
     if hash matches -> return stored response
     else -> 409 IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD
3) create sync_log(status=received), dispatch ProcessSyncBatchJob
4) store response skeleton by request_id
5) on job completion, update stored response + status
```

## 7) Conflict Resolution Rules

- default strategy: **server-authoritative**
- apply client write only if:
  - `client_version >= server_version`, or
  - field unchanged since client base version (optional field-level merge)
- deletion vs update:
  - if server row is already deleted and incoming update version is stale/equal -> conflict
- timestamp validation:
  - reject client timestamps outside skew policy window (e.g. older than 30 days)

Conflict payload:

```json
{
  "operation_id": "...",
  "status": "conflict",
  "conflict_type": "VERSION_MISMATCH|DELETED_ON_SERVER|FIELD_CONFLICT",
  "server_snapshot": {},
  "resolution_hint": "pull_latest_then_reapply"
}
```

## 8) Redis Usage Map

- entity cache: `cache:tenant:{tenant}:customer:{id}` TTL `5m`
- collection cache: `cache:tenant:{tenant}:customers:list:{cursor_hash}` TTL `30-120s`
- idempotency: `idem:{tenant}:{request_id}` TTL `24h`
- rate limit: `ratelimit:tenant:{tenant}:user:{user}:sync_push` window `60s`
- sync state: `sync_state:{tenant}:{device}` TTL `10m`
- queue backend: `queues:sync`, `queues:default`

### Cache invalidation

- invalidate entity/list keys on domain events (`created/updated/deleted`)
- prefer event-driven invalidation listeners

## 9) Queue / Job / Event System

### Queues

- `sync-high`: `ProcessSyncBatchJob`, retries `tries=10 backoff=1,5,15,30,60`
- `sync-events`: `BroadcastEntityDeltaJob`, retries `tries=5`
- `notifications`: webhook/email jobs, retries `tries=5`
- dead-letter:
  - Laravel `failed_jobs` + alerting
  - replay command for safe reprocessing

### Domain Events

- `CustomerCreated|Updated|Deleted`
- `OrderCreated|Updated|Deleted`

### Listeners

- `InvalidateTenantCacheListener`
- `AppendChangeFeedListener` (source for pull deltas)
- `PublishRealtimeListener` (optional)
- `AuditLogListener`

## 10) API Standards / Auth / Rate Limit / Performance

### Response Envelope

```json
{
  "ok": true,
  "code": "MACHINE_READABLE_CODE",
  "message": "human readable",
  "data": {},
  "errors": [{ "field": "...", "code": "...", "message": "..." }],
  "meta": { "trace_id": "...", "tenant_id": "...", "cursor": "..." }
}
```

### Auth

- Use **Laravel Sanctum** (first-party web + mobile, revocation, ability scopes).
- Token abilities: `sync:push`, `sync:pull`, `entity:read`, `entity:write`.

### Rate Limits

- `sync/push`: 120 req/min per tenant, 30 req/min per user
- `sync/pull`: 240 req/min per tenant, 60 req/min per user
- sliding window in Redis
- return `429` with `retry_after_seconds`

### Performance Rules

- cursor pagination for all large list/sync endpoints
- prevent N+1 with eager loading
- composite indexes for `tenant_id + filter/sort fields`
- bounded pull payload (`limit <= 1000`)
- cache read-through on high traffic endpoints

## 11) Laravel Folder Structure Suggestion

```text
app/
  Domain/
    Customer/{Actions,Events,Listeners,Policies}
    Order/{Actions,Events,Listeners,Policies}
    Sync/{Actions,DTOs,Events,Jobs,Services}
    Tenant/{Models,Middleware,Services}
  Http/
    Controllers/Api/V1/Sync/{PushController,PullController,StatusController}
    Middleware/{ResolveTenant,VerifyIdempotency,EnsureTenantMembership}
    Requests/Api/V1/Sync/{PushRequest,PullRequest}
  Models/{Tenant,User,TenantUser,Device,Customer,Order,OrderItem,SyncLog,SyncOperation,SyncCursor,IdempotencyKey,AuditLog}
  Support/{Cache,Idempotency,ApiResponse}

routes/api_v1.php
database/migrations/*
config/tenancy.php
config/sync.php
config/horizon.php
```

## 12) Failure Scenarios and Handling

- duplicate push batch retry:
  - detect by `(tenant_id, request_id)`
  - return prior response
  - no duplicate writes
- worker crash mid-batch:
  - retry job
  - per-op idempotency prevents duplicate effects
- Redis eviction:
  - fallback to `idempotency_keys` DB table
- out-of-order operations:
  - version checks reject stale updates and mark conflict
- cross-tenant leakage attempt:
  - middleware + scopes + policies -> `403` + security audit event

