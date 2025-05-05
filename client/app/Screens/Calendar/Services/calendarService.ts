import { ICalendarEvent } from "@app/types";
import { SimplifiedEvent } from "@app/Screens/Calendar/types";

export const transformGoogleCalendarEvent = (
  googleEvent: ICalendarEvent,
  color: string = "#4285F4",
): SimplifiedEvent => {
  return {
    id: googleEvent.id as string,
    title: googleEvent.summary,
    summary: googleEvent.summary,
    start: {
      dateTime: googleEvent.start.dateTime || googleEvent.start.dateTime || "",
    },
    end: {
      dateTime: googleEvent.end.dateTime || googleEvent.end.dateTime || "",
    },
    color: color,
  };
};

export const mapSimplifiedEvents = (
  googleEvents: ICalendarEvent[],
): SimplifiedEvent[] => {
  return googleEvents.map((el) => {
    return transformGoogleCalendarEvent(el);
  });
};
