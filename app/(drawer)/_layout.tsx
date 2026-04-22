import { AppDrawerContent } from "@/src/components";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
      }}
    >
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="business-profile" />
      <Drawer.Screen name="privacy-policy" />
      <Drawer.Screen name="delete-account" />
      <Drawer.Screen name="delete-account-verify" />
    </Drawer>
  );
}
