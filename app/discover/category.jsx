import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";

// Destinations by category - 8 destinations each
const DESTINATIONS_BY_CATEGORY = {
  Beach: [
    { id: "1", name: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", rating: 4.9, desc: "Luxury overwater villas" },
    { id: "2", name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", rating: 4.8, desc: "Tropical paradise" },
    { id: "3", name: "Phuket", country: "Thailand", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80", rating: 4.7, desc: "Island beaches" },
    { id: "4", name: "Cancun", country: "Mexico", image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800&q=80", rating: 4.6, desc: "Caribbean coast" },
    { id: "5", name: "Seychelles", country: "Seychelles", image: "https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80", rating: 4.9, desc: "Pristine beaches" },
    { id: "6", name: "Fiji", country: "Fiji", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80", rating: 4.8, desc: "Crystal clear waters" },
    { id: "7", name: "Hawaii", country: "USA", image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&q=80", rating: 4.7, desc: "Volcanic beaches" },
    { id: "8", name: "Mauritius", country: "Mauritius", image: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=800&q=80", rating: 4.8, desc: "Indian Ocean gem" },
  ],
  Mountain: [
    { id: "1", name: "Swiss Alps", country: "Switzerland", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80", rating: 4.9, desc: "Alpine paradise" },
    { id: "2", name: "Himalayas", country: "Nepal", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80", rating: 4.8, desc: "Roof of the world" },
    { id: "3", name: "Rocky Mountains", country: "USA", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", rating: 4.7, desc: "Majestic peaks" },
    { id: "4", name: "Andes", country: "Peru", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80", rating: 4.8, desc: "Longest range" },
    { id: "5", name: "Dolomites", country: "Italy", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80", rating: 4.8, desc: "Dramatic limestone" },
    { id: "6", name: "Banff", country: "Canada", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80", rating: 4.9, desc: "Turquoise lakes" },
    { id: "7", name: "Scottish Highlands", country: "Scotland", image: "https://images.unsplash.com/photo-1580158444380-bd6bc39fa846?w=800&q=80", rating: 4.6, desc: "Rugged beauty" },
    { id: "8", name: "New Zealand Alps", country: "New Zealand", image: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=80", rating: 4.8, desc: "Southern Alps" },
  ],
  City: [
    { id: "1", name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", rating: 4.7, desc: "Neon metropolis" },
    { id: "2", name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", rating: 4.7, desc: "Big Apple" },
    { id: "3", name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", rating: 4.8, desc: "City of lights" },
    { id: "4", name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", rating: 4.6, desc: "Future city" },
    { id: "5", name: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", rating: 4.7, desc: "Historic capital" },
    { id: "6", name: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80", rating: 4.8, desc: "Garden city" },
    { id: "7", name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80", rating: 4.7, desc: "Gaudi's masterpiece" },
    { id: "8", name: "Hong Kong", country: "China", image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=80", rating: 4.6, desc: "Skyline wonder" },
  ],
  Adventure: [
    { id: "1", name: "Queenstown", country: "New Zealand", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80", rating: 4.9, desc: "Adventure capital" },
    { id: "2", name: "Iceland", country: "Iceland", image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80", rating: 4.8, desc: "Land of fire & ice" },
    { id: "3", name: "Patagonia", country: "Chile", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80", rating: 4.8, desc: "Wild frontier" },
    { id: "4", name: "Costa Rica", country: "Costa Rica", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80", rating: 4.7, desc: "Jungle adventures" },
    { id: "5", name: "Moab", country: "USA", image: "https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?w=800&q=80", rating: 4.7, desc: "Desert playground" },
    { id: "6", name: "Nepal", country: "Nepal", image: "https://images.unsplash.com/photo-1558799053-a6bfbdee314e?w=800&q=80", rating: 4.8, desc: "Trekking paradise" },
    { id: "7", name: "Norway", country: "Norway", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80", rating: 4.8, desc: "Fjord adventures" },
    { id: "8", name: "Peru", country: "Peru", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80", rating: 4.7, desc: "Inca trails" },
  ],
  Culture: [
    { id: "1", name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", rating: 4.9, desc: "Temple city" },
    { id: "2", name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80", rating: 4.8, desc: "Ancient empire" },
    { id: "3", name: "Cairo", country: "Egypt", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80", rating: 4.7, desc: "Pyramids & history" },
    { id: "4", name: "Athens", country: "Greece", image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80", rating: 4.7, desc: "Cradle of civilization" },
    { id: "5", name: "Istanbul", country: "Turkey", image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80", rating: 4.8, desc: "East meets West" },
    { id: "6", name: "Jaipur", country: "India", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80", rating: 4.7, desc: "Pink city" },
    { id: "7", name: "Cusco", country: "Peru", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80", rating: 4.8, desc: "Inca heritage" },
    { id: "8", name: "Jerusalem", country: "Israel", image: "https://images.unsplash.com/photo-1518340186427-f8e1f9d40989?w=800&q=80", rating: 4.6, desc: "Holy city" },
  ],
  Wildlife: [
    { id: "1", name: "Serengeti", country: "Tanzania", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80", rating: 4.9, desc: "Great migration" },
    { id: "2", name: "Amazon", country: "Brazil", image: "https://images.unsplash.com/photo-1601306838985-6d7210d8cb92?w=800&q=80", rating: 4.8, desc: "Rainforest life" },
    { id: "3", name: "Kruger", country: "South Africa", image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80", rating: 4.8, desc: "Big Five safari" },
    { id: "4", name: "Galápagos", country: "Ecuador", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", rating: 4.9, desc: "Unique species" },
    { id: "5", name: "Borneo", country: "Malaysia", image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80", rating: 4.7, desc: "Orangutan haven" },
    { id: "6", name: "Yellowstone", country: "USA", image: "https://images.unsplash.com/photo-1564058908219-e5e179d2e7c5?w=800&q=80", rating: 4.8, desc: "Wolf & bison" },
    { id: "7", name: "Madagascar", country: "Madagascar", image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80", rating: 4.7, desc: "Lemur island" },
    { id: "8", name: "Pantanal", country: "Brazil", image: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=800&q=80", rating: 4.8, desc: "Jaguar territory" },
  ],
  Food: [
    { id: "1", name: "Bangkok", country: "Thailand", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80", rating: 4.9, desc: "Street food heaven" },
    { id: "2", name: "Bologna", country: "Italy", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80", rating: 4.8, desc: "Food capital" },
    { id: "3", name: "Mexico City", country: "Mexico", image: "https://images.unsplash.com/photo-1518659744995-ed2a8431c1e7?w=800&q=80", rating: 4.8, desc: "Taco paradise" },
    { id: "4", name: "Lyon", country: "France", image: "https://images.unsplash.com/photo-1524623243236-0ad851a720e4?w=800&q=80", rating: 4.7, desc: "Gastronomy hub" },
    { id: "5", name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", rating: 4.9, desc: "Michelin star city" },
    { id: "6", name: "Istanbul", country: "Turkey", image: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=80", rating: 4.7, desc: "Culinary crossroads" },
    { id: "7", name: "New Orleans", country: "USA", image: "https://images.unsplash.com/photo-1582158771367-a1a4d3f87d0f?w=800&q=80", rating: 4.6, desc: "Creole cuisine" },
    { id: "8", name: "Lima", country: "Peru", image: "https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&q=80", rating: 4.8, desc: "Ceviche capital" },
  ],
  Romantic: [
    { id: "1", name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", rating: 4.9, desc: "City of love" },
    { id: "2", name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80", rating: 4.9, desc: "Sunset views" },
    { id: "3", name: "Venice", country: "Italy", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80", rating: 4.8, desc: "Gondola rides" },
    { id: "4", name: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", rating: 4.9, desc: "Private islands" },
    { id: "5", name: "Prague", country: "Czech Republic", image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80", rating: 4.7, desc: "Fairytale city" },
    { id: "6", name: "Bora Bora", country: "French Polynesia", image: "https://images.unsplash.com/photo-1589197331516-e26f1e5d31ca?w=800&q=80", rating: 4.9, desc: "Overwater bungalows" },
    { id: "7", name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", rating: 4.8, desc: "Cherry blossoms" },
    { id: "8", name: "Bruges", country: "Belgium", image: "https://images.unsplash.com/photo-1558698698-6c1f8b3b7838?w=800&q=80", rating: 4.7, desc: "Medieval charm" },
  ],
};

const CATEGORY_ICONS = {
  Beach: "water",
  Mountain: "trail-sign",
  City: "business",
  Adventure: "bicycle",
  Culture: "color-palette",
  Wildlife: "paw",
  Food: "restaurant",
  Romantic: "heart",
};

const CATEGORY_COLORS = {
  Beach: "#4FC3F7",
  Mountain: "#81C784",
  City: "#FFB74D",
  Adventure: "#FF8A65",
  Culture: "#BA68C8",
  Wildlife: "#4DB6AC",
  Food: "#FFD54F",
  Romantic: "#F06292",
};

export default function Category() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  
  const category = params.category || "Beach";
  const destinations = DESTINATIONS_BY_CATEGORY[category] || [];
  const icon = CATEGORY_ICONS[category];
  const color = CATEGORY_COLORS[category];

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
        <Text style={[styles.name, { fontFamily: "Outfit-Bold" }]}>
          {item.name}
        </Text>
        <Text style={[styles.country, { fontFamily: "Outfit-Regular" }]}>
          {item.country}
        </Text>
        {item.desc && (
          <Text style={[styles.desc, { fontFamily: "Outfit-Regular" }]}>
            {item.desc}
          </Text>
        )}
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.ratingText, { fontFamily: "Outfit-Medium" }]}>
            {item.rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: color + "20" }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={[styles.categoryIcon, { backgroundColor: color }]}>
            <Ionicons name={icon} size={40} color="#fff" />
          </View>
          <Text style={[styles.title, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
            {category} Destinations
          </Text>
          <Text style={[styles.subtitle, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            {destinations.length} amazing places to explore
          </Text>
        </View>
      </View>

      {/* Destinations List */}
      <FlatList
        data={destinations}
        renderItem={renderDestination}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  headerContent: {
    alignItems: "center",
  },

  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
  },

  list: {
    padding: 20,
  },

  card: {
    height: 200,
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
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    padding: 16,
  },

  name: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 4,
  },

  country: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 6,
  },

  desc: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.7,
    marginBottom: 8,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontSize: 13,
    color: "#fff",
  },
});