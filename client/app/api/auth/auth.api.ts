import { baseApi } from "@app/api";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { CreateUserRequest } from "@app/types";

const baseUrl = "auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<FirebaseAuthTypes.User, CreateUserRequest>({
      query: (values: CreateUserRequest) => ({
        url: `${baseUrl}/register`,
        method: "POST",
        body: values,
      }),
      transformResponse: (response: FirebaseAuthTypes.User) => {
        // Handle and transform the response if needed
        console.log(response);
        return response;
      },
    }),
  }),
});

export const { useRegisterUserMutation } = authApi;
