import { Flex, Grid, Text, View } from "@aws-amplify/ui-react";
import React from "react";
import UserMenu from "./UserMenu";
import NavMenu from "./NavMenu";

type BaseLayoutProps = {
  children: React.ReactNode;
};

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <View style={{ height: "100%" }}>
      <Flex direction="column" gap="0" minHeight="100%">
        <header>
          <Grid templateColumns={"1fr 1fr"}>
            <NavMenu />
            <UserMenu />
          </Grid>
        </header>
        <main style={{ flex: "auto" }}>{children}</main>
        <footer>
          <Text>footer placeholder</Text>
        </footer>
      </Flex>
    </View>
  );
}
