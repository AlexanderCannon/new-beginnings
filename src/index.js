const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");
const dotenv = require("dotenv");
const neo4j = require("neo4j-driver");
const { readFileSync } = require("fs");
const path = require("path");
const { OGM } = require("@neo4j/graphql-ogm");
const { getUniqueId } = require("./api");

// pull config from .env
dotenv.config();

// load typedefs this needs to be block the thread until it completes
const typeDefs = readFileSync(path.join(__dirname, "schema.gql")).toString(
  "utf-8",
);

// this would look slightly different if we had proper security on the dbƒ
const driver = neo4j.driver(process.env.NEO4J_URI ?? "bolt://neo:7687");

const ogm = new OGM({ typeDefs, driver });
ogm.init();
const Customer = ogm.model("Customer");

const resolvers = {
  Mutation: {
    signUp: async (
      _source,
      {
        firstName,
        middleNames,
        lastName,
        dateOfBirth,
        phoneNumber,
        uniqueID,
        line1,
        line2,
        line3,
        postalCode,
        town,
        country,
        county,
      },
    ) => {
      console.log(uniqueID, firstName, "===\n");
      if (uniqueID) {
        const [existing] = await Customer.find({
          where: {
            uniqueID,
          },
        });

        if (existing) {
          throw new Error(`User with id ${uniqueID} already exists!`);
        }
      }
      const confirmedUniqueID = await getUniqueId(uniqueID);

      const { customers } = await Customer.create({
        input: [
          {
            firstName,
            middleNames,
            lastName,
            dateOfBirth,
            phoneNumber,
            uniqueID: confirmedUniqueID,
            Addresses: {
              create: [
                {
                  node: {
                    line1,
                    line2,
                    line3,
                    postalCode,
                    town,
                    country,
                    county,
                  },
                },
              ],
            },
          },
        ],
      });

      return `${customers.FirstName} created with id ${uniqueID}`;
    },
  },
};

const neoSchema = new Neo4jGraphQL({ typeDefs, driver, resolvers });

neoSchema.getSchema().then((schema) => {
  const server = new ApolloServer({
    schema,
  });

  server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at ${url}`);
  });
});
