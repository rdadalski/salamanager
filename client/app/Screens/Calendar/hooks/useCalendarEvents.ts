import { useCallback, useEffect, useMemo, useState } from "react";
import { OnEventResponse } from "@howljs/calendar-kit";
import { useUpdateEventMutation } from "@app/api";
import { transformToSimplified } from "@app/Screens/Calendar/Services/calendarService";
import { useGetEventByCalendarIdQuery } from "@app/api/event/events.api";
import { IInternalEvent } from "@app/types";

export const useCalendarEvents = (calendarId: string) => {
  const [calendarInternalEvents, setCalendarEvents] = useState<
    IInternalEvent[]
  >([]);

  const [
    updateCalendarEvent,
    { isLoading: updateReqLoading, isSuccess: updateReqSuccess },
  ] = useUpdateEventMutation();

  const libraryEvents = useMemo(
    () => calendarInternalEvents.map(transformToSimplified),
    [calendarInternalEvents],
  );

  const {
    data: events,
    error,
    isSuccess,
    isError,
    isLoading,
    isFetching,
    refetch: refetchCalendarEvents,
  } = useGetEventByCalendarIdQuery({ calendarId });

  useEffect(() => {
    if (events) {
      setCalendarEvents(events);
    }
  }, [events]);

  const handleDragStart = (event: OnEventResponse) => {
    console.log("Started editing event:", event);
  };

  const sendUpdateRequest = async (
    internalEvent: IInternalEvent,
  ): Promise<void> => {
    const calendarEvent = {
      summary: internalEvent.summary,
      start: {
        dateTime: new Date(internalEvent.startTime).toISOString(),
      },
      end: {
        dateTime: new Date(internalEvent.endTime).toISOString(),
      },
    };

    const res = await updateCalendarEvent({
      eventId: internalEvent.googleEventId,
      data: calendarEvent,
    });

    console.log(res);
  };

  const handleDragEnd = useCallback(
    async (event: OnEventResponse) => {
      const eventIndex = calendarInternalEvents.findIndex(
        (e) => e.id === event.id,
      );

      if (eventIndex === -1) {
        console.warn("Event not found:", event.id);
        return;
      }

      const originalEvent = calendarInternalEvents[eventIndex];

      const updatedEvent: IInternalEvent = {
        ...originalEvent,
        startTime: event.start.dateTime as string,
        endTime: event.end.dateTime as string,
      };

      setCalendarEvents((prev) => [
        ...prev.slice(0, eventIndex),
        updatedEvent,
        ...prev.slice(eventIndex + 1),
      ]);

      try {
        await sendUpdateRequest(updatedEvent);
      } catch (error) {
        setCalendarEvents((prev) => [
          ...prev.slice(0, eventIndex),
          originalEvent,
          ...prev.slice(eventIndex + 1),
        ]);
        console.error("Update failed:", error);
      }
    },
    [calendarInternalEvents],
  );

  return {
    handleDragEnd,
    handleDragStart,
    libraryEvents,
    isLoading,
    isSuccess,
    refetchCalendarEvents,
  };
};
