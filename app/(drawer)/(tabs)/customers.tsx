/**
 * Customers tab
 * Design ref: baqaya_customers_updated_nav_background (empty)
 *             baqaya_customers_updated_nav_with_sync (populated)
 */
import {
    CustomerRow,
    EmptyState,
    FAB,
    MaterialIcon,
    SearchBar,
    SyncBannerStack,
    TabHeader,
} from "@/src/components";
import { getAllMockCustomers } from "@/src/constants/mockData";
import { useAppNavigation } from "@/src/hooks";
import { useTranslation } from "@/src/i18n";
import { Colors, Spacing } from "@/src/theme";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomersScreen() {
  const nav = useAppNavigation();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [allCustomers, setAllCustomers] = useState(getAllMockCustomers);

  useFocusEffect(
    useCallback(() => {
      setAllCustomers(getAllMockCustomers());
    }, []),
  );

  const filtered = allCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.phone ?? "").includes(query),
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <TabHeader
        title={t.common.appName}
        onMenuPress={nav.goToDrawer}
        rightElement={
          <TouchableOpacity
            hitSlop={8}
            onPress={() => Alert.alert(t.sync.synced, t.sync.syncedBody)}
          >
            <MaterialIcon name="sync" size={22} color={Colors.textInverse} />
          </TouchableOpacity>
        }
      />

      <SyncBannerStack onSyncPress={() => {}} />

      {/* Search bar — always visible so user can clear and see all */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t.customers.searchPlaceholder}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <MaterialIcon
              name="person-search"
              size={56}
              color={Colors.textMuted}
            />
          }
          title={query ? t.customers.emptyTitle : t.customers.allCustomers}
          description={t.customers.emptyBody}
          actionLabel={query ? undefined : t.customers.importContacts}
          onAction={query ? undefined : nav.goToImportContacts}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerRow
              name={item.name}
              phone={item.phone}
              balance={item.balance}
              status={
                item.balance > 0
                  ? "owes"
                  : item.balance < 0
                    ? "toGive"
                    : "settled"
              }
              lastActive={item.lastActivity}
              onPress={() => nav.goToCustomerDetail(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        icon={
          <MaterialIcon
            name="person-add"
            size={28}
            color={Colors.textInverse}
          />
        }
        onPress={nav.goToAddCustomer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  list: { paddingBottom: 100 },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
});
