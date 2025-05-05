import { useCallback, useEffect, useState } from "react";
import { EventItem, OnEventResponse } from "@howljs/calendar-kit";
import { useListEventsQuery, useUpdateEventMutation } from "@app/api";
import { mapSimplifiedEvents } from "@app/Screens/Calendar/Services/calendarService";
import { addDays, format, startOfWeek } from "date-fns";
import { SimplifiedEvent } from "@app/Screens/Calendar/types";

export const useCalendarEvents = (calendarId: string) => {
  const [calendarEvents, setCalendarEvents] = useState<EventItem[]>([]);

  const calendarRequestData = () => {
    return {
      id: calendarId,
      timeMin: format(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
      ),
      timeMax: format(
        addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6),
        "yyyy-MM-dd'T'HH:mm:ss'Z'",
      ),
      maxResults: 10,
    };
  };

  const [
    updateEvent,
    { isLoading: updateReqLoading, isSuccess: updateReqSuccess },
  ] = useUpdateEventMutation();

  const {
    data: events,
    error,
    isSuccess,
    isError,
    isLoading,
  } = useListEventsQuery(calendarRequestData());

  useEffect(() => {
    if (events) {
      console.log(events);
      setCalendarEvents(mapSimplifiedEvents(events));
    }
  }, [events]);

  const handleDragStart = (event: OnEventResponse) => {
    // TODO
    console.log("Started editing event:", event);
  };

  const sendUpdateRequest = async (event: SimplifiedEvent): Promise<void> => {
    const res = await updateEvent({ eventId: event.id, data: event });

    console.log(res);
  };

  const handleDragEnd = useCallback(async (event: OnEventResponse) => {
    const updatedEvent = {
      ...(event as EventItem),
      end: {
        dateTime: event.end.dateTime as string,
        timeZone: "Europe/Warsaw",
      },
      start: {
        dateTime: event.start.dateTime as string,
        timeZone: "Europe/Warsaw",
      },
    };

    setCalendarEvents((prevState) => {
      const eventToChange = prevState.find((el) => el.id === event.id);

      if (!eventToChange) return prevState;

      return prevState.map((e) =>
        e.id === event.id
          ? {
              ...(event as EventItem),
              end: {
                dateTime: event.end.dateTime as string,
                timeZone: "Europe/Warsaw",
              },
              start: {
                dateTime: event.start.dateTime as string,
                timeZone: "Europe/Warsaw",
              },
            }
          : e,
      );
    });

    await sendUpdateRequest(updatedEvent as any); // TODO FIX TYPE
  }, []);

  return {
    handleDragEnd,
    handleDragStart,
    calendarEvents,
    isLoading,
    isSuccess,
  };
};
