import { useState, useEffect, FC } from "react";
import Animated from "react-native-reanimated";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ICalendarEvent } from "@app/types";
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  EventItem,
} from "@howljs/calendar-kit";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_COLUMN_WIDTH = SCREEN_WIDTH / 8; // 7 days + time column
const HOUR_HEIGHT = 60;

export interface IWeeklyCalendar {
  events: ICalendarEvent[];
}

export interface SimplifiedEvent {
  id: string;
  title: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  color: string;
}

export const WeeklyCalendar: FC<IWeeklyCalendar> = ({ events }) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [weekDays, setWeekDays] = useState<any[]>([]);
  const [dupa, setDupa] = useState<EventItem[]>();

  useEffect(() => {
    setDupa(mapSimplifiedEvents(events));
  }, []);

  const transformGoogleCalendarEvent = (
    googleEvent: ICalendarEvent,
    color: string = "#4285F4",
  ): SimplifiedEvent => {
    return {
      id: googleEvent.id as string,
      title: googleEvent.summary,
      start: {
        dateTime:
          googleEvent.start.dateTime || googleEvent.start.dateTime || "",
      },
      end: {
        dateTime: googleEvent.end.dateTime || googleEvent.end.dateTime || "",
      },
      color: color,
    };
  };

  const mapSimplifiedEvents = (googleEvents: ICalendarEvent[]) => {
    return googleEvents.map((el) => {
      return transformGoogleCalendarEvent(el);
    });
  };

  useEffect(() => {
    // Generate array of dates for the week
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday start
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDate, i));
    }
    setWeekDays(days);
  }, [selectedDate]);

  const renderDayHeader = () => {
    return (
      <View style={styles.headerRow}>
        <View style={styles.timeHeaderCell}>
          <Text style={styles.timeHeaderText}>GMT+01</Text>
        </View>
        {weekDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayHeaderCell,
              isSameDay(day, currentDate) && styles.currentDayHeader,
            ]}
            onPress={() => setSelectedDate(day)}
          >
            <Text style={styles.weekdayText}>
              {format(day, "EEE").toUpperCase()}
            </Text>
            <Text
              style={[
                styles.dayNumberText,
                isSameDay(day, currentDate) && styles.currentDayText,
              ]}
            >
              {format(day, "d")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTimeGrid = () => {
    return (
      <ScrollView style={styles.timeGrid}>
        <View style={styles.gridContainer}>
          {/* Time labels column */}
          <View style={styles.timeColumn}>
            {HOURS.map((hour) => (
              <View key={hour} style={styles.hourCell}>
                <Text style={styles.hourText}>{`${hour}:00`}</Text>
              </View>
            ))}
          </View>

          {/* Days grid */}
          {weekDays.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.dayColumn}>
              {HOURS.map((hour) => (
                <View key={hour} style={styles.gridCell} />
              ))}

              {/* Render events for this day */}
              {events
                .filter((event) => {
                  const eventDate = new Date(event.start.dateTime);
                  return isSameDay(eventDate, day);
                })
                .map((event, eventIndex) => {
                  const startHour = new Date(event.start.dateTime).getHours();
                  const startMinutes = new Date(
                    event.start.dateTime,
                  ).getMinutes();
                  const endHour = new Date(event.end.dateTime).getHours();
                  const endMinutes = new Date(event.end.dateTime).getMinutes();

                  const startPosition =
                    startHour * HOUR_HEIGHT + (startMinutes / 60) * HOUR_HEIGHT;
                  const duration =
                    (endHour - startHour) * HOUR_HEIGHT +
                    ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

                  return (
                    <TouchableOpacity
                      key={eventIndex}
                      style={[
                        styles.eventBlock,
                        {
                          top: startPosition,
                          height: duration,
                          backgroundColor: "#5096e0",
                        },
                      ]}
                    >
                      <Text style={styles.eventTitle}>{event.summary}</Text>
                      <Text style={styles.eventTime} numberOfLines={1}>
                        {format(new Date(event.start.dateTime), "h:mm a")} -{" "}
                        {format(new Date(event.end.dateTime), "h:mm a")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const handleDragStart = (event) => {
    console.log("Started editing event:", event);
    // You can use this to show a UI indicator that event editing has started
  };

  const handleDragEnd = (event, newStart, newEnd) => {
    console.log("Event edited:", event, newStart, newEnd);
    // Here you would typically update the event in your events array
    // and possibly update your backend or state management
  };

  return (
    <>
      <CalendarContainer
        allowDragToEdit={true}
        onDragEventStart={handleDragStart}
        onDragEventEnd={handleDragEnd}
        events={dupa as EventItem[]}
      >
        <CalendarHeader />
        <CalendarBody />
      </CalendarContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  timeHeaderCell: {
    width: DAY_COLUMN_WIDTH,
    padding: 8,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  timeHeaderText: {
    color: "#888",
    fontSize: 12,
  },
  dayHeaderCell: {
    width: DAY_COLUMN_WIDTH,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  currentDayHeader: {
    backgroundColor: "rgba(80, 150, 224, 0.2)",
  },
  weekdayText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  dayNumberText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "500",
    marginTop: 4,
  },
  currentDayText: {
    color: "#5096e0",
  },
  timeGrid: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
  },
  timeColumn: {
    width: DAY_COLUMN_WIDTH,
  },
  hourCell: {
    height: HOUR_HEIGHT,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingLeft: 8,
    paddingTop: 4,
  },
  hourText: {
    color: "#888",
    fontSize: 12,
  },
  dayColumn: {
    width: DAY_COLUMN_WIDTH,
    position: "relative",
  },
  gridCell: {
    height: HOUR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    borderLeftWidth: 1,
    borderLeftColor: "#333",
  },
  eventBlock: {
    position: "absolute",
    left: 2,
    right: 2,
    padding: 4,
    borderRadius: 4,
    overflow: "hidden",
    zIndex: 1,
  },
  eventTitle: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
  eventTime: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 10,
  },
});
