import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

// All 15 tips
const ALL_TIPS = [
  {
    id: "1",
    title: "Best Time to Visit Europe",
    desc: "Spring (April-June) and Fall (September-October) offer pleasant weather, fewer crowds, and better prices across European destinations.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80",
    icon: "calendar-outline",
    category: "Timing",
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Budget Travel Hacks",
    desc: "Book flights on Tuesday, use local transportation, eat where locals eat, and stay in hostels or Airbnbs to save up to 60% on travel costs.",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80",
    icon: "wallet-outline",
    category: "Budget",
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "Packing Essentials",
    desc: "Pack versatile clothing, a universal adapter, portable charger, first-aid kit, and always keep medications in carry-on luggage.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80",
    icon: "bag-handle-outline",
    category: "Tips",
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Solo Travel Safety",
    desc: "Share your itinerary with family, keep copies of important documents, trust your instincts, and research local customs before traveling.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
    icon: "shield-checkmark-outline",
    category: "Safety",
    readTime: "7 min read",
  },
  {
    id: "5",
    title: "Photography Tips for Travelers",
    desc: "Wake up early for golden hour shots, respect local customs, shoot in RAW format, and always ask permission before photographing people.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80",
    icon: "camera-outline",
    category: "Photography",
    readTime: "10 min read",
  },
  {
    id: "6",
    title: "Digital Nomad Guide",
    desc: "Learn how to work remotely while traveling, find coworking spaces, manage time zones, and maintain work-life balance on the road.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80",
    icon: "laptop-outline",
    category: "Work",
    readTime: "12 min read",
  },
  {
    id: "7",
    title: "Travel Credit Cards 2026",
    desc: "Maximize rewards, avoid foreign transaction fees, and get travel insurance benefits with the best credit cards for travelers.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    icon: "card-outline",
    category: "Finance",
    readTime: "9 min read",
  },
  {
    id: "8",
    title: "Language Learning for Travel",
    desc: "Master essential phrases, use translation apps effectively, and communicate with locals even with limited language skills.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80",
    icon: "chatbubbles-outline",
    category: "Culture",
    readTime: "8 min read",
  },
  {
    id: "9",
    title: "Sustainable Travel Tips",
    desc: "Reduce your carbon footprint, support local communities, avoid single-use plastics, and travel responsibly to protect our planet.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
    icon: "leaf-outline",
    category: "Eco",
    readTime: "7 min read",
  },
  {
    id: "10",
    title: "Travel Insurance Explained",
    desc: "Understand what travel insurance covers, when you need it, and how to choose the right policy for your trip type and destination.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80",
    icon: "shield-outline",
    category: "Insurance",
    readTime: "11 min read",
  },
  {
    id: "11",
    title: "Food Safety While Traveling",
    desc: "Avoid getting sick abroad by following food safety rules, identifying safe street food, and knowing when to seek medical attention.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    icon: "restaurant-outline",
    category: "Health",
    readTime: "6 min read",
  },
  {
    id: "12",
    title: "Best Travel Apps 2026",
    desc: "Essential apps for navigation, translation, accommodation booking, flight tracking, and staying connected while traveling internationally.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
    icon: "phone-portrait-outline",
    category: "Technology",
    readTime: "10 min read",
  },
  {
    id: "13",
    title: "Airport Hacks & Tips",
    desc: "Navigate airports like a pro with TSA PreCheck tips, lounge access strategies, dealing with delays, and maximizing layover time.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80",
    icon: "airplane-outline",
    category: "Flying",
    readTime: "8 min read",
  },
  {
    id: "14",
    title: "Travel with Kids Guide",
    desc: "Make family travel stress-free with packing tips, entertainment ideas, choosing kid-friendly destinations, and managing jet lag.",
    image: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&q=80",
    icon: "people-outline",
    category: "Family",
    readTime: "12 min read",
  },
  {
    id: "15",
    title: "Visa & Passport Requirements",
    desc: "Navigate visa applications, passport validity requirements, visa-free countries, and expedited passport services for urgent travel.",
    image: "https://images.unsplash.com/photo-1578665990562-63e1e509ae35?w=400&q=80",
    icon: "document-text-outline",
    category: "Documents",
    readTime: "9 min read",
  },
];

const CATEGORY_FILTERS = ["All", "Budget", "Safety", "Tips", "Culture", "Health", "Technology", "Work", "Family"];

export default function AllTips() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTips = selectedCategory === "All" 
    ? ALL_TIPS 
    : ALL_TIPS.filter(tip => tip.category === selectedCategory);

  const handleTipPress = (tip) => {
    router.push({
      pathname: "/discover/tip-details",
      params: { tip: JSON.stringify(tip) },
    });
  };

  const renderTip = ({ item }) => (
    <TouchableOpacity 
      style={[styles.tipCard, { backgroundColor: theme.colors.card }]}
      activeOpacity={0.7}
      onPress={() => handleTipPress(item)}
    >
      <Image 
        source={{ uri: item.image }}
        style={styles.tipImage}
        resizeMode="cover"
      />
      <View style={styles.tipOverlay}>
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name={item.icon} size={12} color="#fff" />
          <Text style={[styles.categoryText, { fontFamily: "Outfit-Bold" }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.tipInfo}>
          <Text style={[styles.tipTitle, { fontFamily: "Outfit-Bold" }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.tipDesc, { fontFamily: "Outfit-Regular" }]} numberOfLines={2}>
            {item.desc}
          </Text>
          <Text style={[styles.readTime, { fontFamily: "Outfit-Regular" }]}>
            <Ionicons name="time-outline" size={14} color="#fff" /> {item.readTime}
          </Text>
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
        <View style={styles.headerTitleContainer}>
          <Ionicons name="bulb" size={24} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
            Travel Tips & Guides
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={CATEGORY_FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                { 
                  backgroundColor: selectedCategory === item ? theme.colors.primary : theme.colors.card,
                  borderWidth: 1,
                  borderColor: selectedCategory === item ? theme.colors.primary : theme.colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(item)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.filterText, 
                  { 
                    fontFamily: "Outfit-Medium",
                    color: selectedCategory === item ? "#fff" : theme.colors.text 
                  }
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Tips Grid */}
      <FlatList
        data={filteredTips}
        renderItem={renderTip}
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
    paddingBottom: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  filtersContainer: {
    marginBottom: 16,
  },

  filtersList: {
    paddingHorizontal: 20,
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  filterText: {
    fontSize: 13,
  },

  grid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  row: {
    justifyContent: "space-between",
  },

  tipCard: {
    width: "48%",
    height: 280,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  tipImage: {
    width: "100%",
    height: "100%",
  },

  tipOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "75%",
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 12,
    justifyContent: "space-between",
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoryText: {
    fontSize: 10,
    color: "#fff",
  },

  tipInfo: {
    marginTop: "auto",
  },

  tipTitle: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 6,
    lineHeight: 20,
  },

  tipDesc: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 15,
  },

  readTime: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.7,
  },
});
