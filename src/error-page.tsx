import { Alert, View } from "@aws-amplify/ui-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  let message = "Unknown Error";

  if (isRouteErrorResponse(error)) {
    message = `${error.status.toString()} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  return (
    <View id="error-page">
      <Alert variation="error" heading="Oops!">
        Sorry, an unexpected error has occurred.
        <br />
        <i>{message}</i>
      </Alert>
    </View>
  );
}
