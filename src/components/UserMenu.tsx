import { useEffect, useState } from 'react';
import { Flex, Loader, useTheme, Text, Button } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react'
import { fetchUserAttributes } from 'aws-amplify/auth';

export default function UserMenu() {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    let [userNick, setUserNick] = useState("");

    useEffect(() => {
        async function loadUserAttributes() {
            const attributes = await fetchUserAttributes();
            setUserNick(attributes.nickname || "");
        }
        loadUserAttributes();
    }, [user])

    const { tokens } = useTheme();
    const nickname = userNick ? <Text>Welcome {userNick}</Text> : <Loader />;
    return (
        <Flex
            color={tokens.colors.font.primary}
            justifyContent="flex-end"
            alignItems="center"
            gap={tokens.space.small}>
            {nickname}
            <Button size="small" onClick={signOut}>Sign out</Button>
        </Flex>
    );
}
