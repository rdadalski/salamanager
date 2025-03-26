import { ICalendarEvent } from "@app/types/calendar";
import { baseApi } from "@app/api";
import { BaseQueryArg } from "@reduxjs/toolkit/query";

interface ListEventsParams {
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
}

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listEvents: builder.query<ICalendarEvent[], ListEventsParams>({
      query: ({ timeMin, timeMax, maxResults }) => ({
        url: "/calendar/events",
        params: { timeMin, timeMax, maxResults },
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
  }),
});

export const { useListEventsQuery, useLazyListEventsQuery } = calendarApi;

// addEvent
// updateEvent
// deleteEvent
