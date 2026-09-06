import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";

const ALL_DESTINATIONS = [
  { 
    id: "1",
    name: "Paris", 
    country: "France",
    desc: "City of Love and Lights",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    rating: 4.8,
    trips: "2.4M",
  },
  { 
    id: "2",
    name: "Bali", 
    country: "Indonesia",
    desc: "Tropical Paradise",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.9,
    trips: "1.8M",
  },
  { 
    id: "3",
    name: "Tokyo", 
    country: "Japan",
    desc: "Modern Meets Traditional",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    rating: 4.7,
    trips: "2.1M",
  },
  { 
    id: "4",
    name: "Santorini", 
    country: "Greece",
    desc: "Island Paradise",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    rating: 4.9,
    trips: "1.5M",
  },
  { 
    id: "5",
    name: "Dubai", 
    country: "UAE",
    desc: "Luxury & Innovation",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    rating: 4.6,
    trips: "1.9M",
  },
  { 
    id: "6",
    name: "New York", 
    country: "USA",
    desc: "The City That Never Sleeps",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    rating: 4.7,
    trips: "3.2M",
  },
  { 
    id: "7",
    name: "London", 
    country: "UK",
    desc: "Historic & Modern Fusion",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    rating: 4.6,
    trips: "2.8M",
  },
  { 
    id: "8",
    name: "Rome", 
    country: "Italy",
    desc: "Ancient Wonders",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    rating: 4.8,
    trips: "2.3M",
  },
  { 
    id: "9",
    name: "Barcelona", 
    country: "Spain",
    desc: "Art & Architecture",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    rating: 4.7,
    trips: "2.0M",
  },
  { 
    id: "10",
    name: "Maldives", 
    country: "Maldives",
    desc: "Ultimate Beach Paradise",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    rating: 4.9,
    trips: "1.4M",
  },
  { 
    id: "11",
    name: "Singapore", 
    country: "Singapore",
    desc: "Garden City",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    rating: 4.7,
    trips: "1.7M",
  },
  { 
    id: "12",
    name: "Iceland", 
    country: "Iceland",
    desc: "Land of Fire & Ice",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
    rating: 4.8,
    trips: "1.2M",
  },
];

export default function AllDestinations() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleDestinationPress = (destination) => {
    const locationInfo = {
      name: destination.name,
      address: `${destination.name}, ${destination.country}`,
      placeId: null,
      photoRef: null,
      coordinates: null,
    };

    router.push({
      pathname: "/create-trip/travel-dates",
      params: { locationInfo: JSON.stringify(locationInfo) },
    });
  };

  const renderDestination = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      activeOpacity={0.7}
      onPress={() => handleDestinationPress(item)}
    >
      <Image 
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.cardContent}>
          <Text style={[styles.name, { fontFamily: "Outfit-Bold" }]}>
            {item.name}
          </Text>
          <Text style={[styles.country, { fontFamily: "Outfit-Regular" }]}>
            {item.country}
          </Text>
          <Text style={[styles.desc, { fontFamily: "Outfit-Regular" }]}>
            {item.desc}
          </Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={[styles.statText, { fontFamily: "Outfit-Medium" }]}>
                {item.rating}
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="people" size={14} color="#fff" />
              <Text style={[styles.statText, { fontFamily: "Outfit-Medium" }]}>
                {item.trips}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          All Destinations
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Destinations Grid */}
      <FlatList
        data={ALL_DESTINATIONS}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  cardContent: {
    padding: 12,
  },

  name: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 2,
  },

  country: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 6,
  },

  desc: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.7,
    marginBottom: 8,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statText: {
    fontSize: 11,
    color: "#fff",
  },
});
