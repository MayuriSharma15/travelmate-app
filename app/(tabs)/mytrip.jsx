import { auth, db } from "@/configs/FirebaseConfig";
import { useTheme } from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DESTINATION_IMAGES = {
  "paris": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg",
  "maldives": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Maldivesfish2.jpg/800px-Maldivesfish2.jpg",
  "london": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/800px-London_Skyline_%28125508655%29.jpeg",
  "dubai": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dubai_Marina_Skyline.jpg/800px-Dubai_Marina_Skyline.jpg",
  "tokyo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/800px-Skyscrapers_of_Shinjuku_2009_January.jpg",
  "bali": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Pura_Ulun_Danu_Bratan%2C_Bali.jpg/800px-Pura_Ulun_Danu_Bratan%2C_Bali.jpg",
  "singapore": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MBS_gardens_by_the_bay.jpg/800px-MBS_gardens_by_the_bay.jpg",
  "rome": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg",
  "barcelona": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sagrada_Familia_01.jpg/800px-Sagrada_Familia_01.jpg",
  "new york": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/800px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg",
  "thailand": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wat_Phra_Kaew_Grand_Palace_Bangkok.jpg/800px-Wat_Phra_Kaew_Grand_Palace_Bangkok.jpg",
  "greece": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Santorini_sunset3.jpg/800px-Santorini_sunset3.jpg",
  "switzerland": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Matterhorn_from_Domh%C3%BCtte_-_2012-08-02.jpg/800px-Matterhorn_from_Domh%C3%BCtte_-_2012-08-02.jpg",
  "india": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg",
  "england": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/800px-London_Skyline_%28125508655%29.jpeg",
};

const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");

const getDestinationImage = (locationName, photoRef) => {
  if (photoRef && process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
  }
  const normalizedInput = normalize(locationName);
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (normalizedInput.includes(normalize(key))) return url;
  }
  return `https://picsum.photos/seed/${encodeURIComponent(locationName || "travel")}/800/400`;
};

const getFallbackImage = (locationName) =>
  `https://picsum.photos/seed/${encodeURIComponent(locationName || "travel")}/800/400`;

const getBudgetInfo = (budget) => {
  switch (budget?.toLowerCase()) {
    case "cheap":
    case "budget":
      return { icon: "wallet-outline", tier: 1 };
    case "moderate":
    case "standard":
      return { icon: "wallet-outline", tier: 2 };
    case "luxury":
      return { icon: "wallet-outline", tier: 3 };
    default:
      return { icon: "wallet-outline", tier: 1 };
  }
};

const getTravelerIcon = (count) => {
  if (String(count) === "1") return "person-outline";
  if (String(count) === "2") return "people-outline";
  return "people-circle-outline";
};

const isWeb = Platform.OS === "web";

export default function MyTrip() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadTrips(user);
      } else {
        setLoading(false);
        setTrips([]);
      }
    });
    const sub = Dimensions.addEventListener("change", ({ window }) => setScreenWidth(window.width));
    return () => {
      unsubscribe();
      sub?.remove?.();
    };
  }, []);

  const loadTrips = async (userArg) => {
    try {
      const user = userArg || auth.currentUser;
      if (!user) { setLoading(false); return; }
      const tripsQuery = query(collection(db, "UserTrips"), where("userEmail", "==", user.email));
      const querySnapshot = await getDocs(tripsQuery);
      const tripsData = [];
      querySnapshot.forEach((doc) => { tripsData.push({ id: doc.id, ...doc.data() }); });
      tripsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        return dateB - dateA;
      });
      setTrips(tripsData);
    } catch (error) {
      console.error("Error loading trips:", error);
      Alert.alert("Error", "Failed to load trips.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => { setRefreshing(true); loadTrips(); }, []);

  const handleCreateTrip = useCallback(() => {
    const user = auth.currentUser;
    if (!user) { Alert.alert("Login Required", "Please log in first."); return; }
    router.push("/create-trip/searchplace");
  }, [router]);

  const handleTripPress = useCallback((trip) => {
    router.push({ pathname: "/trip-details", params: { trip: JSON.stringify(trip) } });
  }, [router]);

  const handleImageError = useCallback((tripId, locationName) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, __imgFallback: getFallbackImage(locationName) } : t
      )
    );
  }, []);

  const isNarrow = screenWidth < 700;
  const contentMaxWidth = isWeb ? Math.min(screenWidth, 1100) : screenWidth;
  const cardColumnWidth = isNarrow ? "100%" : "calc(50% - 8px)";

  const BudgetBadge = ({ budget, title }) => {
    const info = getBudgetInfo(budget);
    return (
      <View style={styles.budgetBadge}>
        <View style={styles.budgetIconRow}>
          {[1, 2, 3].map((tier) => (
            <Ionicons
              key={tier}
              name="wallet"
              size={13}
              color={tier <= info.tier ? theme.colors.primary : theme.colors.border}
              style={{ marginRight: -2 }}
            />
          ))}
        </View>
        <Text style={[styles.budgetText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          {title || budget || "Budget"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" }]}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>Your Adventures</Text>
            <Text style={[styles.heading, { color: theme.colors.text }]}>My Trips</Text>
          </View>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleCreateTrip}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <View style={{ maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" }}>
          <View style={[styles.header, { paddingHorizontal: 0 }]}>
            <View>
              <Text style={[styles.greeting, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>Your Adventures</Text>
              <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>My Trips</Text>
            </View>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleCreateTrip} activeOpacity={0.8}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {trips.length > 0 ? (
            <>
              <View style={[styles.statsCard, { backgroundColor: theme.colors.card }]}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>{trips.length}</Text>
                  <Text style={[styles.statLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>Total Trips</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                    {trips.reduce((sum, trip) => sum + (trip.tripData?.totalDays || 0), 0)}
                  </Text>
                  <Text style={[styles.statLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>Total Days</Text>
                </View>
              </View>

              <View style={styles.tripsGrid}>
                {trips.map((trip, index) => {
                  const locationName = trip.tripData?.locationInfo?.name || "Unknown";
                  const imageUri = trip.__imgFallback || getDestinationImage(locationName, trip.tripData?.locationInfo?.photoRef);
                  return (
                    <TouchableOpacity
                      key={trip.id}
                      style={[styles.tripCard, { backgroundColor: theme.colors.card, width: isNarrow ? "100%" : cardColumnWidth }]}
                      onPress={() => handleTripPress(trip)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.tripImageContainer}>
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.tripImage}
                          resizeMode="cover"
                          onError={() => handleImageError(trip.id, locationName)}
                        />
                        <View style={[styles.tripBadge, { backgroundColor: theme.colors.primary }]}>
                          <Text style={[styles.tripBadgeText, { fontFamily: "Outfit-Bold" }]}>
                            Trip #{trips.length - index}
                          </Text>
                        </View>
                        <View style={styles.imageOverlay} />
                      </View>

                      <View style={styles.tripDetails}>
                        <Text style={[styles.tripLocation, { fontFamily: "Outfit-Bold", color: theme.colors.text }]} numberOfLines={2}>
                          {locationName}
                        </Text>
                        <View style={styles.tripInfoRow}>
                          <View style={styles.infoItem}>
                            <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                            <Text style={[styles.infoText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                              {trip.tripData?.totalDays || "N/A"} days
                            </Text>
                          </View>
                          <View style={styles.infoItem}>
                            <Ionicons name={getTravelerIcon(trip.tripData?.travelerCount)} size={16} color={theme.colors.textSecondary} />
                            <Text style={[styles.infoText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                              {trip.tripData?.travelerInfo?.title || trip.tripData?.travelerCount + " people"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.tripFooter}>
                          <BudgetBadge budget={trip.tripData?.budget} title={trip.tripData?.budgetInfo?.title} />
                          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.card }]}>
                <Ionicons name="airplane-outline" size={64} color={theme.colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>No trips yet</Text>
              <Text style={[styles.emptySubtitle, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                Start planning your next adventure!
              </Text>
              <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]} onPress={handleCreateTrip} activeOpacity={0.8}>
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={[styles.emptyButtonText, { fontFamily: "Outfit-Bold" }]}>Plan Your First Trip</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1 },
  loadingContainer:   { flex: 1, justifyContent: "center", alignItems: "center" },
  header:             { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 40, paddingBottom: 24 },
  greeting:           { fontSize: 14, marginBottom: 4 },
  heading:            { fontSize: 30, fontWeight: "700" },
  addButton:          { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", elevation: 5, shadowColor: "#007bff", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  statsCard:          { flexDirection: "row", borderRadius: 18, padding: 22, marginBottom: 24, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6 },
  statItem:           { flex: 1, alignItems: "center" },
  statNumber:         { fontSize: 30, fontWeight: "700", marginBottom: 4 },
  statLabel:          { fontSize: 13 },
  statDivider:        { width: 1, marginHorizontal: 20 },
  tripsGrid:          { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  tripCard:           { borderRadius: 18, marginBottom: 0, overflow: "hidden", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  tripImageContainer: { position: "relative", height: 180 },
  tripImage:          { width: "100%", height: "100%" },
  imageOverlay:       { position: "absolute", bottom: 0, left: 0, right: 0, height: 60, backgroundColor: "rgba(0,0,0,0.2)" },
  tripBadge:          { position: "absolute", top: 12, right: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tripBadgeText:      { color: "#fff", fontSize: 12 },
  tripDetails:        { padding: 18 },
  tripLocation:       { fontSize: 19, fontWeight: "700", marginBottom: 12 },
  tripInfoRow:        { flexDirection: "row", marginBottom: 14, gap: 16, flexWrap: "wrap" },
  infoItem:           { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText:           { fontSize: 13 },
  tripFooter:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  budgetBadge:        { flexDirection: "row", alignItems: "center", gap: 8 },
  budgetIconRow:      { flexDirection: "row" },
  budgetText:         { fontSize: 13, textTransform: "capitalize" },
  emptyContainer:     { alignItems: "center", paddingVertical: 60 },
  emptyIconContainer: { width: 120, height: 120, borderRadius: 60, justifyContent: "center", alignItems: "center", marginBottom: 24 },
  emptyTitle:         { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  emptySubtitle:      { fontSize: 16, marginBottom: 32, textAlign: "center" },
  emptyButton:        { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 },
  emptyButtonText:    { color: "#fff", fontSize: 16 },
});
