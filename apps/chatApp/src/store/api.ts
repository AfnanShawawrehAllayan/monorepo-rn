import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ENV } from '../config/env';
import { storage } from '../utils/storage';

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  friends?: User[];
}

interface FriendRequest {
  _id: string;
  from: User;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface AuthResponse {
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  name: string;
  image?: string;
}

interface SentRequestResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  request: FriendRequest;
}

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = storage.getItem<string>('token');
    console.log('API Request - Token status:', {
      exists: !!token,
      length: token?.length,
      firstChars: token ? `${token.substring(0, 10)}...` : null,
    });

    if (token) {
      // Remove any quotes that might have been added during JSON stringification
      const cleanToken = token.replace(/^"|"$/g, '');
      console.log('Setting Authorization header with token:', {
        length: cleanToken.length,
        firstChars: cleanToken.substring(0, 10) + '...',
      });
      headers.set('authorization', `Bearer ${cleanToken}`);
    } else {
      console.log('No token available for request');
    }
    return headers;
  },
});

// Add response logging
const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if ('error' in result && result.error) {
    console.error('API Error:', {
      endpoint: args.url,
      method: args.method,
      ...('status' in result.error && { status: result.error.status }),
      ...('data' in result.error && { data: result.error.data }),
    });
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging,
  tagTypes: ['User', 'Users', 'FriendRequests'],
  endpoints: builder => ({
    testConnection: builder.query<{ message: string }, void>({
      query: () => ({
        url: '/api/test',
        method: 'GET',
      }),
      transformErrorResponse: response => {
        console.error('Server connection test error:', response);
        return response;
      },
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/api/login',
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformErrorResponse: response => {
        console.error('Login API error:', {
          response,
          status: response?.status,
          data: response?.data,
          originalError: response,
        });
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: userData => {
        console.log('Register request payload:', userData);

        // Create FormData if there's an image
        if (userData.image) {
          const formData = new FormData();
          formData.append('name', userData.name);
          formData.append('email', userData.email);
          formData.append('password', userData.password);

          // Append image file
          const imageUri = userData.image;
          const filename = imageUri.split('/').pop() || 'image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
          } as any);

          return {
            url: '/api/register',
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };
        }

        // If no image, send as JSON
        return {
          url: '/api/register',
          method: 'POST',
          body: userData,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformErrorResponse: response => {
        console.error('Registration API error:', {
          response,
          status: response?.status,
          data: response?.data,
          originalError: response,
        });
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/api/me',
      providesTags: ['User'],
      transformErrorResponse: response => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    getOtherUsers: builder.query<User[], string>({
      query: userId => `/api/users/${userId}`,
      providesTags: ['Users'],
    }),
    sendFriendRequest: builder.mutation<
      { message: string },
      { senderId: string; receiverId: string; message: string }
    >({
      query: data => ({
        url: '/api/sendrequest',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['FriendRequests', 'Users'],
      transformErrorResponse: response => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    getPendingRequests: builder.query<FriendRequest[], string>({
      query: userId => `/api/getrequests/${userId}`,
      providesTags: ['FriendRequests'],
      transformErrorResponse: response => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    getSentRequests: builder.query<FriendRequest[], string>({
      query: userId => `/api/sentrequests/${userId}`,
      transformResponse: (response: SentRequestResponse[]) =>
        response.map(item => ({
          ...item.request,
          from: item.user, // Map the user object to the 'from' field
        })),
      providesTags: ['FriendRequests'],
      transformErrorResponse: response => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    respondToRequest: builder.mutation<
      void,
      { requestId: string; status: 'accepted' | 'rejected'; userId: string }
    >({
      query: ({ requestId, status, userId }) => ({
        url: status === 'accepted' ? '/api/acceptrequest' : '/api/rejectrequest',
        method: 'POST',
        body: { requestId, userId },
      }),
      async onQueryStarted({ requestId, userId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate and refetch both the requests and user data
          dispatch(api.util.invalidateTags(['FriendRequests', 'User', 'Users']));
        } catch {
          // If the mutation fails, we don't need to do anything
          // The error will be handled by the component
        }
      },
      transformErrorResponse: response => {
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch {
            return { message: response };
          }
        }
        return response;
      },
    }),
    removeFriend: builder.mutation<
      { message: string },
      { userId: string; friendId: string }
    >({
      query: ({ userId, friendId }) => ({
        url: '/api/removefriend',
        method: 'POST',
        body: { userId, friendId },
      }),
      invalidatesTags: ['User', 'Users'],
    }),
    cancelRequest: builder.mutation<
      { message: string },
      { userId: string; requestId: string }
    >({
      query: ({ userId, requestId }) => ({
        url: '/api/cancelrequest',
        method: 'POST',
        body: { userId, requestId },
      }),
      invalidatesTags: ['FriendRequests', 'Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useGetOtherUsersQuery,
  useSendFriendRequestMutation,
  useGetPendingRequestsQuery,
  useGetSentRequestsQuery,
  useRespondToRequestMutation,
  useTestConnectionQuery,
  useRemoveFriendMutation,
  useCancelRequestMutation,
} = api;
