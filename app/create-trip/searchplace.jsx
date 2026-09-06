import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";
import { CreateTripContext } from "@/context/CreateTripContext";

export default function SearchPlace() {
  const [destination, setDestination] = useState("");
  const router = useRouter();
  const { theme } = useTheme();
  const { setTripData } = useContext(CreateTripContext);

  // Popular destinations with basic info
  const popularDestinations = [
    { name: "Paris", country: "France", emoji: "🇫🇷" },
    { name: "Tokyo", country: "Japan", emoji: "🇯🇵" },
    { name: "New York", country: "USA", emoji: "🇺🇸" },
    { name: "London", country: "UK", emoji: "🇬🇧" },
    { name: "Dubai", country: "UAE", emoji: "🇦🇪" },
    { name: "Bali", country: "Indonesia", emoji: "🇮🇩" },
    { name: "Barcelona", country: "Spain", emoji: "🇪🇸" },
    { name: "Rome", country: "Italy", emoji: "🇮🇹" },
    { name: "Singapore", country: "Singapore", emoji: "🇸🇬" },
    { name: "Maldives", country: "Maldives", emoji: "🇲🇻" },
    { name: "Switzerland", country: "Switzerland", emoji: "🇨🇭" },
    { name: "Thailand", country: "Thailand", emoji: "🇹🇭" },
  ];

  const handleDestinationSelect = (destinationName, country) => {
    const locationInfo = {
      name: destinationName,
      address: `${destinationName}, ${country}`,
      placeId: null,
      photoRef: null,
      coordinates: null,
    };

    console.log("=== STARTING TRIP CREATION ===");
    console.log("Selected destination:", locationInfo);

    // Save location as first step
    setTripData({
      locationInfo: locationInfo,
    });

    // Navigate to travelers (step 1 of 4)
    console.log("Navigating to travelers");
    setTimeout(() => {
      router.push("/create-trip/travelers");
    }, 100);
  };

  const handleManualEntry = () => {
    if (destination.trim().length < 2) {
      return;
    }

    const locationInfo = {
      name: destination.trim(),
      address: destination.trim(),
      placeId: null,
      photoRef: null,
      coordinates: null,
    };

    console.log("=== STARTING TRIP CREATION ===");
    console.log("Manual destination:", locationInfo);

    // Save location as first step
    setTripData({
      locationInfo: locationInfo,
    });

    // Navigate to travelers (step 1 of 4)
    console.log("Navigating to travelers");
    setTimeout(() => {
      router.push("/create-trip/travelers");
    }, 100);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          Choose Destination
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Manual Entry Section */}
      <View style={styles.searchSection}>
        <Text style={[styles.title, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          Where do you want to go?
        </Text>
        <Text style={[styles.subtitle, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          Enter your dream destination
        </Text>

        {/* Manual Input */}
        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }]}>
          <Ionicons name="location" size={20} color={theme.colors.primary} />
          <TextInput
            style={[styles.input, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}
            placeholder="Enter destination (e.g., Paris, Tokyo)..."
            placeholderTextColor={theme.colors.textSecondary}
            value={destination}
            onChangeText={setDestination}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        {/* Manual Entry Button */}
        {destination.trim().length >= 2 && (
          <TouchableOpacity
            style={[styles.manualButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleManualEntry}
            activeOpacity={0.8}
          >
            <Text style={[styles.manualButtonText, { fontFamily: "Outfit-Medium" }]}>
              Continue with "{destination.trim()}"
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <Text style={[styles.dividerText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          or choose from popular destinations
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
      </View>

      {/* Popular Destinations */}
      <View style={styles.popularSection}>
        <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          Popular Destinations
        </Text>
        
        <View style={styles.destinationsGrid}>
          {popularDestinations.map((dest, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.destinationCard, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }]}
              onPress={() => handleDestinationSelect(dest.name, dest.country)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{dest.emoji}</Text>
              <Text style={[styles.destinationName, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
                {dest.name}
              </Text>
              <Text style={[styles.destinationCountry, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                {dest.country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  searchSection: {
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },

  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },

  manualButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 30,
    gap: 12,
  },

  divider: {
    flex: 1,
    height: 1,
  },

  dividerText: {
    fontSize: 14,
  },

  popularSection: {
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  destinationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },

  destinationCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },

  destinationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  destinationCountry: {
    fontSize: 13,
  },
});