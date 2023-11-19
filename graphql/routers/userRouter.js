import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import { graphqlScheamUser } from "../models/models.js";

const router = Router();

const graphql = "/api/users/graphql";

router.use(
  `${graphql}`,
  graphqlHTTP((req) => ({
    schema: graphqlScheamUser,
    graphiql: true, // Set to false if you don't want to use GraphiQL in production
  })),
);

export default router;
