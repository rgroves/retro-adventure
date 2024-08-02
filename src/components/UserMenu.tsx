import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import {
  Flex,
  Link,
  Loader,
  Text,
  useAuthenticator,
} from "@aws-amplify/ui-react";

export default function UserMenu() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [preferredUserName, setPreferredUserName] = useState("");

  const signOutFlow = (element: React.MouseEvent<HTMLAnchorElement>) => {
    element.preventDefault();
    signOut();
    localStorage.removeItem("preferred_username");
    localStorage.removeItem("userSub");
  };

  useEffect(() => {
    async function loadUserAttributes() {
      let attributes, name;

      try {
        attributes = await fetchUserAttributes();
        name = attributes.preferred_username ?? "unknown";
      } catch (err) {
        console.error(err);
        console.log("Failed to get auth user info. Treating user as guest.");
        name = "Guest";
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
  }, [user.userId]);

  return (
    <Flex className="user-menu-container">
      {preferredUserName ? (
        <Text>Welcome {preferredUserName}</Text>
      ) : (
        <Loader />
      )}
      <Link className="sign-out" href="#" onClick={signOutFlow}>
        (sign out)
      </Link>
    </Flex>
  );
}
