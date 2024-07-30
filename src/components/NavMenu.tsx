import { Flex, Link } from "@aws-amplify/ui-react";
import { Link as ReactRouterLink } from "react-router-dom";

export default function NavMenu() {
  return (
    <Flex alignItems="center">
      <ReactRouterLink to="/">// Play Game //</ReactRouterLink>
      <ReactRouterLink to="/high-scores">
        // View High Scores //
      </ReactRouterLink>
    </Flex>
  );
}
