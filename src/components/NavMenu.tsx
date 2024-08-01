import { Link as ReactRouterLink } from "react-router-dom";

export default function NavMenu() {
  return (
    <nav className="nav-container">
      <ReactRouterLink className="amplify-link" to="/">
        {"//-Play"}&nbsp;{"Game-//"}
      </ReactRouterLink>
      <ReactRouterLink className="amplify-link" to="/high-scores">
        {"//-High"}&nbsp;{"Scores-//"}
      </ReactRouterLink>
    </nav>
  );
}
