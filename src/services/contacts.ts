import * as Contacts from "expo-contacts";

export interface DevicePhoneNumber {
  id: string;
  label: string;
  value: string;
  normalized: string;
}

export interface DeviceContact {
  id: string;
  name: string;
  phoneNumbers: DevicePhoneNumber[];
}

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

function mapLabel(label?: string): string {
  if (!label) return "mobile";
  return String(label).toLowerCase();
}

export async function requestContactsPermission(): Promise<boolean> {
  const current = await Contacts.getPermissionsAsync();
  if (current.status === "granted") return true;
  const next = await Contacts.requestPermissionsAsync();
  return next.status === "granted";
}

export async function getAllDeviceContacts(): Promise<DeviceContact[]> {
  const pageSize = 500;
  let pageOffset = 0;
  let hasNextPage = true;
  const all: DeviceContact[] = [];

  while (hasNextPage) {
    const res = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
      pageSize,
      pageOffset,
      sort: Contacts.SortTypes.FirstName,
    });

    const mapped = res.data
      .map((contact) => {
        const name = contact.name?.trim();
        if (!name) return null;

        const numbers: DevicePhoneNumber[] = (contact.phoneNumbers ?? [])
          .map((num, index) => {
            const value = num.number?.trim();
            if (!value) return null;
            return {
              id: `${contact.id}_${index}`,
              label: mapLabel(num.label),
              value,
              normalized: normalizePhone(value),
            };
          })
          .filter((n): n is DevicePhoneNumber => Boolean(n));

        return {
          id: contact.id,
          name,
          phoneNumbers: numbers,
        };
      })
      .filter((c): c is DeviceContact => Boolean(c));

    all.push(...mapped);

    hasNextPage = Boolean(res.hasNextPage);
    pageOffset += pageSize;
  }

  return all;
}
