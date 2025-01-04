import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import {
  Authenticator,
  Flex,
  Link,
  Loader,
  Text,
  useAuthenticator,
} from "@aws-amplify/ui-react";

export default function UserMenu() {
  const {
    user = null,
    authStatus,
    signOut,
  } = useAuthenticator((context) => [context.user, context.authStatus]);
  const [preferredUserName, setPreferredUserName] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const signOutFlow = (element: React.MouseEvent<HTMLAnchorElement>) => {
    element.preventDefault();
    signOut();
    localStorage.removeItem("preferred_username");
    localStorage.removeItem("userSub");
  };

  useEffect(() => {
    async function loadUserAttributes() {
      let attributes;
      let name = "Guest";

      try {
        if (authStatus === "authenticated") {
          attributes = await fetchUserAttributes();
          name = attributes.preferred_username
            ? attributes.preferred_username
            : "unknown";
          setShowAuth(false);
        }
      } catch (err) {
        console.error(err);
        console.log("Failed to get auth user info. Treating user as guest.");
      }

      setPreferredUserName(name);

      try {
        localStorage.setItem("preferred_username", name);
        localStorage.setItem("userSub", attributes?.sub ?? "");
      } catch (err) {
        console.error(err);
        console.log("Failed to save user info to local storage.");
      }
    }

    const name = localStorage.getItem("preferred_username");
    const userSub = localStorage.getItem("userSub");

    if (name && userSub) {
      setPreferredUserName(name);
    } else {
      void loadUserAttributes();
    }
  }, [user?.userId, authStatus]);

  if (!preferredUserName) {
    return <Loader />;
  }

  if (showAuth || authStatus === "authenticated") {
    return (
      <Authenticator initialState="signIn" variation="modal">
        <Flex className="user-menu-container">
          <Text>Welcome {preferredUserName}</Text>
          <Link className="sign-out" href="#" onClick={signOutFlow}>
            (sign out)
          </Link>
        </Flex>
      </Authenticator>
    );
  }

  return (
    <Flex className="user-menu-container">
      <Link
        onClick={() => {
          setShowAuth(true);
        }}
      >
        Sign in
      </Link>
    </Flex>
  );
}
