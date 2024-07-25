import { Flex, Text, View } from "@aws-amplify/ui-react";
import React from "react";
import UserMenu from "./UserMenu";

type BaseLayoutProps = {
    children: React.ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <View style={{ height: "100%" }}>
            <Flex direction="column" gap="0" minHeight="100%">
                <header><UserMenu /></header>
                <main style={{ flex: "auto" }}>{children}</main>
                <footer><Text>footer placeholder</Text></footer>
            </Flex >
        </View >
    );
}