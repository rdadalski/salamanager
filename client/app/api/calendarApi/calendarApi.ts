import { ICalendarEvent } from "@app/types/calendar";
import { baseApi } from "@app/api";
import { CreateEvent, UpdateEvent } from "@app/Screens/Calendar/types";

interface ListEventsParams {
  id: string;
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
}

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query<ICalendarEvent[], ListEventsParams>({
      query: ({ id, timeMin, timeMax, maxResults }) => ({
        url: "/calendar/events",
        params: { id, timeMin, timeMax, maxResults },
        method: "GET",
      }),
    }),
    listCalendars: builder.query<any, void>({
      query: () => ({
        url: "/calendar/list",
        method: "GET",
      }),
    }),
    addEvent: builder.mutation<any, any>({
      query: ({ data }) => ({
        url: "/calendar/events",
        method: "POST",
        body: data,
      }),
    }),
    updateEvent: builder.mutation<
      CreateEvent,
      { eventId: string; data: UpdateEvent }
    >({
      query: ({ data, eventId }) => ({
        url: `/calendar/events/${eventId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteEvent: builder.mutation<{ success: boolean }, string>({
      query: (eventId) => ({
        url: `/calendar/events/${eventId}`,
        method: "DELETE",
      }),
    }),
    testSync: builder.mutation<
      any,
      { calendarId: string; forceFullSync?: boolean }
    >({
      query: (_arg) => ({
        url: `/calendar/test-sync`,
        method: "POST",
        body: _arg,
      }),
    }),
  }),
});

export const {
  useListEventsQuery,
  useLazyListEventsQuery,
  useListCalendarsQuery,
  useLazyListCalendarsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,

  useTestSyncMutation,
} = calendarApi;

// addEvent
// updateEvent
// deleteEvent
