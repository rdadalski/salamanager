import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  summary: string;
  location: string;
  calendar: string;
}

export const CalendarScreen: React.FC = () => {
  // Mock data - replace with your actual data fetching
  const nextEvent: CalendarEvent = {
    id: "1",
    date: "2025-07-04",
    time: "10:00 AM",
    summary: "Team Standup",
    location: "Virtual Meeting",
    calendar: "Work",
  };

  const upcomingEvents: CalendarEvent[] = [
    {
      id: "2",
      date: "2025-07-04",
      time: "2:00 PM",
      summary: "Project Sync",
      location: "Conference Room A",
      calendar: "Work",
    },
    {
      id: "3",
      date: "2025-07-05",
      time: "6:00 PM",
      summary: "Dinner with Friends",
      location: "The Italian Place",
      calendar: "Personal",
    },
    {
      id: "4",
      date: "2025-07-06",
      time: "11:00 AM",
      summary: "Design Review",
      location: "Virtual Meeting",
      calendar: "Work",
    },
  ];

  const eventsTodayCount = upcomingEvents.filter(
    (e) => new Date(e.date).toDateString() === new Date().toDateString(),
  ).length;
  const eventsThisWeekCount = 12; // Mock data

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleEventPress = (eventId: string) => {
    // Navigate to event details
    // navigation.navigate('EventDetails', { eventId });
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-slate-800 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">Your Calendar 🗓️</Text>
        <Text className="text-slate-300 text-base mt-1">
          Here's what's coming up.
        </Text>
      </View>

      <View className="px-6 -mt-4">
        {/* Next Event Card */}
        {nextEvent ? (
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700"
            onPress={() => handleEventPress(nextEvent.id)}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-white">
                Next Event
              </Text>
              <View className="bg-blue-900 px-3 py-1 rounded-full">
                <Text className="text-blue-300 text-sm font-medium">
                  Upcoming
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-green-900 rounded-full items-center justify-center mr-3">
                  <Text className="text-green-300 font-bold text-lg">📅</Text>
                </View>
                <View>
                  <Text className="text-gray-100 font-semibold text-base">
                    {formatDate(nextEvent.date)}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {nextEvent.time}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-900 rounded-full items-center justify-center mr-3">
                  <Text className="text-purple-300 font-bold text-lg">📌</Text>
                </View>
                <View>
                  <Text className="text-gray-100 font-semibold text-base">
                    {nextEvent.summary}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {nextEvent.location}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-orange-900 rounded-full items-center justify-center mr-3">
                  <Text className="text-orange-300 font-bold text-lg">
                    📁
                  </Text>
                </View>
                <Text className="text-gray-100 font-semibold text-base">
                  {nextEvent.calendar}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <Text className="text-gray-300 text-center text-base">
              No upcoming events
            </Text>
            <Text className="text-gray-500 text-center text-sm mt-1">
              Enjoy your free time!
            </Text>
          </View>
        )}

        {/* Quick Stats */}
        <View className="mt-6 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <Text className="text-lg font-semibold text-white mb-4">
            At a Glance
          </Text>

          <View className="flex-row justify-around items-center">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-400">
                {eventsTodayCount}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Today</Text>
            </View>

            <View className="items-center">
              <Text className="text-3xl font-bold text-green-400">
                {eventsThisWeekCount}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">This Week</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View className="mt-6 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-white">
                Upcoming
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-400 font-medium">View All</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => (
                <TouchableOpacity
                  key={event.id}
                  className="flex-row justify-between items-center py-2"
                  onPress={() => handleEventPress(event.id)}
                >
                  <View>
                    <Text className="text-gray-100 font-medium text-base">
                      {event.summary}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {formatDate(event.date)} at {event.time}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-100 font-semibold text-sm">
                      {event.calendar}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};