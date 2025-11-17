import { baseApi } from "@app/api";
import type { IResource, updateResource } from "@app/types";

// TODO fix return types from any

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllResources: builder.query<IResource[], void>({
      query: () => ({
        url: "resource",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Resource" as const, id })),
              { type: "Resource", id: "LIST" },
            ]
          : [{ type: "Resource", id: "LIST" }],
    }),
    getAllResourcesByTrainer: builder.query<IResource[], void>({
      query: () => ({
        url: `resource/trainer`,
        method: "GET",
      }),
    }),
    getResource: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `resource/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "Resource", id }],
    }),
    createResource: builder.mutation<any, { values: IResource }>({
      query: ({ values }) => ({
        url: "resource",
        body: values,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Resource", id: "LIST" }],
    }),
    updateResource: builder.mutation<
      any,
      { id: string; values: updateResource }
    >({
      query: ({ id, values }) => ({
        url: `resource/${id}`,
        body: values,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Resource", id },
        { type: "Resource", id: "LIST" },
      ],
    }),
    deleteResource: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `resource/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Resource", id },
        { type: "Resource", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateResourceMutation,
  useGetAllResourcesByTrainerQuery,
  useDeleteResourceMutation,
  useGetAllResourcesQuery,
  useGetResourceQuery,
  useUpdateResourceMutation,
} = resourceApi;
