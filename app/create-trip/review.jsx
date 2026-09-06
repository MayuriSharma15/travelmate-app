import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useEffect } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useTheme } from "@/context/ThemeContext";

export default function Review() {
  const router = useRouter();
  const { tripData } = useContext(CreateTripContext);
  const { theme } = useTheme();

  useEffect(() => {
    console.log("=== REVIEW SCREEN MOUNTED ===");
    console.log("Full tripData:", JSON.stringify(tripData, null, 2));
    
    // Validate all required data
    if (!tripData?.locationInfo || !tripData?.travelerCount || !tripData?.budget || !tripData?.startDate) {
      console.error("Missing required trip data!");
      Alert.alert(
        "Incomplete Data",
        "Some trip information is missing. Please complete all steps.",
        [
          { text: "Start Over", onPress: () => router.replace("/create-trip/searchplace") }
        ]
      );
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleEdit = (screen) => {
    router.push(screen);
  };

  const handleGenerateTrip = () => {
    // Final validation before generation
    if (!tripData?.locationInfo || !tripData?.travelerCount || !tripData?.budget || !tripData?.startDate) {
      Alert.alert("Error", "Please complete all trip details");
      return;
    }

    console.log("=== GENERATING TRIP ===");
    console.log("Final tripData:", tripData);
    
    router.push("/create-trip/generate-trip");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          Review your trip
        </Text>
        <Text style={[styles.subText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          Check all details before we generate your itinerary
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "100%", backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          Step 4 of 4
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Destination Card */}
        <View style={[styles.reviewCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + "20" }]}>
                <Ionicons name="location" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                Destination
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit("/create-trip/searchplace")}>
              <Text style={[styles.editButton, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardValue, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
            {tripData?.locationInfo?.name || "Not selected"}
          </Text>
          {tripData?.locationInfo?.address && (
            <Text style={[styles.cardSubtext, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
              {tripData.locationInfo.address}
            </Text>
          )}
        </View>

        {/* Dates Card */}
        <View style={[styles.reviewCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#ff6b6b20" }]}>
                <Ionicons name="calendar" size={24} color="#ff6b6b" />
              </View>
              <Text style={[styles.cardTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                Travel Dates
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit("/create-trip/travel-dates")}>
              <Text style={[styles.editButton, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.datesRow}>
            <View style={styles.dateColumn}>
              <Text style={[styles.dateLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                From
              </Text>
              <Text style={[styles.dateValue, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
                {formatDate(tripData?.startDate)}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
            <View style={styles.dateColumn}>
              <Text style={[styles.dateLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                To
              </Text>
              <Text style={[styles.dateValue, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
                {formatDate(tripData?.endDate)}
              </Text>
            </View>
          </View>
          {tripData?.totalDays && (
            <View style={[styles.daysChip, { backgroundColor: "#ff6b6b20" }]}>
              <Text style={[styles.daysText, { fontFamily: "Outfit-Bold", color: "#ff6b6b" }]}>
                {tripData.totalDays} days trip
              </Text>
            </View>
          )}
        </View>

        {/* Travelers Card */}
        <View style={[styles.reviewCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#9c27b020" }]}>
                <Ionicons name="people" size={24} color="#9c27b0" />
              </View>
              <Text style={[styles.cardTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                Travelers
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit("/create-trip/travelers")}>
              <Text style={[styles.editButton, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardValue, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
            {tripData?.travelerInfo?.title || "Not selected"}
          </Text>
          <Text style={[styles.cardSubtext, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            {tripData?.travelerInfo?.people || tripData?.travelerCount + " people"}
          </Text>
        </View>

        {/* Budget Card */}
        <View style={[styles.reviewCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#4caf5020" }]}>
                <Ionicons name="wallet" size={24} color="#4caf50" />
              </View>
              <Text style={[styles.cardTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                Budget
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit("/create-trip/budget")}>
              <Text style={[styles.editButton, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardValue, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
            {tripData?.budgetInfo?.title || tripData?.budget || "Not selected"}
            <Text style={styles.budgetEmoji}> {tripData?.budgetInfo?.emoji || ""}</Text>
          </Text>
          <Text style={[styles.cardSubtext, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            {tripData?.budgetInfo?.description || ""}
          </Text>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.primary + "15" }]}>
          <Ionicons name="sparkles" size={24} color={theme.colors.primary} />
          <Text style={[styles.infoText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>
            We'll use AI to create a personalized itinerary based on your preferences!
          </Text>
        </View>

        {/* Debug Info (remove in production) */}
        {__DEV__ && (
          <View style={[styles.debugCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.debugTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
              Debug Info:
            </Text>
            <Text style={[styles.debugText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
              Location: {tripData?.locationInfo?.name || "❌ Missing"}{"\n"}
              Dates: {tripData?.startDate ? "✅" : "❌ Missing"}{"\n"}
              Travelers: {tripData?.travelerCount || "❌ Missing"}{"\n"}
              Budget: {tripData?.budget || "❌ Missing"}
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleGenerateTrip}
        >
          <Ionicons name="sparkles" size={24} color="#fff" />
          <Text style={[styles.buttonText, { fontFamily: "Outfit-Bold" }]}>
            Generate My Trip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subText: {
    fontSize: 16,
    lineHeight: 24,
  },

  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  progressText: {
    fontSize: 12,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  reviewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  editButton: {
    fontSize: 14,
    fontWeight: "600",
  },

  cardValue: {
    fontSize: 18,
    marginBottom: 4,
  },

  cardSubtext: {
    fontSize: 14,
  },

  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  dateColumn: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 16,
  },

  daysChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  daysText: {
    fontSize: 13,
    fontWeight: "600",
  },

  budgetEmoji: {
    fontSize: 18,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },

  debugCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  debugTitle: {
    fontSize: 14,
    marginBottom: 8,
  },

  debugText: {
    fontSize: 12,
    lineHeight: 18,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "transparent",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});