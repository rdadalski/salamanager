import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

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
  return (
    <View className="flex-1 justify-center items-center">
      <View className="items-center bg-slate-50 dark:bg-slate-900 border rounded-lg p-8">
        <FontAwesome5Icon
          name="cog"
          size={32}
          className="text-slate-400 mb-4"
        />
        <Text className="text-base font-semibold dark:text-white text-slate-600 text-center">
          Work in progress
        </Text>
      </View>
    </View>
  );
};
