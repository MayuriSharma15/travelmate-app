
// import { Stack } from "expo-router";
// import { useFonts } from "expo-font";
// import { ThemeProvider } from "@/context/ThemeContext";
// import { CreateTripProvider } from "@/context/CreateTripContext";

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
//     "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
//     "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider>
//       <CreateTripProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="index" />
//           <Stack.Screen name="(tabs)" />
//           <Stack.Screen name="auth" />
//           <Stack.Screen name="create-trip" />
//           <Stack.Screen name="trip-details" />
//         </Stack>
//       </CreateTripProvider>
//     </ThemeProvider>
//   );
// }

import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";
import { CreateTripProvider } from "@/context/CreateTripContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <CreateTripProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="LandingPage" />
          <Stack.Screen name="presentation" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/sign-in/index" />
          <Stack.Screen name="auth/signup/index" />
          <Stack.Screen name="create-trip/searchplace" />
          <Stack.Screen name="create-trip/travelers" />
          <Stack.Screen name="create-trip/budget" />
          <Stack.Screen name="create-trip/travel-dates" />
          <Stack.Screen name="create-trip/review" />
          <Stack.Screen name="create-trip/generate-trip" />
          <Stack.Screen name="trip-details/index" />
        </Stack>
      </CreateTripProvider>
    </ThemeProvider>
  );
}