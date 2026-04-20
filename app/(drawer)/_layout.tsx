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
    />
  );
}
