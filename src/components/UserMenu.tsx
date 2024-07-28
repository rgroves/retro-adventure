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
  const [userNickname, setUserNickname] = useState("");
  const { tokens } = useTheme();

  useEffect(() => {
    async function loadUserAttributes() {
      const attributes = await fetchUserAttributes();
      setUserNickname(attributes.nickname || "");
    }
    loadUserAttributes();
  }, [user]);

  return (
    <Flex justifyContent="flex-end" alignItems="center" gap={tokens.space.xl}>
      {userNickname ? <Text>Welcome {userNickname}</Text> : <Loader />}
      <Button size="small" onClick={signOut}>
        Sign out
      </Button>
    </Flex>
  );
}
