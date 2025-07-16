import { baseApi } from "@app/api";
import {
  IFirestoreCreateUserRequest,
  IFirestoreUserData,
  UpdateUserRequest,
  UserRole,
} from "@app/types/users";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<IFirestoreUserData[], void>({
      query: () => ({
        url: `/users`,
        method: "GET",
      }),
      // providesTags: ["Users"],
    }),

    // Get single user by ID

    getUserById: builder.query<IFirestoreUserData, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      // providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // Create a new user

    createUser: builder.mutation<
      IFirestoreUserData,
      IFirestoreCreateUserRequest
    >({
      query: (userData) => ({
        url: `/users`,
        method: "POST",
        body: userData,
      }),
      // invalidatesTags: ["Users"],
    }),

    // Update an existing user

    updateUser: builder.mutation<IFirestoreUserData, UpdateUserRequest>({
      query: (userData) => ({
        url: `/users/${userData.uid}`,
        method: "PUT",
        body: userData,
      }),
      // invalidatesTags: (result, error, { id }) => [
      //   { type: "Users", id },
      //   "Users",
      // ],
    }),

    // Delete a user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: (result, error, id) => [{ type: "Users", id }, "Users"],
    }),

    updateUserRole: builder.mutation<void, { uid: string; role: UserRole }>({
      query: ({ uid, role }) => ({
        url: `users/${uid}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
