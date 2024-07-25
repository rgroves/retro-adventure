import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure an auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    nickname: { mutable: true, required: true },
  },
});
