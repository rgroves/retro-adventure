import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  HighScore: a
    .model({
      userId: a.id(),
      preferredUsername: a.string(),
      score: a.integer(),
      stats: a.json(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
