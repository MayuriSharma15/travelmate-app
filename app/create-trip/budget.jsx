import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState, useEffect } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useTheme } from "@/context/ThemeContext";

const BUDGET_OPTIONS = [
  {
    id: "Cheap",
    title: "Economy",
    subtitle: "Budget-friendly travel",
    icon: "leaf-outline",
    accentColor: "#2E7D5E",
    bgColor: "#E8F5F0",
    tags: ["Hostels", "Street Food", "Public Transit"],
  },
  {
    id: "Moderate",
    title: "Standard",
    subtitle: "Comfortable mid-range",
    icon: "business-outline",
    accentColor: "#1565C0",
    bgColor: "#E3F0FF",
    tags: ["3-Star Hotels", "Casual Dining", "Taxis"],
  },
  {
    id: "Luxury",
    title: "Premium",
    subtitle: "High-end experience",
    icon: "diamond-outline",
    accentColor: "#6A1B9A",
    bgColor: "#F3E8FF",
    tags: ["5-Star Hotels", "Fine Dining", "Private Transfers"],
  },
];

export default function Budget() {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const { theme, isDarkMode } = useTheme();
  const [selectedBudget, setSelectedBudget] = useState(null);

  useEffect(() => {
    console.log("=== BUDGET SCREEN MOUNTED ===");
    if (!tripData?.locationInfo) {
      router.replace("/create-trip/searchplace");
      return;
    }
    if (!tripData?.travelerCount) {
      router.replace("/create-trip/travelers");
      return;
    }
    if (tripData?.budget) {
      setSelectedBudget(tripData.budget);
    }
  }, []);

  const handleNext = () => {
    if (!selectedBudget) {
      alert("Please select your budget");
      return;
    }
    const selectedOption = BUDGET_OPTIONS.find(opt => opt.id === selectedBudget);
    setTripData({
      ...tripData,
      budget: selectedOption.id,
      budgetInfo: {
        id: selectedOption.id,
        title: selectedOption.title,
        description: selectedOption.subtitle,
      },
    });
    setTimeout(() => {
      router.push("/create-trip/travel-dates");
    }, 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          What's your budget?
        </Text>
        <Text style={[styles.subText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          This shapes your hotels, dining and activities
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.progressFill, { width: "50%", backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          Step 2 of 4
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {BUDGET_OPTIONS.map((option) => {
          const isSelected = selectedBudget === option.id;
          const cardBg = isDarkMode
            ? isSelected ? option.accentColor + "22" : theme.colors.card
            : isSelected ? option.bgColor : theme.colors.card;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor: cardBg,
                  borderColor: isSelected ? option.accentColor : theme.colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedBudget(option.id)}
              activeOpacity={0.75}
            >
              {/* Icon */}
              <View style={[styles.iconBox, { backgroundColor: option.accentColor + "18" }]}>
                <Ionicons name={option.icon} size={26} color={option.accentColor} />
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.optionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                    {option.title}
                  </Text>
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: option.accentColor }]}>
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.optionSubtitle, { fontFamily: "Outfit-Medium", color: option.accentColor }]}>
                  {option.subtitle}
                </Text>

                <View style={styles.tagsRow}>
                  {option.tags.map((tag, i) => (
                    <View key={i} style={[styles.tag, { backgroundColor: option.accentColor + "15" }]}>
                      <Text style={[styles.tagText, { color: option.accentColor, fontFamily: "Outfit-Regular" }]}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={option.accentColor} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: selectedBudget ? theme.colors.primary : theme.colors.border },
          ]}
          onPress={handleNext}
          disabled={!selectedBudget}
        >
          <Text style={[styles.buttonText, { fontFamily: "Outfit-Bold" }]}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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
    paddingBottom: 16,
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 6,
  },

  subText: {
    fontSize: 15,
    lineHeight: 22,
  },

  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },

  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  progressText: {
    fontSize: 12,
  },

  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 14,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
    gap: 3,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  optionTitle: {
    fontSize: 17,
  },

  selectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },

  selectedBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Outfit-Medium",
  },

  optionSubtitle: {
    fontSize: 13,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 5,
  },

  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  tagText: {
    fontSize: 11,
  },

  buttonContainer: {
    padding: 20,
    paddingBottom: 32,
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
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
});