import "dotenv/config";
import neo4j from "neo4j-driver";

const neo4jURL = process.env.NEO4J_URL;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
  neo4jURL,
  neo4j.auth.basic(neo4jUser, neo4jPassword),
);

// Create a new Driver instance

await driver.verifyConnectivity().then(() => {
  console.log("Connected to Neo4j");
});

export { driver };
