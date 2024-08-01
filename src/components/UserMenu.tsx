import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import {
  Flex,
  Loader,
  useTheme,
  Text,
  Button,
  useAuthenticator,
} from "@aws-amplify/ui-react";

export default function UserMenu() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [preferredUserName, setpreferredUserName] = useState("");
  const { tokens } = useTheme();

  const signOutFlow = () => {
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

      setpreferredUserName(name);

      try {
        localStorage.setItem("preferred_username", name);
        localStorage.setItem("userSub", attributes?.sub ?? "");
      } catch (err) {
        console.error(err);
        console.log("Failed to save user info to local storage.");
      }
    }
    void loadUserAttributes();
  }, [user.userId]);

  return (
    <Flex justifyContent="flex-end" alignItems="center" gap={tokens.space.xl}>
      {preferredUserName ? (
        <Text>Welcome {preferredUserName}</Text>
      ) : (
        <Loader />
      )}
      <Button size="small" onClick={signOutFlow}>
        Sign out
      </Button>
    </Flex>
  );
}
