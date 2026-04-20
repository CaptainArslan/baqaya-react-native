import { GlobalAddCustomerFab, MaterialIcon, type MaterialIconName } from "@/src/components";
import { useTranslation } from "@/src/i18n";
import { Colors, Typography } from "@/src/theme";
import { Tabs } from "expo-router";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Content height above the home indicator / system inset (icon + label + padding). */
const TAB_BAR_CONTENT_HEIGHT = 52;

/** Bottom tabs: design-reference nav (e.g. baqaya_customers_updated_nav_background). */
const TAB_ICONS: Record<
  "index" | "customers" | "cashbook" | "reports",
  MaterialIconName
> = {
  index: "home",
  customers: "group",
  cashbook: "menu-book",
  reports: "assessment",
};

interface TabIconProps {
  focused: boolean;
  label: string;
  icon: MaterialIconName;
}

function TabIcon({ focused, label, icon }: TabIconProps) {
  const { width } = useWindowDimensions();
  const tabSlotWidth = width / 4;
  const webFontSize =
    Platform.OS === "web"
      ? Math.min(
          Typography.size.xs,
          Math.max(9, Math.round(tabSlotWidth * 0.26)),
        )
      : undefined;

  return (
    <View style={styles.tabItem}>
      <MaterialIcon
        name={icon}
        size={22}
        color={focused ? Colors.primary : Colors.textMuted}
      />
      <Text
        style={[
          styles.label,
          webFontSize != null && { fontSize: webFontSize },
          focused && styles.labelActive,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit={Platform.OS !== "web"}
        minimumFontScale={0.72}
        allowFontScaling
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(
    insets.bottom,
    Platform.OS === "android" ? 6 : 0,
  );

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIconSlot,
          tabBarStyle: [
            styles.tabBar,
            {
              height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
              paddingBottom: bottomInset,
            },
          ],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                label={t.tabs.home}
                icon={TAB_ICONS.index}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="customers"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                label={t.tabs.customers}
                icon={TAB_ICONS.customers}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cashbook"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                label={t.tabs.cashbook}
                icon={TAB_ICONS.cashbook}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                label={t.tabs.reports}
                icon={TAB_ICONS.reports}
              />
            ),
          }}
        />
      </Tabs>
      <GlobalAddCustomerFab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: 6,
  },
  tabBarItem: {
    flex: 1,
    minWidth: 0,
  },
  tabBarIconSlot: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weight.medium,
    textAlign: "center",
    width: "100%",
    maxWidth: "100%",
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: Typography.weight.semibold,
  },
});
