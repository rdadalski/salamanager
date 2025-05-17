import { baseApi } from "@app/api";
import { IResource } from "@app/types";

// TODO fix return types from any

export const resourceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllResources: builder.query<IResource[], void>({
      query: () => ({
        url: "resource",
        method: "GET",
      }),
    }),
    getResource: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `resource/${id}`,
        method: "GET",
      }),
    }),
    createResource: builder.mutation<any, { values: IResource }>({
      query: ({ values }) => ({
        url: "resource",
        body: values,
        method: "POST",
      }),
    }),
    updateResource: builder.mutation<any, { id: string; values: IResource }>({
      query: ({ id, values }) => ({
        url: `resource/${id}`,
        body: values,
        method: "PUT",
      }),
    }),
    deleteResource: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `resource/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useGetAllResourcesQuery,
  useGetResourceQuery,
  useUpdateResourceMutation,
} = resourceApi;
