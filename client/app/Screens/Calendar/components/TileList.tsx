import { FC } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ICalendarListEntry } from "@app/types";
import AntDesign from "react-native-vector-icons/AntDesign";

type TilesListProps = {
  items: ICalendarListEntry[];
  onTilePress: (item: ICalendarListEntry) => void;
};

export const TilesList: FC<TilesListProps> = ({ items, onTilePress }) => {
  const renderTile = ({ item }: { item: ICalendarListEntry }) => (
    <Pressable
      className="bg-white m-2 p-4 rounded-lg shadow-md active:bg-gray-100"
      onPress={() => onTilePress(item)}
    >
      <View className={"flex items-center justify-center"}>
        {item.primary ? (
          <Text className="text-lg font-medium text-gray-800">
            Primary <AntDesign name={"star"} />
          </Text>
        ) : (
          <Text className="text-lg font-medium text-gray-800">
            {item.summary}
          </Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView>
      <View className="mx-4 mt-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4">
        <Text className="text-base font-semibold text-slate-600 text-center">
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
