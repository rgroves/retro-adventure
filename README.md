# Retro Adventure

An ode to the days of text-based adventure games.

Built for [Jason Lengstorf's](https://www.learnwithjason.dev/) [Web Dev Challenge mini-hackathon \(retro gaming edition\)](https://www.learnwithjason.dev/blog/web-dev-challenge-giveaway-full-stack-amplify)

## Local Development Notes

- Set the AWS_PROFILE environment variable to your AWS profile that has the necessary Amplify permissions as outlined in the [Amplify Gen2 docs](https://docs.amplify.aws/react/start/).
  ```shell
  export AWS_PROFLIE=your-profile-name-here
  ```
- run `npm run aws-sso-refresh` if needed (to refresh your AWS access token)
- run `npm run amplify-backend` to spin up the local sandbox and generate the `amplify_outputs.json` file.
- run `npm run dev` to spin up the dev server.
