import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface GraphQLResponse<T> {
  data?: T;
  errors?: {
    message: string;
  }[];
}

export interface User {
  id: string;
  username: string;
  createDate: string;
  name: string;
  lastName: string;
  email: string;
  userType: string;
}

async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await axios.post<
    GraphQLResponse<T>
  >(
    `${API_URL}/graphql`,
    {
      query,
      variables,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.errors?.length) {
    throw new Error(
      response.data.errors[0].message
    );
  }

  if (!response.data.data) {
    throw new Error(
      'GraphQL no devolvió información'
    );
  }

  return response.data.data;
}

export async function getCurrentUser(): Promise<User> {
  const query = `
    query {
      me {
        id
        username
        createDate
        name
        lastName
        email
        userType
      }
    }
  `;

  const data = await graphqlRequest<{
    me: User;
  }>(query);

  return data.me;
}

export async function updateUser(
  user: User
): Promise<User> {
  const mutation = `
    mutation UpdateUser(
      $id: ID!
      $input: UpdateUserInput!
    ) {
      updateUser(
        id: $id
        input: $input
      ) {
        id
        username
        createDate
        name
        lastName
        email
        userType
      }
    }
  `;

  const data = await graphqlRequest<{
    updateUser: User;
  }>(mutation, {
    id: user.id,
    input: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    },
  });

  return data.updateUser;
}