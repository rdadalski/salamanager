import { baseApi } from "@app/api";
import { IInternalEvent } from "@app/types";

// TODO fix any type

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInternalEvents: builder.query<IInternalEvent[], void>({
      query: () => ({
        url: "events",
        method: "GET",
      }),
    }),
    getSingleInternalEvent: builder.query<IInternalEvent, { id: string }>({
      query: ({ id }) => ({
        url: `events/${id}`,
        method: "GET",
      }),
    }),
    getTodayEvents: builder.query<IInternalEvent[], void>({
      query: () => ({
        url: `events/today`,
        method: "GET",
      }),
    }),
    createInternalEvent: builder.mutation<any, { values: IInternalEvent }>({
      query: ({ values }) => ({
        url: "events",
        body: values,
        method: "POST",
      }),
    }),
    updateInternalEvent: builder.mutation<
      IInternalEvent,
      { id: string; values: IInternalEvent }
    >({
      query: ({ id, values }) => ({
        url: `events/${id}`,
        body: values,
        method: "PATCH",
      }),
    }),
    getEventByCalendarId: builder.query<
      IInternalEvent[],
      { calendarId: string }
    >({
      query: ({ calendarId }) => `events/calendar/${calendarId}`,
    }),
    deleteInternalEvent: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `events/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateInternalEventMutation,
  useGetAllInternalEventsQuery,
  useGetTodayEventsQuery,
  useLazyGetTodayEventsQuery,
  useDeleteInternalEventMutation,
  useGetSingleInternalEventQuery,
  useLazyGetEventByCalendarIdQuery,
  useGetEventByCalendarIdQuery,
  useUpdateInternalEventMutation,
} = eventsApi;
