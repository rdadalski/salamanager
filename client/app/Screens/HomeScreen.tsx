import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

interface NextSession {
  id: string;
  date: string;
  time: string;
  trainer: string;
  location: string;
  workoutType?: string;
}

interface RecentSession {
  id: string;
  date: string;
  workoutType: string;
  duration: number;
}

export const HomeScreen: React.FC = () => {
  // Mock data - replace with your actual data fetching
  const nextSession: NextSession = {
    id: "1",
    date: "2025-06-11",
    time: "2:00 PM",
    trainer: "Sarah Johnson",
    location: "Downtown Gym",
    workoutType: "Upper Body Strength",
  };

  const recentSessions: RecentSession[] = [
    {
      id: "1",
      date: "2025-06-09",
      workoutType: "Cardio & Core",
      duration: 45,
    },
    {
      id: "2",
      date: "2025-06-07",
      workoutType: "Full Body",
      duration: 60,
    },
    {
      id: "3",
      date: "2025-06-05",
      workoutType: "Lower Body",
      duration: 50,
    },
  ];

  const weeklyCount = 4;

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

  // const handleViewAllHistory = () => {
  //   navigation.navigate("History");
  // };

  const handleSessionPress = (sessionId: string) => {
    // Navigate to session details if you have that screen
    // navigation.navigate('SessionDetails', { sessionId });
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-slate-800 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">Hi there! 👋</Text>
        <Text className="text-slate-300 text-base mt-1">
          Ready for your next workout?
        </Text>
      </View>

      <View className="px-6 -mt-4">
        {/* Next Session Card */}
        {nextSession ? (
          <TouchableOpacity
            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700"
            onPress={() => handleSessionPress(nextSession.id)}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-white">
                Next Session
              </Text>
              <View className="bg-green-900 px-3 py-1 rounded-full">
                <Text className="text-green-300 text-sm font-medium">
                  Scheduled
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-blue-900 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-300 font-bold text-lg">📅</Text>
                </View>
                <View>
                  <Text className="text-gray-100 font-semibold text-base">
                    {formatDate(nextSession.date)}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {nextSession.time}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-purple-900 rounded-full items-center justify-center mr-3">
                  <Text className="text-purple-300 font-bold text-lg">👨‍💼</Text>
                </View>
                <View>
                  <Text className="text-gray-100 font-semibold text-base">
                    {nextSession.trainer}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {nextSession.location}
                  </Text>
                </View>
              </View>

              {nextSession.workoutType && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-orange-900 rounded-full items-center justify-center mr-3">
                    <Text className="text-orange-300 font-bold text-lg">
                      💪
                    </Text>
                  </View>
                  <Text className="text-gray-100 font-semibold text-base">
                    {nextSession.workoutType}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <Text className="text-gray-300 text-center text-base">
              No upcoming sessions scheduled
            </Text>
            <Text className="text-gray-500 text-center text-sm mt-1">
              Check back later or contact your trainer
            </Text>
          </View>
        )}

        {/* Quick Stats */}
        <View className="mt-6 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
          <Text className="text-lg font-semibold text-white mb-4">
            This Week
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-400">
                {weeklyCount}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Sessions</Text>
            </View>

            <View className="items-center">
              <Text className="text-3xl font-bold text-green-400">
                {recentSessions.length}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Completed</Text>
            </View>

            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-400">
                {Math.max(0, weeklyCount - recentSessions.length)}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Remaining</Text>
            </View>
          </View>
        </View>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <View className="mt-6 bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-white">
                Recent Sessions
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-400 font-medium">View All</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              {recentSessions.slice(0, 3).map((session) => (
                <TouchableOpacity
                  key={session.id}
                  className="flex-row justify-between items-center py-2"
                  onPress={() => handleSessionPress(session.id)}
                >
                  <View>
                    <Text className="text-gray-100 font-medium text-base">
                      {session.workoutType}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-100 font-semibold text-sm">
                      {session.duration} min
                    </Text>
                    <Text className="text-green-400 text-xs font-medium">
                      Completed
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
