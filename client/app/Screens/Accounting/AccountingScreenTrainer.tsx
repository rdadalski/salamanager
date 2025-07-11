import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const usersData = [
  { id: "1", name: "John Doe", amount: 50, status: "Paid" },
  { id: "2", name: "Jane Smith", amount: 75, status: "Behind" },
  { id: "3", name: "Peter Jones", amount: 50, status: "Paid" },
  { id: "4", name: "Mary Williams", amount: 100, status: "Behind" },
];

const AccountingScreenTrainer = () => {
  const renderItem = ({ item }: { item: (typeof usersData)[0] }) => (
    <TouchableOpacity className="bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-700 mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-lg font-semibold">{item.name}</Text>
        <Text className="text-white text-lg font-bold">${item.amount}</Text>
        <View
          className={`px-3 py-1 rounded-full ${
            item.status === "Paid" ? "bg-green-900" : "bg-red-900"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              item.status === "Paid" ? "text-green-300" : "text-red-300"
            }`}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-900">
      <View className="bg-slate-800 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">
          Monthly Accounting 🧾
        </Text>
        <Text className="text-slate-300 text-base mt-1">
          Track your client payments.
        </Text>
      </View>

      <View className="px-6 mt-4">
        <FlatList
          data={usersData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default AccountingScreenTrainer;
