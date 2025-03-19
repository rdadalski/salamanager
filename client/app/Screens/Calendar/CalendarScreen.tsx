import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useLazyListEventsQuery } from "@app/api/calendarApi/";
import { CustomButton } from "@app/components";
import { Calendar } from "react-native-calendars";

export const CalendarEvents = () => {
  const [selected, setSelected] = useState("");

  const [getCalendar, { data: events, error, isSuccess, isError, isLoading }] =
    useLazyListEventsQuery();

  const handleCalendar = async () => {
    const response = await getCalendar({
      timeMin: "2023-01-01T00:00:00Z",
      timeMax: Date.now().toString(),
      maxResults: 10,
    });
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
          {isSuccess && (
            <FlatList
              data={events}
              keyExtractor={(item) => item?.id!}
              renderItem={({ item }) => (
                <View>
                  <Text>{item.summary}</Text>
                </View>
              )}
            />
          )}
          {isError && showError()}
        </>
      )}
      <Calendar
        onDayPress={(day: any) => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: "orange",
          },
        }}
      />
    </>
  );
};

// TODO
//  1. refresh firebase token
//  2. Events - transform data from backend so it is easily consumed by frontend
//  3. EVENTS CRUD !
//  4. Events handling - frontend
