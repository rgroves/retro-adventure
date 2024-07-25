import { useEffect, useState } from 'react';
import { Grid, Loader, useTheme } from '@aws-amplify/ui-react';
import { WithAuthenticatorProps } from '@aws-amplify/ui-react'
import { fetchUserAttributes } from 'aws-amplify/auth';

export default function UserMenu({ signOut, user }: WithAuthenticatorProps) {
    let [userNick, setUserNick] = useState("");

    useEffect(() => {
        async function loadUserAttributes() {
            const attributes = await fetchUserAttributes();
            setUserNick(attributes.nickname || "");
        }
        loadUserAttributes();
    }, [user])

    const nickname = userNick ? <p>Hello {userNick}</p> : <Loader />;
    const { tokens } = useTheme();
    return (
        <Grid
            templateColumns={'1fr 1fr'}
            gap={tokens.space.medium}>
            {nickname}
            <button onClick={signOut}>Sign out</button>
        </Grid>
    );
}
