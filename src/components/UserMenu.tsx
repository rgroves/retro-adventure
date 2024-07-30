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
      const attributes = await fetchUserAttributes();
      const name = attributes.preferred_username || "unknown";
      localStorage.setItem("preferred_username", name);
      localStorage.setItem("userSub", attributes.sub || "");
      setpreferredUserName(name);
    }
    loadUserAttributes();
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
