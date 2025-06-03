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
import { useTestSyncMutation } from "@app/api";
import { getAccessToken } from "@app/services";

export const CalendarEvents: FC = () => {
  const route = useRoute<RouteProp<CalendarStackParamList, "CalendarEvents">>();
  const { calendarId } = route.params;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();

  const {
    calendarEvents,
    handleDragStart,
    handleDragEnd,
    isLoading,
    isSuccess,
  } = useCalendarEvents(calendarId);

  const [testSync] = useTestSyncMutation();

  const handlePressEvent = (event: OnEventResponse) => {
    console.log(event);
    setModalVisible(true);
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const handleTest = async () => {
    const res = await testSync({ calendarId });
    console.log(res);
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
                title={"testSync"}
              />
            </View>
            {isSuccess && (
              <View>
                <CalendarContainer
                  allowDragToEdit={true}
                  onDragEventStart={handleDragStart}
                  onDragEventEnd={handleDragEnd}
                  onPressEvent={handlePressEvent}
                  events={calendarEvents as EventItem[]}
                >
                  <CalendarHeader />
                  <CalendarBody />
                </CalendarContainer>
              </View>
            )}
          </View>
        )}
        <FullscreenModal
          component={EventForm}
          componentProps={{
            googleEventId: selectedEvent?.id || "",
            calendarId,
            summary: selectedEvent?.summary || "",
            displayTitle: selectedEvent?.summary || "",
            startTime: selectedEvent?.start?.dateTime || "",
            endTime: selectedEvent?.end?.dateTime || "",
          }}
          visible={modalVisible}
          onClose={handleModalClose}
        ></FullscreenModal>
      </View>
    </>
  );
};
