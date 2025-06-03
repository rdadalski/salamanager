import { ICalendarEvent, IInternalEvent } from "@app/types";
import { SimplifiedEvent } from "@app/Screens/Calendar/types";
import { color } from "nativewind/dist/tailwind/color";

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

export const changeEventValues = (googleEvents: IInternalEvent[]) => {
  return googleEvents.map((el) => {
    return transformInternalEvent(el);
  });
};

export const transformInternalEvent = (
  googleEvent: IInternalEvent,
  color: string = "#4285F4",
): SimplifiedEvent => {
  return {
    id: googleEvent.googleEventId as string,
    title: googleEvent.summary,
    summary: googleEvent.summary,
    start: {
      dateTime: googleEvent.startTime || "",
    },
    end: {
      dateTime: googleEvent.endTime || "",
    },
    color: color,
  };
};
