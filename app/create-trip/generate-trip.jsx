import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useTheme } from "@/context/ThemeContext";
import { auth, db } from "@/configs/FirebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { chatSession } from "@/configs/AiModel";

const generateMockPlan = (tripData) => {
  const location = tripData?.locationInfo?.name || "Your Destination";
  const days = tripData?.totalDays || 3;

  const allPlaces = [
    { placeName: `${location} City Center`, details: `Explore the heart of ${location} with its iconic landmarks, local markets, and vibrant atmosphere. Perfect for first-time visitors.`, ticketPrice: "Free", timeToTravel: "2-3 hours" },
    { placeName: `${location} National Museum`, details: `Discover the rich history and culture of ${location} through fascinating exhibits and artifacts spanning centuries.`, ticketPrice: "$10-15", timeToTravel: "2 hours" },
    { placeName: `${location} Local Market`, details: `Browse fresh produce, local crafts, and street food at this bustling market. A great place to experience local life.`, ticketPrice: "Free", timeToTravel: "1-2 hours" },
    { placeName: `${location} Park & Gardens`, details: `Relax in the beautiful gardens and parks. Great for a morning walk or afternoon picnic with stunning views.`, ticketPrice: "Free", timeToTravel: "1-2 hours" },
    { placeName: `${location} Art Gallery`, details: `Explore contemporary and classical art from local and international artists in this impressive gallery.`, ticketPrice: "$8-12", timeToTravel: "1.5 hours" },
    { placeName: `${location} Viewpoint`, details: `Catch breathtaking panoramic views of the city from this famous viewpoint. Best visited at sunrise or sunset.`, ticketPrice: "Free", timeToTravel: "1 hour" },
    { placeName: `${location} Old Town`, details: `Wander through charming historic streets, old architecture, and hidden gems of the old quarter.`, ticketPrice: "Free", timeToTravel: "2-3 hours" },
    { placeName: `${location} Food Street`, details: `Indulge in local cuisine at the famous food street. Try authentic dishes and street snacks loved by locals.`, ticketPrice: "$5-20", timeToTravel: "2 hours" },
    { placeName: `${location} Waterfront`, details: `Enjoy a leisurely stroll along the beautiful waterfront promenade with cafes, shops, and scenic views.`, ticketPrice: "Free", timeToTravel: "1.5 hours" },
    { placeName: `${location} Temple/Historical Site`, details: `Visit this significant historical and cultural site that represents the heritage of the region.`, ticketPrice: "$5-10", timeToTravel: "1.5 hours" },
  ];

  const themes = ["Arrival & City Highlights", "Culture & History", "Nature & Relaxation", "Local Experience & Food", "Shopping & Leisure", "Hidden Gems & Departure"];

  const itinerary = {};
  for (let i = 1; i <= days; i++) {
    const startIdx = ((i - 1) * 2) % allPlaces.length;
    itinerary[`day${i}`] = {
      theme: themes[(i - 1) % themes.length],
      places: [allPlaces[startIdx % allPlaces.length], allPlaces[(startIdx + 1) % allPlaces.length], allPlaces[(startIdx + 2) % allPlaces.length]],
    };
  }

  return {
    hotels: [
      { name: `${location} Grand Hotel`, address: `Main Boulevard, ${location} City Center`, price: tripData?.budgetInfo?.title === "Economy" ? "$30-50 per night" : tripData?.budgetInfo?.title === "Luxury" ? "$150-300 per night" : "$60-100 per night", rating: "4.2", description: `A comfortable hotel in the heart of ${location} with excellent amenities and friendly staff.` },
      { name: `${location} Boutique Inn`, address: `Old Quarter, ${location}`, price: tripData?.budgetInfo?.title === "Economy" ? "$20-40 per night" : "$80-150 per night", rating: "4.5", description: `A charming boutique hotel offering an authentic local experience with modern comforts.` },
      { name: `${location} Budget Stay`, address: `Near Central Station, ${location}`, price: "$15-30 per night", rating: "3.8", description: `Clean and affordable accommodation perfect for budget travelers exploring ${location}.` },
    ],
    itinerary,
  };
};

export default function GenerateTrip() {
  const router = useRouter();
  const { tripData } = useContext(CreateTripContext);
  const { theme } = useTheme();
  const hasRun = useRef(false);

  useEffect(() => {
    if (tripData && !hasRun.current) {
      hasRun.current = true;
      generateTrip();
    }
  }, []);

  const generateTrip = async () => {
    try {
      console.log("=== STARTING TRIP GENERATION ===");
      let tripPlan = null;

      try {
        console.log("=== TRYING GROQ API ===");
        const prompt = `Generate a travel itinerary. Return ONLY valid JSON, no markdown, no extra text.

Location: ${tripData.locationInfo?.name}
Days: ${tripData.totalDays}
Travelers: ${tripData.travelerInfo?.title}
Budget: ${tripData.budgetInfo?.title}

JSON structure:
{
  "hotels": [{"name":"","address":"","price":"","rating":"","description":""}],
  "itinerary": {
    "day1": {"theme":"","places":[{"placeName":"","details":"","ticketPrice":"","timeToTravel":""}]}
  }
}`;
        const response = await chatSession.sendMessage(prompt);
        const rawText = response.response.text();
        tripPlan = JSON.parse(rawText);
        console.log("Groq API success, days:", Object.keys(tripPlan.itinerary || {}).length);
      } catch (apiError) {
        console.log("Groq error:", apiError.message, "falling back to mock data");
      }

      if (!tripPlan || !tripPlan.itinerary || Object.keys(tripPlan.itinerary).length === 0) {
        console.log("=== USING MOCK TRIP PLAN ===");
        tripPlan = generateMockPlan(tripData);
      }

      console.log("Hotels:", tripPlan.hotels.length);
      console.log("Days:", Object.keys(tripPlan.itinerary).length);

      const user = auth.currentUser;
      await addDoc(collection(db, "UserTrips"), {
        userEmail: user?.email,
        userId: user?.uid,
        tripData: tripData,
        tripPlan: tripPlan,
        createdAt: serverTimestamp(),
      });

      console.log("Saved to Firebase!");
      router.replace("/(tabs)/mytrip");
    } catch (error) {
      console.error("=== ERROR ===", error.message);
      Alert.alert("Error", "Could not save your trip. Please try again.", [
        { text: "Try Again", onPress: () => { hasRun.current = false; generateTrip(); } },
        { text: "Go Back", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + "20" }]}>
          <Ionicons name="sparkles" size={40} color={theme.colors.primary} />
        </View>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 30 }} />
        <Text style={[styles.title, { color: theme.colors.text }]}>Creating Your Trip</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Building your personalized {tripData?.totalDays}-day itinerary for {tripData?.locationInfo?.name}...
        </Text>
        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>This may take a few seconds</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { alignItems: "center", paddingHorizontal: 40 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", fontFamily: "Outfit-Bold", marginTop: 20, textAlign: "center" },
  subtitle: { fontSize: 15, fontFamily: "Outfit-Regular", marginTop: 10, textAlign: "center", lineHeight: 22 },
  hint: { fontSize: 12, fontFamily: "Outfit-Regular", marginTop: 12, textAlign: "center", opacity: 0.6 },
});
