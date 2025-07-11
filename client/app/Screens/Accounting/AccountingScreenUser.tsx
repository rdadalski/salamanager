import React from "react";
import { View, Text } from "react-native";

const AccountingScreenUser = () => {
  const amountOwed = 75;

  return (
    <View className="flex-1 bg-gray-900">
      <View className="bg-slate-800 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">My Account 💳</Text>
        <Text className="text-slate-300 text-base mt-1">
          Here's your payment status.
        </Text>
      </View>

      <View className="px-6 mt-4">
        <View className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 items-center">
          <Text className="text-lg font-semibold text-white mb-2">
            Amount Owed
          </Text>
          <Text className="text-4xl font-bold text-red-400">
            ${amountOwed}
          </Text>
          <Text className="text-gray-400 text-sm mt-2">
            Please settle the amount at your earliest convenience.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AccountingScreenUser;
