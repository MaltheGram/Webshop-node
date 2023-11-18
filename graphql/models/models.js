import graphql from "graphql";
import { UserModel } from "../../mongodb/models/models.js";

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    address: { type: AddressType },
  }),
});

const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    streetName: { type: GraphQLString },
    streetNumber: { type: GraphQLString },
    city: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args) {
        const user = await UserModel.findById(args.id);
        return user;
      },
    },
    address: {
      type: AddressType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args) {
        const user = await UserModel.findById(args.id);
        return user.address;
      }
    }
  },
});

const graphqlScheamUser = new GraphQLSchema({ query: RootQuery });

export { graphqlScheamUser };
