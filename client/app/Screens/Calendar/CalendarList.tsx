import { FC } from "react";
import { useListCalendarsQuery } from "@app/api";
import { TilesList } from "@app/Screens/Calendar/components/TileList";
import { View } from "react-native";
import { CustomButton } from "@app/components";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarStackParamList } from "@app/navigation/CalendarNavigation";
import { ICalendarListEntry } from "@app/types";

export const CalendarList: FC = () => {
  const { data: calendarList, refetch } = useListCalendarsQuery();

  const navigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();

  const handleCalendarSelect = (item: ICalendarListEntry) => {
    navigation.navigate("CalendarEvents", { calendarId: item.id });
  };

  const handleRefetch = () => {
    refetch();
  };

  return (
    <View className="flex w-full">
      <CustomButton title={"Refetch"} iconName={""} onPress={handleRefetch} />

      <TilesList onTilePress={handleCalendarSelect} items={calendarList} />
    </View>
  );
};
