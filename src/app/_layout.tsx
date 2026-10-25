
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#087E8B",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#F4F8FA" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "PurifiX",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="products"
          options={{ title: "Products" }}
        />
        <Stack.Screen
          name="orders"
          options={{ title: "My Orders" }}
        />
        <Stack.Screen
          name="service"
          options={{ title: "Book Service" }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "My Profile" }}
        />
      </Stack>
    </>
  );
}
