import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8fafc' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerTitle: "Product Details",
          headerTintColor: "#29beb3",
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="auth/signin"
        options={{
          headerShown: true,
          headerTitle: "Sign In",
          headerTintColor: "#29beb3",
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "#a96bde",
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          headerShown: true,
          headerTitle: "My Orders",
          headerTintColor: "#29beb3",
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="wishlist"
        options={{
          headerShown: true,
          headerTitle: "My Wishlist",
          headerTintColor: "#29beb3",
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="order/[id]"
        options={{
          headerShown: true,
          headerTitle: "Order Details",
          headerTintColor: "#29beb3",
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
        }}
      />
      <Stack.Screen
        name="order/checkout"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order/success"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
