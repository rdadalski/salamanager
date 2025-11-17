import { baseApi } from "@app/api";
import { CreateClientDto, IClient, UpdateClientDto } from "@app/types";

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<IClient[], void>({
      query: () => "/clients",
      providesTags: ["AllClients"],
    }),

    getMyClients: builder.query<IClient[], void>({
      query: () => "/clients/my-clients",
      providesTags: ["MyClients"],

      transformErrorResponse: (response) => {
        console.log("ERROR RESPONSE:", response); // ← DODAJ
        return response;
      },
    }),

    getMyProfile: builder.query<IClient, void>({
      query: () => "/clients/me",
      providesTags: ["ClientProfile"],
    }),

    getClientById: builder.query<IClient, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Clients", id }],
    }),

    createClient: builder.mutation<{ id: string }, CreateClientDto>({
      query: (data) => ({
        url: "/clients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllClients", "MyClients"],
    }),

    updateClient: builder.mutation<
      IClient,
      { id: string; data: UpdateClientDto }
    >({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Clients",
        { type: "Clients", id },
        "ClientProfile",
      ],
    }),

    linkClientToUser: builder.mutation<
      unknown,
      { clientId: string; userId: string }
    >({
      query: ({ clientId, userId }) => ({
        url: `/clients/${clientId}/link-user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Clients", "ClientProfile"],
    }),

    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetMyClientsQuery,
  useGetMyProfileQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useLinkClientToUserMutation,
  useDeleteClientMutation,
} = clientsApi;
