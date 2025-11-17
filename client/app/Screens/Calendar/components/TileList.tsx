import type { FC } from "react";
import { FlatList, Pressable, Text, View, SafeAreaView } from "react-native";
import type { ICalendarListEntry } from "@app/types";
import AntDesign from "react-native-vector-icons/AntDesign";

interface TilesListProps {
  items: ICalendarListEntry[] | undefined;
  onTilePress: (item: ICalendarListEntry) => void;
}

export const TilesList: FC<TilesListProps> = ({ items, onTilePress }) => {
  const renderTile = ({ item }: { item: ICalendarListEntry }) => (
    <Pressable
      className="bg-white dark:bg-gray-800 m-2 p-4 rounded-lg shadow-md active:bg-gray-100 dark:active:bg-gray-700"
      onPress={() => onTilePress(item)}
    >
      <View className={"flex-row items-center justify-center"}>
        {item.primary ? (
          <>
            <Text className="text-lg font-medium text-gray-800 dark:text-gray-200 mr-2">
              Primary
            </Text>
            <AntDesign name={"star"} size={18} className="text-yellow-500" />
          </>
        ) : (
          <Text className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {item.summary}
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="mx-4 mt-2 bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4">
        <Text className="text-base font-semibold text-slate-600 dark:text-slate-400 text-center">
          Wybierz kalendarz z listy, aby zobaczyć swoje wydarzenia.
        </Text>
      </View>

      <FlatList
        className="w-full p-2"
        data={items}
        renderItem={renderTile}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};
