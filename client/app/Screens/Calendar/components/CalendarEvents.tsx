import { View, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FC } from "react";
import { CalendarStackParamList } from "@app/navigation/CalendarNavigation";
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  EventItem,
} from "@howljs/calendar-kit";
import { useCalendarEvents } from "@app/Screens/Calendar/hooks/useCalendarEvents";

export const CalendarEvents: FC = () => {
  const route = useRoute<RouteProp<CalendarStackParamList, "CalendarEvents">>();
  const { calendarId } = route.params;

  const {
    calendarEvents,
    handleDragStart,
    handleDragEnd,
    isLoading,
    isSuccess,
  } = useCalendarEvents(calendarId);

  return (
    <>
      <View className="flex h-full">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className={"w-full flex h-full"}>
            {isSuccess && (
              <CalendarContainer
                allowDragToEdit={true}
                onDragEventStart={handleDragStart}
                onDragEventEnd={handleDragEnd}
                events={calendarEvents as EventItem[]}
              >
                <CalendarHeader />
                <CalendarBody />
              </CalendarContainer>
            )}
          </View>
        )}
      </View>
    </>
  );
};
