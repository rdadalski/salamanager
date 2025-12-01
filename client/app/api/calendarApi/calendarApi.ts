import { ICalendarEvent } from "@app/types/calendar";
import { baseApi } from "@app/api";
import { CreateEvent, UpdateEvent } from "@app/Screens/Calendar/types";

interface ListEventsParams {
  id: string;
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
}

interface UpdateEventRequest {
  event: UpdateEvent;
  calendarId: string;
}

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query<ICalendarEvent[], ListEventsParams>({
      query: ({ id, timeMin, timeMax, maxResults }) => ({
        url: "/calendar/events",
        params: { id, timeMin, timeMax, maxResults },
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Events" as const, id })),
              { type: "Events", id: "LIST" },
            ]
          : [{ type: "Events", id: "LIST" }],
    }),

    listCalendars: builder.query<any, void>({
      query: () => ({
        url: "/calendar/list",
        method: "GET",
      }),
      providesTags: ["Calendars"],
    }),

    addEvent: builder.mutation<any, any>({
      query: ({ data }) => ({
        url: "/calendar/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),

    updateEvent: builder.mutation<
      CreateEvent,
      { eventId: string; data: UpdateEventRequest }
    >({
      query: ({ data, eventId }) => ({
        url: `/calendar/events/${eventId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Events", id: eventId },
        { type: "Events", id: "LIST" },
      ],
    }),

    deleteEvent: builder.mutation<{ success: boolean }, string>({
      query: (eventId) => ({
        url: `/calendar/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, eventId) => [
        { type: "Events", id: eventId },
        { type: "Events", id: "LIST" },
      ],
    }),

    initialCalendarSync: builder.mutation<
      any,
      { calendarId: string; userId: string }
    >({
      query: ({ calendarId, userId }) => ({
        url: `/calendar/initial-sync/${calendarId}`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
    }),

    syncCalendarEvents: builder.mutation<
      any,
      { calendarId: string; forceFullSync?: boolean }
    >({
      query: (_arg) => ({
        url: `/calendar/sync`,
        method: "POST",
        body: _arg,
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }],
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
  useSyncCalendarEventsMutation,
  useInitialCalendarSyncMutation,
} = calendarApi;
