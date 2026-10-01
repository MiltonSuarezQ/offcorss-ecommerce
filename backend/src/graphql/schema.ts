import { User } from '../models/User.js';

export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    createDate: String!
    name: String!
    lastName: String!
    email: String!
    userType: String!
  }

  input UpdateUserInput {
    name: String!
    lastName: String!
    email: String!
  }

  type Query {
    me: User
    user(id: ID!): User
  }

  type Mutation {
    updateUser(
      id: ID!
      input: UpdateUserInput!
    ): User
  }
`;

function publicUser(user: any) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    createDate: user.createDate.toISOString(),
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    userType: user.userType,
  };
}

interface GraphQLContext {
  userId?: string;
}

export const resolvers = {
  Query: {
    me: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('No autenticado');
      }

      const user = await User.findById(
        context.userId
      );

      return publicUser(user);
    },

    user: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('No autenticado');
      }

      if (context.userId !== id) {
        throw new Error(
          'No autorizado para consultar este usuario'
        );
      }

      const user = await User.findById(id);

      return publicUser(user);
    },
  },

  Mutation: {
    updateUser: async (
      _parent: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name: string;
          lastName: string;
          email: string;
        };
      },
      context: GraphQLContext
    ) => {
      if (!context.userId) {
        throw new Error('No autenticado');
      }

      if (context.userId !== id) {
        throw new Error(
          'No autorizado para modificar este usuario'
        );
      }

      const user =
        await User.findByIdAndUpdate(
          id,
          input,
          {
            new: true,
            runValidators: true,
          }
        );

      return publicUser(user);
    },
  },
};