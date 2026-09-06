import { db } from "@/configs/FirebaseConfig";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DESTINATION_IMAGES = {
  paris:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/800px-Tour_Eiffel_Wikimedia_Commons.jpg",
  maldives:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Maldivesfish2.jpg/800px-Maldivesfish2.jpg",
  london:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/800px-London_Skyline_%28125508655%29.jpeg",
  dubai:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dubai_Marina_Skyline.jpg/800px-Dubai_Marina_Skyline.jpg",
  tokyo:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/800px-Skyscrapers_of_Shinjuku_2009_January.jpg",
  bali: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Pura_Ulun_Danu_Bratan%2C_Bali.jpg/800px-Pura_Ulun_Danu_Bratan%2C_Bali.jpg",
  singapore:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/MBS_gardens_by_the_bay.jpg/800px-MBS_gardens_by_the_bay.jpg",
  rome: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg",
  barcelona:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Sagrada_Familia_01.jpg/800px-Sagrada_Familia_01.jpg",
  "new york":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg/800px-Southwest_corner_of_Central_Park%2C_looking_east%2C_NYC.jpg",
  thailand:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wat_Phra_Kaew_Grand_Palace_Bangkok.jpg/800px-Wat_Phra_Kaew_Grand_Palace_Bangkok.jpg",
  greece:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Santorini_sunset3.jpg/800px-Santorini_sunset3.jpg",
  switzerland:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Matterhorn_from_Domh%C3%BCtte_-_2012-08-02.jpg/800px-Matterhorn_from_Domh%C3%BCtte_-_2012-08-02.jpg",
  india:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg",
  england:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/800px-London_Skyline_%28125508655%29.jpeg",
  amsterdam:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/AmsterdamNetwork.jpg/800px-AmsterdamNetwork.jpg",
  venice:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Venice_Canal_Grande.jpg/800px-Venice_Canal_Grande.jpg",
};

const PLACE_IMAGES = [
  "https://picsum.photos/seed/place1/200/200",
  "https://picsum.photos/seed/place2/200/200",
  "https://picsum.photos/seed/place3/200/200",
  "https://picsum.photos/seed/place4/200/200",
  "https://picsum.photos/seed/place5/200/200",
  "https://picsum.photos/seed/place6/200/200",
];

const HOTEL_IMAGES = [
  "https://picsum.photos/seed/hotel1/400/200",
  "https://picsum.photos/seed/hotel2/400/200",
  "https://picsum.photos/seed/hotel3/400/200",
];

const getDestinationImage = (locationName, photoRef) => {
  if (photoRef && process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
  }
  const lower = (locationName || "").toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return "https://picsum.photos/seed/travel/800/400";
};

export default function TripDetails() {
  const params = useLocalSearchParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (params?.trip) {
      try {
        setTripDetails(JSON.parse(params.trip));
      } catch (e) {
        console.error("Failed to parse trip:", e);
      }
    }
  }, []);

  const handleDelete = () => {
    Alert.alert(
      "Delete Trip",
      `Delete your trip to ${tripDetails?.tripData?.locationInfo?.name || "this destination"}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await deleteDoc(doc(db, "UserTrips", tripDetails.id));
              Alert.alert("Deleted ✓", "Your trip has been deleted.", [
                { text: "OK", onPress: () => router.replace("/(tabs)/mytrip") },
              ]);
            } catch (e) {
              setDeleting(false);
              Alert.alert("Error", "Could not delete trip. Try again.");
            }
          },
        },
      ],
    );
  };

  if (!tripDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading trip...</Text>
      </View>
    );
  }

  const plan = tripDetails.tripPlan;
  const tripData = tripDetails.tripData;
  const travelPlan = plan?.travelPlan || plan?.travel_plan || plan || {};
  const hotels =
    travelPlan.hotels ||
    travelPlan.hotelOptions ||
    plan?.hotels ||
    plan?.hotelOptions ||
    [];
  const itinerary =
    travelPlan.itinerary ||
    travelPlan.dailyItinerary ||
    plan?.itinerary ||
    plan?.dailyItinerary ||
    {};
  const locationName = tripData?.locationInfo?.name || "Your Trip";
  const photoUri = getDestinationImage(
    locationName,
    tripData?.locationInfo?.photoRef,
  );
  const hasItinerary =
    (typeof itinerary === "object" &&
      !Array.isArray(itinerary) &&
      Object.keys(itinerary).length > 0) ||
    (Array.isArray(itinerary) && itinerary.length > 0);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ✅ Real destination image */}
        <Image
          source={{ uri: photoUri }}
          style={styles.headerImage}
          resizeMode="cover"
        />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* 🗑️ Delete Button top right */}
        <TouchableOpacity
          style={styles.deleteTopButton}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="trash-outline" size={22} color="#fff" />
          )}
        </TouchableOpacity>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.locationTitle, { color: theme.colors.text }]}>
            {locationName}
          </Text>
          <Text
            style={[styles.metaText, { color: theme.colors.textSecondary }]}
          >
            {tripData?.totalDays ? `${tripData.totalDays} Days` : ""}
            {tripData?.travelerInfo?.title
              ? ` • ${tripData.travelerInfo.title}`
              : ""}
          </Text>
          {tripData?.startDate && (
            <Text
              style={[styles.dateText, { color: theme.colors.textSecondary }]}
            >
              📅 {tripData.startDate} → {tripData.endDate}
            </Text>
          )}

          {/* Chips */}
          <View style={styles.chipsRow}>
            {tripData?.budgetInfo?.title && (
              <View
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.primary + "25" },
                ]}
              >
                <Ionicons
                  name="wallet-outline"
                  size={13}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.chipText, { color: theme.colors.primary }]}
                >
                  {tripData.budgetInfo.title}
                </Text>
              </View>
            )}
            {tripData?.travelerInfo?.title && (
              <View
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.primary + "25" },
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={13}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.chipText, { color: theme.colors.primary }]}
                >
                  {tripData.travelerInfo.title}
                </Text>
              </View>
            )}
            {tripData?.totalDays && (
              <View
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.primary + "25" },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.chipText, { color: theme.colors.primary }]}
                >
                  {tripData.totalDays} days
                </Text>
              </View>
            )}
          </View>

          {/* Hotels */}
          {hotels.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                🏨 Hotel Recommendations
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {hotels.map((hotel, index) => (
                  <View
                    key={index}
                    style={[
                      styles.hotelCard,
                      { backgroundColor: theme.colors.card },
                    ]}
                  >
                    {/* ✅ Hotel image */}
                    <Image
                      source={{
                        uri: HOTEL_IMAGES[index % HOTEL_IMAGES.length],
                      }}
                      style={styles.hotelImage}
                      resizeMode="cover"
                    />
                    <View style={styles.hotelInfo}>
                      <Text
                        style={[styles.hotelName, { color: theme.colors.text }]}
                        numberOfLines={2}
                      >
                        {hotel.hotelName || hotel.name}
                      </Text>
                      <Text
                        style={[
                          styles.hotelPrice,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        💰 {hotel.price || hotel.pricePerNight || "N/A"}
                      </Text>
                      <Text
                        style={[
                          styles.hotelRating,
                          { color: theme.colors.text },
                        ]}
                      >
                        ⭐ {hotel.rating || "N/A"}
                      </Text>
                      {hotel.description && (
                        <Text
                          style={[
                            styles.hotelDesc,
                            { color: theme.colors.textSecondary },
                          ]}
                          numberOfLines={2}
                        >
                          {hotel.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Itinerary */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              🗺️ Daily Itinerary
            </Text>
            {!hasItinerary ? (
              <View style={styles.noItineraryBox}>
                <Ionicons name="map-outline" size={36} color="#ccc" />
                <Text style={styles.noDataText}>No itinerary available.</Text>
              </View>
            ) : typeof itinerary === "object" && !Array.isArray(itinerary) ? (
              Object.keys(itinerary)
                .sort()
                .map((dayKey, index) => {
                  const day = itinerary[dayKey];
                  const places = day.plan || day.places || day.activities || [];
                  return (
                    <View
                      key={dayKey}
                      style={[
                        styles.dayContainer,
                        { backgroundColor: theme.colors.card },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayTitle,
                          { color: theme.colors.primary },
                        ]}
                      >
                        Day {index + 1}
                        {day.theme
                          ? `: ${day.theme}`
                          : day.title
                            ? `: ${day.title}`
                            : ""}
                      </Text>
                      {day.bestTime && (
                        <Text
                          style={[
                            styles.bestTime,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          🕐 {day.bestTime}
                        </Text>
                      )}
                      {places.length > 0 ? (
                        places.map((place, idx) => (
                          <PlaceCard
                            key={idx}
                            place={place}
                            idx={index * 3 + idx}
                            theme={theme}
                          />
                        ))
                      ) : (
                        <Text style={styles.noDataText}>No places listed</Text>
                      )}
                    </View>
                  );
                })
            ) : (
              itinerary.map((day, index) => {
                const places = day.plan || day.places || day.activities || [];
                return (
                  <View
                    key={index}
                    style={[
                      styles.dayContainer,
                      { backgroundColor: theme.colors.card },
                    ]}
                  >
                    <Text
                      style={[styles.dayTitle, { color: theme.colors.primary }]}
                    >
                      Day {index + 1}
                      {day.theme ? `: ${day.theme}` : ""}
                    </Text>
                    {places.map((place, idx) => (
                      <PlaceCard
                        key={idx}
                        place={place}
                        idx={index * 3 + idx}
                        theme={theme}
                      />
                    ))}
                  </View>
                );
              })
            )}
          </View>

          {/* 🗑️ Delete button bottom */}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleting}
            style={styles.deleteBottomBtn}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#dc2626" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                <Text style={styles.deleteBottomText}>Delete This Trip</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function PlaceCard({ place, idx, theme }) {
  const name = place.placeName || place.name || place.place;
  const details = place.placeDetails || place.details || place.description;
  const time = place.timeToTravel || place.duration || place.time;
  const ticket = place.ticketPricing || place.ticketPrice || place.price;
  const imageUri =
    place.placeImageUrl ||
    place.imageUrl ||
    place.image ||
    PLACE_IMAGES[idx % PLACE_IMAGES.length];

  return (
    <View
      style={[styles.placeCard, { backgroundColor: theme.colors.background }]}
    >
      {/* ✅ Place image */}
      <Image
        source={{ uri: imageUri }}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.placeInfo}>
        <Text
          style={[styles.placeName, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {name}
        </Text>
        {details && (
          <Text
            style={[styles.placeDetails, { color: theme.colors.textSecondary }]}
            numberOfLines={3}
          >
            {details}
          </Text>
        )}
        {time && (
          <Text style={[styles.placeTime, { color: theme.colors.primary }]}>
            ⏱️ {time}
          </Text>
        )}
        {ticket && (
          <Text
            style={[styles.placeTicket, { color: theme.colors.textSecondary }]}
          >
            🎟️ {ticket}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 16, color: "#666", marginTop: 8 },
  headerImage: { width: "100%", height: 300 },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    padding: 8,
  },
  deleteTopButton: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "rgba(220,38,38,0.85)",
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    padding: 20,
    marginTop: -24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  locationTitle: { fontSize: 28, fontWeight: "700", marginBottom: 6 },
  metaText: { fontSize: 16, marginBottom: 4 },
  dateText: { fontSize: 14, marginBottom: 12 },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  chipText: { fontSize: 12, fontWeight: "600" },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  hotelCard: {
    width: 220,
    marginRight: 14,
    borderRadius: 16,
    overflow: "hidden",
  },
  hotelImage: { width: "100%", height: 130 },
  hotelInfo: { padding: 10 },
  hotelName: { fontSize: 15, fontWeight: "700" },
  hotelPrice: { fontSize: 13, marginTop: 4 },
  hotelRating: { fontSize: 13, marginTop: 2 },
  hotelDesc: { fontSize: 11, marginTop: 4 },
  dayContainer: { borderRadius: 16, padding: 16, marginBottom: 12 },
  dayTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  bestTime: { fontSize: 12, marginBottom: 10 },
  placeCard: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  placeImage: { width: 85, height: 85, borderRadius: 12 },
  placeInfo: { flex: 1, marginLeft: 12, justifyContent: "center" },
  placeName: { fontSize: 14, fontWeight: "700" },
  placeDetails: { fontSize: 12, marginTop: 4 },
  placeTime: { fontSize: 12, marginTop: 4 },
  placeTicket: { fontSize: 12, marginTop: 2 },
  noItineraryBox: { alignItems: "center", paddingVertical: 32, gap: 12 },
  noDataText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  deleteBottomBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#dc2626",
    backgroundColor: "#fff5f5",
    marginTop: 24,
  },
  deleteBottomText: { color: "#dc2626", fontSize: 16, fontWeight: "700" },
});
