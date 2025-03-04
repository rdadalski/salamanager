import { baseApi } from "@app/api";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  authProvider: "password" | "google.com";
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  authProvider: "password" | "google.com";
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: `/users`,
        method: "GET",
      }),
      // providesTags: ["Users"],
    }),

    // Get single user by ID
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      // providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // Create a new user
    createUser: builder.mutation<User, FirebaseAuthTypes.User>({
      query: (userData) => ({
        url: `/users`,
        method: "POST",
        body: userData,
      }),
      // invalidatesTags: ["Users"],
    }),

    // Update an existing user
    updateUser: builder.mutation<User, UpdateUserRequest>({
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
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
