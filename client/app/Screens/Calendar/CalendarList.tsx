import { FC } from "react";
import { useListCalendarsQuery } from "@app/api";
import { TilesList } from "@app/Screens/Calendar/components/TileList";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarStackParamList } from "@app/navigation/CalendarNavigation";
import { ICalendarListEntry } from "@app/types";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useAppDispatch } from "@app/hooks/redux";
import { setDefaultCalendarId } from "@app/store/slices";
import { storeData } from "@app/services";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "@app/components";

export const CalendarList: FC = () => {
  const dispatch = useAppDispatch();

  const { data: calendarList, refetch } = useListCalendarsQuery();

  const navigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();

  const handleCalendarSelect = async (item: ICalendarListEntry) => {
    dispatch(setDefaultCalendarId(item.id));
    await storeData(item.id, "default_user_calendar_id");
    navigation.navigate("Calendar Events", { calendarId: item.id });
  };

  const handleRefetch = () => {
    refetch();
  };

  return (
    <View className="flex w-full">
      <CustomButton
        title={"Refetch"}
        iconName={"sync"}
        onPress={handleRefetch}
      />
      <View className="bg-white rounded-xl p-8 m-4 items-center border border-slate-200">
        <AntDesign
          name="calendar"
          size={40}
          className="text-slate-500 dark:text-white mb-4"
        />
        <Text className="text-slate-500 font-semibold text-center">
          Nie masz jeszcze wybranego kalendarza
        </Text>
      </View>
      <TilesList onTilePress={handleCalendarSelect} items={calendarList} />
    </View>
  );
};
