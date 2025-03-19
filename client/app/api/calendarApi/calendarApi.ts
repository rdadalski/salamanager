import { ICalendarEvent } from "@app/types/calendar";
import { baseApi } from "@app/api";

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

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("API call success:", data);
        } catch (error) {
          console.error("API call error:", error);
        }
      },
    }),
  }),
});

export const { useListEventsQuery, useLazyListEventsQuery } = calendarApi;
