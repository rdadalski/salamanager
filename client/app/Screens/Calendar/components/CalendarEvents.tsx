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
} from "@howljs/calendar-kit";
import { useCalendarEvents } from "@app/Screens/Calendar/hooks/useCalendarEvents";
import { FullscreenModal } from "@app/components/CustomModal";
import { EventForm } from "@app/forms/EventForm";
import { CustomButton } from "@app/components";
import {
  useInitialCalendarSyncMutation,
  useSyncCalendarEventsMutation,
} from "@app/api";
import { AuthUser, selectUser } from "@app/store/slices";
import { useAppSelector } from "@app/hooks/redux";
import EventInfo from "@app/Screens/Calendar/components/EventInfo";

export const CalendarEvents: FC = () => {
  const route = useRoute<RouteProp<CalendarStackParamList, "CalendarEvents">>();
  const { calendarId } = route.params;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();

  const userData = useAppSelector(selectUser);

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

  const [testSync] = useSyncCalendarEventsMutation();
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

  return (
    <>
      <View className="flex h-full">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className={"w-full flex h-full"}>
            <View className={"w-full flex p-2 "}>
              <CustomButton
                iconName={""}
                onPress={handleTest}
                title={"Initial Sync"}
              />
            </View>
            <View className={"w-full flex h-full"}>
              <CalendarContainer
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
                  <ActivityIndicator size="large" color="#0000ff" />
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
        {/*<FullscreenModal*/}
        {/*  component={EventForm}*/}
        {/*  componentProps={{*/}
        {/*    resourceId: selectedEvent?.resourceId || "",*/}
        {/*    googleEventId: selectedEvent?.id || "",*/}
        {/*    calendarId,*/}
        {/*    summary: selectedEvent?.summary || "",*/}
        {/*    displayTitle: selectedEvent?.summary || "",*/}
        {/*    startTime: selectedEvent?.start?.dateTime || "",*/}
        {/*    endTime: selectedEvent?.end?.dateTime || "",*/}
        {/*  }}*/}
        {/*  title={"Dane grupy"}*/}
        {/*  visible={modalVisible}*/}
        {/*  onClose={handleModalClose}*/}
        {/*></FullscreenModal>*/}
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
