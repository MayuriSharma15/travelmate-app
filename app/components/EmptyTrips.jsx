import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Colors from "../../constants/colors";

export default function EmptyTrips() {
  const router = useRouter();

  function startNewTripHandler() {
    // ✅ absolute path (MOST IMPORTANT)
    router.push("/create-trip/searchplace");
  }

  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={64} color={Colors.primary} />

      <Text style={styles.title}>No trips planned yet</Text>
      <Text style={styles.subtitle}>
        Looks like it’s time to plan a new adventure ✈️
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={startNewTripHandler}
      >
        <Text style={styles.buttonText}>Start a new trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginTop: 20,
    color: Colors.textDark,
  },
  subtitle: {
    fontFamily: "outfit",
    textAlign: "center",
    marginVertical: 10,
    color: Colors.textLight,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: "outfit-bold",
    color: "#fff",
    fontSize: 14,
  },
});
