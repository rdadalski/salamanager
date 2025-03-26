import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useLazyListEventsQuery } from "@app/api/calendarApi/";
import { CustomButton } from "@app/components";
import { Calendar } from "react-native-calendars";
import { WeeklyCalendar } from "@app/Screens/Calendar/components/WeeklyCalendar";
import { addDays, format, startOfWeek } from "date-fns";

export const CalendarEvents = () => {
  const [selected, setSelected] = useState("");

  const [getCalendar, { data: events, error, isSuccess, isError, isLoading }] =
    useLazyListEventsQuery();

  const handleCalendar = async () => {
    const response = await getCalendar(
      {
        timeMin: format(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          "yyyy-MM-dd'T'HH:mm:ss'Z'",
        ),
        timeMax: format(
          addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
          "yyyy-MM-dd'T'HH:mm:ss'Z'",
        ),
        maxResults: 10,
      },
      false,
    );
  };

  const showError = () => {
    const errorMessage = error as Error;
    return <Text>Error: {errorMessage.message}</Text>;
  };

  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <CustomButton
            title={"get Calendar"}
            iconName={"calendar"}
            onPress={handleCalendar}
          />

          {isError && showError()}
        </>
      )}

      {isSuccess && <WeeklyCalendar events={events}></WeeklyCalendar>}
    </>
  );
};

// TODO
//  1. refresh firebase token
//  2. Events - transform data from backend so it is easily consumed by frontend
//  3. EVENTS CRUD !
//  4. Events handling - frontend
