import { View, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { FC, useState } from "react";
import { CalendarStackParamList } from "@app/navigation/CalendarNavigation";
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  EventItem,
  OnEventResponse,
  ThemeConfigs,
} from "@howljs/calendar-kit";
import { useCalendarEvents } from "@app/Screens/Calendar/hooks/useCalendarEvents";
import { FullscreenModal } from "@app/components/CustomModal";
import { CustomButton } from "@app/components";
import {
  useInitialCalendarSyncMutation,
  useSyncCalendarEventsMutation,
} from "@app/api";
import { selectUser } from "@app/store/slices";
import { useAppSelector } from "@app/hooks/redux";
import EventInfo from "@app/Screens/Calendar/components/EventInfo";
import { useColorScheme } from "nativewind";

const BLUE_COLOR = "#3B82F6";

export const CalendarEvents: FC = () => {
  const route = useRoute<RouteProp<CalendarStackParamList, "CalendarEvents">>();
  const { calendarId } = route.params;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();

  const userData = useAppSelector(selectUser);

  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const {
    libraryEvents,
    handleDragStart,
    handleDragEnd,
    isLoading,
    isSuccess,
    refetchCalendarEvents,
  } = useCalendarEvents(calendarId);

  const handlePressEvent = (event: OnEventResponse) => {
    setModalVisible(true);
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const [initialCalendarSync] = useInitialCalendarSyncMutation();

  const handleTest = async () => {
    console.log(userData);
    if (!userData) return;

    const res = await initialCalendarSync({
      calendarId,
      userId: userData.uid as string,
    });

    console.log(res);
    await refetchCalendarEvents();
  };

  const calendarKitTheme = {
    primary: BLUE_COLOR,
    background: isDarkMode ? "#1F2937" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1F2937",
    textSecondary: isDarkMode ? "#9CA3AF" : "#6B7280",
    border: isDarkMode ? "#374151" : "#E5E7EB",
  };

  return (
    <>
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
            <ActivityIndicator size="large" color={BLUE_COLOR} />
          </View>
        ) : (
          <View className={"flex-1"}>
            <View className={"w-full p-2"}>
              <CustomButton
                iconName={"sync"}
                onPress={handleTest}
                title={"Initial Sync"}
              />
            </View>
            <View className={"flex-1"}>
              <CalendarContainer
                theme={calendarKitTheme as Partial<ThemeConfigs>}
                allowDragToEdit={true}
                onLoad={() => {
                  setCalendarLoading(false);
                }}
                onDragEventStart={handleDragStart}
                onDragEventEnd={handleDragEnd}
                onPressEvent={handlePressEvent}
                events={libraryEvents as EventItem[]}
              >
                {calendarLoading ? (
                  <View className="flex-1 justify-center items-center bg-white dark:bg-gray-800">
                    <ActivityIndicator size="large" color={BLUE_COLOR} />
                  </View>
                ) : (
                  <>
                    <CalendarHeader />
                    <CalendarBody />
                  </>
                )}
              </CalendarContainer>
            </View>
          </View>
        )}
        <FullscreenModal
          component={EventInfo}
          componentProps={{
            eventId: selectedEvent?.id as string,
            resourceId: selectedEvent?.resourceId as string,
          }}
          visible={modalVisible}
          onClose={handleModalClose}
        ></FullscreenModal>
      </View>
    </>
  );
};
