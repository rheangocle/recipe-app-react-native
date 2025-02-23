// app/(auth)/layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Register' }}
      />
      <Stack.Screen
        name="login"
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="profile-setup"
        options={{ title: 'Set Up Profile' }}
      />
      {/* If you have a login screen, you could add it here too */}
    </Stack>
  );
}
