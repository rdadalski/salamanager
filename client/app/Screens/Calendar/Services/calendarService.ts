import { IInternalEvent } from "@app/types";
import { SimplifiedEvent } from "@app/Screens/Calendar/types";

export const transformToSimplified = (
  googleEvent: IInternalEvent,
): SimplifiedEvent => ({
  id: googleEvent.googleEventId as string,
  title: googleEvent.summary,
  summary: googleEvent.summary,
  start: {
    dateTime: googleEvent.startTime || "",
  },
  end: {
    dateTime: googleEvent.endTime || "",
  },
  color: "#4285F4",
  status: googleEvent.status,
  defaultResourcePrice: googleEvent.defaultResourcePrice,
  clients: googleEvent.clients,
  googleEventId: googleEvent.googleEventId,
  calendarId: googleEvent.calendarId,
  resourceId: googleEvent.resourceId,
});

export const transformToInternal = (
  simplifiedEvent: SimplifiedEvent,
): IInternalEvent => ({
  id: simplifiedEvent.googleEventId as string,
  summary: simplifiedEvent.summary,
  startTime: simplifiedEvent.start.dateTime as string,
  endTime: simplifiedEvent.end.dateTime as string,
  status: simplifiedEvent.status,
  defaultResourcePrice: simplifiedEvent.defaultResourcePrice,
  clients: simplifiedEvent.clients,
  googleEventId: simplifiedEvent.googleEventId,
  calendarId: simplifiedEvent.calendarId,
  resourceId: simplifiedEvent.resourceId,
});
