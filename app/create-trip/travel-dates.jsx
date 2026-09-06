import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState, useEffect } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useTheme } from "@/context/ThemeContext";
import { Calendar } from "react-native-calendars";

export default function TravelDates() {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const { theme, isDarkMode } = useTheme();
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    console.log("=== TRAVEL DATES MOUNTED ===");
    console.log("Current tripData:", tripData);

    // Validate previous steps
    if (!tripData?.locationInfo) {
      console.warn("No location, redirecting");
      router.replace("/create-trip/searchplace");
      return;
    }

    if (!tripData?.travelerCount) {
      console.warn("No travelers, redirecting");
      router.replace("/create-trip/travelers");
      return;
    }

    if (!tripData?.budget) {
      console.warn("No budget, redirecting");
      router.replace("/create-trip/budget");
      return;
    }
  }, []);

  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: '#007bff',
          textColor: 'white',
        },
      });
    } else {
      // Set end date
      if (new Date(day.dateString) < new Date(startDate)) {
        Alert.alert("Invalid Date", "End date must be after start date");
        return;
      }
      
      setEndDate(day.dateString);
      
      // Create marked dates for range
      const range = getDateRange(startDate, day.dateString);
      const marked = {};
      
      range.forEach((date, index) => {
        if (index === 0) {
          marked[date] = { startingDay: true, color: '#007bff', textColor: 'white' };
        } else if (index === range.length - 1) {
          marked[date] = { endingDay: true, color: '#007bff', textColor: 'white' };
        } else {
          marked[date] = { color: '#007bff30', textColor: isDarkMode ? 'white' : 'black' };
        }
      });
      
      setMarkedDates(marked);
    }
  };

  const getDateRange = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);
    
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleNext = () => {
    if (!startDate || !endDate) {
      Alert.alert("Select Dates", "Please select both start and end dates");
      return;
    }

    const days = calculateDays(startDate, endDate);
    
    console.log("=== SAVING DATES ===");
    console.log("Start:", startDate, "End:", endDate, "Days:", days);
    
    // Save dates to context, preserve ALL existing data
    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalDays: days,
    });

    console.log("Navigating to review");
    setTimeout(() => {
      router.push("/create-trip/review");
    }, 100);
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
            When are you going?
          </Text>
          <Text style={[styles.subText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            Select your travel dates
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "75%", backgroundColor: theme.colors.primary }]} />
          </View>
          <Text style={[styles.progressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            Step 3 of 4
          </Text>
        </View>

        {/* Selected Dates Display */}
        {(startDate || endDate) && (
          <View style={[styles.selectedDatesCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <View style={styles.dateInfo}>
                <Text style={[styles.dateLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                  Start Date
                </Text>
                <Text style={[styles.dateValue, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                  {formatDate(startDate) || "Not selected"}
                </Text>
              </View>
            </View>

            <View style={styles.dateSeparator} />

            <View style={styles.dateItem}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <View style={styles.dateInfo}>
                <Text style={[styles.dateLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                  End Date
                </Text>
                <Text style={[styles.dateValue, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                  {formatDate(endDate) || "Not selected"}
                </Text>
              </View>
            </View>

            {startDate && endDate && (
              <View style={[styles.daysChip, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.daysText, { fontFamily: "Outfit-Bold" }]}>
                  {calculateDays(startDate, endDate)} days
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            markingType={'period'}
            minDate={new Date().toISOString().split('T')[0]}
            theme={{
              calendarBackground: theme.colors.card,
              textSectionTitleColor: theme.colors.textSecondary,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.border,
              monthTextColor: theme.colors.text,
              textDayFontFamily: 'Outfit-Regular',
              textMonthFontFamily: 'Outfit-Bold',
              textDayHeaderFontFamily: 'Outfit-Medium',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
            style={[styles.calendar, { backgroundColor: theme.colors.card }]}
          />
        </View>

        {/* Instruction */}
        <View style={[styles.instructionCard, { backgroundColor: theme.colors.card }]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.instructionText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            {!startDate ? "Tap a date to select start date" : !endDate ? "Tap another date to select end date" : "Dates selected successfully!"}
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button - ALWAYS VISIBLE */}
      <View style={[styles.bottomButtonContainer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: (startDate && endDate) ? theme.colors.primary : theme.colors.border },
            !(startDate && endDate) && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!(startDate && endDate)}
        >
          <Text style={[styles.buttonText, { fontFamily: "Outfit-Bold" }]}>
            Continue
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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

  scrollContent: {
    paddingBottom: 100, // Space for fixed button
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

  selectedDatesCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dateInfo: {
    flex: 1,
  },

  dateLabel: {
    fontSize: 12,
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 16,
    fontWeight: "600",
  },

  dateSeparator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 12,
  },

  daysChip: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  daysText: {
    color: "#fff",
    fontSize: 14,
  },

  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  calendar: {
    borderRadius: 16,
    padding: 10,
  },

  instructionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },

  instructionText: {
    flex: 1,
    fontSize: 13,
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#333",
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

  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});