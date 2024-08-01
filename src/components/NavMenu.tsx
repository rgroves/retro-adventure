import { Flex } from "@aws-amplify/ui-react";
import { Link as ReactRouterLink } from "react-router-dom";

export default function NavMenu() {
  return (
    <Flex alignItems="center">
      <ReactRouterLink to="/">
        {"//"}&nbsp;{"Play Game"}&nbsp;{"//"}
      </ReactRouterLink>
      <ReactRouterLink to="/high-scores">
        {"//"}&nbsp;{"High Scores"}&nbsp;{"//"}
      </ReactRouterLink>
    </Flex>
  );
}
