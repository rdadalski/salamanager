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
import { ResourceForm } from "@app/forms/ResourceForm";
import { EventForm } from "@app/forms/EventForm";

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

  const handlePressEvent = (event: OnEventResponse) => {
    console.log(event);
    setModalVisible(true);
    setSelectedEvent(event);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

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
                onPressEvent={handlePressEvent}
                events={calendarEvents as EventItem[]}
              >
                <CalendarHeader />
                <CalendarBody />
              </CalendarContainer>
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
