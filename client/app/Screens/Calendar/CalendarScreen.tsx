import { FC } from "react";
import { useListCalendarsQuery } from "@app/api";
import { View } from "react-native";
import { CustomButton } from "@app/components";

export const CalendarScreen: FC = () => {
  const {
    data: calendarList,
    isLoading: listIsLoading,
    refetch,
  } = useListCalendarsQuery();

  const handleRefetch = () => {
    refetch();
  };

  return (
    <View className="flex w-full">
      <CustomButton title={"Refetch"} iconName={""} onPress={handleRefetch} />

      {/*<TilesList onTilePress={handleTilePress} items={calendarList} />*/}
    </View>
  );
};
