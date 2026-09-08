import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Platform,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { auth } from "@/configs/FirebaseConfig";

const { width: screenW } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const CARD_WIDTH = isWeb ? 320 : screenW * 0.7;

const TRENDING_DESTINATIONS = [
  { id: "1", name: "Paris", country: "France", desc: "City of Love and Lights", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", rating: 4.8, trips: "2.4M", badge: "Trending", badgeIcon: "flame", bestTime: "Apr-Jun, Sep-Oct", avgCost: "$150-200/day" },
  { id: "2", name: "Bali", country: "Indonesia", desc: "Tropical Paradise", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", rating: 4.9, trips: "1.8M", badge: "Popular", badgeIcon: "star", bestTime: "Apr-Oct", avgCost: "$50-80/day" },
  { id: "3", name: "Tokyo", country: "Japan", desc: "Modern Meets Traditional", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", rating: 4.7, trips: "2.1M", badge: "Top Rated", badgeIcon: "trophy", bestTime: "Mar-May, Sep-Nov", avgCost: "$120-180/day" },
  { id: "4", name: "Santorini", country: "Greece", desc: "Island Paradise", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80", rating: 4.9, trips: "1.5M", badge: "Premium", badgeIcon: "diamond", bestTime: "May-Sep", avgCost: "$100-150/day" },
  { id: "5", name: "Dubai", country: "UAE", desc: "Luxury & Innovation", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", rating: 4.6, trips: "1.9M", badge: "Luxury", badgeIcon: "diamond", bestTime: "Nov-Mar", avgCost: "$180-250/day" },
  { id: "6", name: "New York", country: "USA", desc: "The City That Never Sleeps", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80", rating: 4.7, trips: "3.2M", badge: "Iconic", badgeIcon: "star", bestTime: "Apr-Jun, Sep-Nov", avgCost: "$200-300/day" },
];

const CATEGORIES = [
  { id: "1", name: "Beach", icon: "water", color: "#4FC3F7", desc: "Sun, sand & sea" },
  { id: "2", name: "Mountain", icon: "trail-sign", color: "#81C784", desc: "Peaks & valleys" },
  { id: "3", name: "City", icon: "business", color: "#FFB74D", desc: "Urban adventures" },
  { id: "4", name: "Adventure", icon: "bicycle", color: "#FF8A65", desc: "Thrills & excitement" },
  { id: "5", name: "Culture", icon: "color-palette", color: "#BA68C8", desc: "History & heritage" },
  { id: "6", name: "Wildlife", icon: "paw", color: "#4DB6AC", desc: "Nature & animals" },
  { id: "7", name: "Food", icon: "restaurant", color: "#FFD54F", desc: "Culinary journeys" },
  { id: "8", name: "Romantic", icon: "heart", color: "#F06292", desc: "Couples getaways" },
];

const TRAVEL_TIPS = [
  { id: "1", title: "Best Time to Visit Europe", desc: "Spring (April-June) and Fall (September-October) offer pleasant weather, fewer crowds, and better prices across European destinations.", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80", icon: "calendar-outline", category: "Timing", readTime: "5 min read" },
  { id: "2", title: "Budget Travel Hacks", desc: "Book flights on Tuesday, use local transportation, eat where locals eat, and stay in hostels or Airbnbs to save up to 60% on travel costs.", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80", icon: "wallet-outline", category: "Budget", readTime: "8 min read" },
  { id: "3", title: "Packing Essentials", desc: "Pack versatile clothing, a universal adapter, portable charger, first-aid kit, and always keep medications in carry-on luggage.", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80", icon: "bag-handle-outline", category: "Tips", readTime: "6 min read" },
  { id: "4", title: "Solo Travel Safety", desc: "Share your itinerary with family, keep copies of important documents, trust your instincts, and research local customs before traveling.", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80", icon: "shield-checkmark-outline", category: "Safety", readTime: "7 min read" },
  { id: "5", title: "Photography Tips for Travelers", desc: "Wake up early for golden hour shots, respect local customs, shoot in RAW format, and always ask permission before photographing people.", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80", icon: "camera-outline", category: "Photography", readTime: "10 min read" },
  { id: "6", title: "Digital Nomad Guide", desc: "Learn how to work remotely while traveling, find coworking spaces, manage time zones, and maintain work-life balance on the road.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80", icon: "laptop-outline", category: "Work", readTime: "12 min read" },
  { id: "7", title: "Travel Credit Cards 2026", desc: "Maximize rewards, avoid foreign transaction fees, and get travel insurance benefits with the best credit cards for travelers.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", icon: "card-outline", category: "Finance", readTime: "9 min read" },
  { id: "8", title: "Language Learning for Travel", desc: "Master essential phrases, use translation apps effectively, and communicate with locals even with limited language skills.", image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80", icon: "chatbubbles-outline", category: "Culture", readTime: "8 min read" },
  { id: "9", title: "Sustainable Travel Tips", desc: "Reduce your carbon footprint, support local communities, avoid single-use plastics, and travel responsibly to protect our planet.", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80", icon: "leaf-outline", category: "Eco", readTime: "7 min read" },
  { id: "10", title: "Travel Insurance Explained", desc: "Understand what travel insurance covers, when you need it, and how to choose the right policy for your trip type and destination.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80", icon: "shield-outline", category: "Insurance", readTime: "11 min read" },
];

export default function Discover() {
  const [userName, setUserName] = useState("");
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setUserName(user.displayName.split(" ")[0]);
    }
    const sub = Dimensions.addEventListener("change", ({ window }) => setScreenWidth(window.width));
    return () => sub?.remove?.();
  }, []);

  const isNarrow = screenWidth < 700;
  const contentMaxWidth = isWeb ? Math.min(screenWidth, 1100) : screenWidth;

  const handleDestinationPress = (destination) => {
    const locationInfo = {
      name: destination.name,
      address: `${destination.name}, ${destination.country}`,
      placeId: null,
      photoRef: null,
      coordinates: null,
    };
    router.push({ pathname: "/create-trip/travel-dates", params: { locationInfo: JSON.stringify(locationInfo) } });
  };

  const handleCategoryPress = (category) => {
    router.push({ pathname: "/discover/category", params: { category: category.name } });
  };

  const handleTipPress = (tip) => {
    router.push({ pathname: "/discover/tip-details", params: { tip: JSON.stringify(tip) } });
  };

  const handleSeeAllDestinations = () => router.push("/discover/all-destinations");
  const handleSeeAllTips = () => router.push("/discover/all-tips");

  const DestinationCard = ({ item }) => (
    <TouchableOpacity style={[styles.destinationCard, { backgroundColor: theme.colors.card }]} activeOpacity={0.9} onPress={() => handleDestinationPress(item)}>
      <Image source={{ uri: item.image }} style={styles.destinationImage} resizeMode="cover" />
      <View style={styles.gradientOverlay}>
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name={item.badgeIcon} size={12} color="#fff" />
          <Text style={[styles.badgeText, { fontFamily: "Outfit-Bold" }]}>{item.badge}</Text>
        </View>
        <View style={styles.destinationInfo}>
          <Text style={[styles.destinationName, { fontFamily: "Outfit-Bold" }]}>{item.name}</Text>
          <Text style={[styles.destinationCountry, { fontFamily: "Outfit-Regular" }]}>{item.country}</Text>
          <Text style={[styles.destinationDesc, { fontFamily: "Outfit-Regular" }]}>{item.desc}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={[styles.statText, { fontFamily: "Outfit-Medium" }]}>{item.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color="#fff" />
              <Text style={[styles.statText, { fontFamily: "Outfit-Medium" }]}>{item.trips}</Text>
            </View>
          </View>
          <View style={styles.enhancedInfo}>
            <View style={styles.infoChip}>
              <Ionicons name="calendar" size={12} color="#fff" />
              <Text style={[styles.infoChipText, { fontFamily: "Outfit-Regular" }]}>{item.bestTime}</Text>
            </View>
            <View style={styles.infoChip}>
              <Ionicons name="cash" size={12} color="#fff" />
              <Text style={[styles.infoChipText, { fontFamily: "Outfit-Regular" }]}>{item.avgCost}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryCard = ({ item }) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: theme.colors.card }]} activeOpacity={0.75} onPress={() => handleCategoryPress(item)}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + "20" }]}>
        <Ionicons name={item.icon} size={26} color={item.color} />
      </View>
      <Text style={[styles.categoryName, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>{item.name}</Text>
      <Text style={[styles.categoryDesc, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>{item.desc}</Text>
    </TouchableOpacity>
  );

  const TipCard = ({ item }) => (
    <TouchableOpacity style={[styles.tipCard, { backgroundColor: theme.colors.card, width: isNarrow ? "100%" : "calc(50% - 8px)" }]} activeOpacity={0.8} onPress={() => handleTipPress(item)}>
      <Image source={{ uri: item.image }} style={styles.tipImage} resizeMode="cover" />
      <View style={styles.tipContent}>
        <View style={styles.tipHeader}>
          <View style={[styles.tipCategoryBadge, { backgroundColor: theme.colors.primary + "20" }]}>
            <Text style={[styles.tipCategory, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>{item.category}</Text>
          </View>
          <Text style={[styles.tipReadTime, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>{item.readTime}</Text>
        </View>
        <Text style={[styles.tipTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.tipDesc, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]} numberOfLines={2}>{item.desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <View style={{ maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" }}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                {userName ? `Welcome back, ${userName}` : "Welcome back"}
              </Text>
              <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Discover</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.card }]} onPress={() => router.push("/create-trip/searchplace")} activeOpacity={0.7}>
                <Ionicons name="search-outline" size={22} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.colors.card }]} activeOpacity={0.7}>
                <Ionicons name="heart-outline" size={22} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.quickStartCard, { backgroundColor: theme.colors.primary }]} onPress={() => router.push("/create-trip/searchplace")} activeOpacity={0.92}>
            <View style={styles.quickStartContent}>
              <Text style={[styles.quickStartTitle, { fontFamily: "Outfit-Bold" }]}>Plan Your Next Adventure</Text>
              <Text style={[styles.quickStartDesc, { fontFamily: "Outfit-Regular" }]}>AI-powered itineraries tailored just for you</Text>
            </View>
            <View style={styles.quickStartIcon}>
              <Ionicons name="sparkles" size={44} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Explore by Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
              {CATEGORIES.map((category) => <CategoryCard key={category.id} item={category} />)}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWithIcon}>
                <Ionicons name="flame" size={22} color={theme.colors.primary} />
                <Text style={[styles.sectionTitleText, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Trending Destinations</Text>
              </View>
              <TouchableOpacity onPress={handleSeeAllDestinations}>
                <Text style={[styles.seeAllText, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={TRENDING_DESTINATIONS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <DestinationCard item={item} />}
              contentContainerStyle={styles.destinationsContainer}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWithIcon}>
                <Ionicons name="bulb" size={22} color={theme.colors.primary} />
                <Text style={[styles.sectionTitleText, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Travel Tips & Guides</Text>
              </View>
              <TouchableOpacity onPress={handleSeeAllTips}>
                <Text style={[styles.seeAllText, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tipsGrid}>
              {TRAVEL_TIPS.map((tip) => <TipCard key={tip.id} item={tip} />)}
            </View>
          </View>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 40, paddingBottom: 24 },
  greeting: { fontSize: 14, marginBottom: 4 },
  heading: { fontSize: 30, fontWeight: "700" },
  headerActions: { flexDirection: "row", gap: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  quickStartCard: { padding: 22, borderRadius: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28, shadowColor: "#007bff", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  quickStartContent: { flex: 1 },
  quickStartTitle: { fontSize: 18, color: "#fff", marginBottom: 4 },
  quickStartDesc: { fontSize: 13, color: "#fff", opacity: 0.9 },
  quickStartIcon: { marginLeft: 12 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  sectionTitleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 19, fontWeight: "700", marginBottom: 16 },
  sectionTitleText: { fontSize: 19, fontWeight: "700" },
  seeAllText: { fontSize: 14 },
  categoriesContainer: { gap: 12, paddingBottom: 4 },
  categoryCard: { alignItems: "center", padding: 16, borderRadius: 16, width: 110, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  categoryName: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  categoryDesc: { fontSize: 10, textAlign: "center" },
  destinationsContainer: { gap: 16, paddingBottom: 4 },
  destinationCard: { width: CARD_WIDTH, height: 440, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  destinationImage: { width: "100%", height: "100%" },
  gradientOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "space-between", padding: 20 },
  badge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: "#fff", fontSize: 12 },
  destinationInfo: { marginTop: "auto" },
  destinationName: { fontSize: 26, color: "#fff", marginBottom: 4 },
  destinationCountry: { fontSize: 15, color: "#fff", opacity: 0.8, marginBottom: 8 },
  destinationDesc: { fontSize: 13, color: "#fff", opacity: 0.7, marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 13, color: "#fff" },
  enhancedInfo: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  infoChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  infoChipText: { fontSize: 11, color: "#fff" },
  tipsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  tipCard: { flexDirection: "row", borderRadius: 16, overflow: "hidden", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tipImage: { width: 100, height: 100 },
  tipContent: { flex: 1, padding: 12 },
  tipHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  tipCategoryBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  tipCategory: { fontSize: 10, textTransform: "uppercase", fontWeight: "600" },
  tipReadTime: { fontSize: 11 },
  tipTitle: { fontSize: 14, marginBottom: 4 },
  tipDesc: { fontSize: 12, lineHeight: 16 },
});
