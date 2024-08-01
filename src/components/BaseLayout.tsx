import { Flex, Grid, Text, useTheme, View } from "@aws-amplify/ui-react";
import React from "react";
import UserMenu from "./UserMenu";
import NavMenu from "./NavMenu";
import {
  SiAwsamplify,
  SiReact,
  SiReactrouter,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { Link } from "react-router-dom";
import SiteTitle from "./SiteTitle";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  const { tokens } = useTheme();

  return (
    <View style={{ height: "100%" }}>
      <Flex direction="column" gap="0" minHeight="100%">
        <header>
          <Grid className="header-container">
            <NavMenu />
            <SiteTitle />
            <UserMenu />
          </Grid>
        </header>
        <main style={{ flex: "auto" }}>{children}</main>
        <footer>
          <Flex padding={tokens.space.medium} justifyContent="center">
            <Text>
              Made with ❤️, 🧠, and ☕ in Chicago, IL, USA - using{" "}
              <Link to="https://react.dev/">
                <SiReact style={{ display: "inline", margin: "0 .5em" }} />
              </Link>{" "}
              |{" "}
              <Link to="https://reactrouter.com/">
                <SiReactrouter
                  style={{ display: "inline", margin: "0 .5em" }}
                />
              </Link>{" "}
              |{" "}
              <Link to="https://www.typescriptlang.org/">
                <SiTypescript style={{ display: "inline", margin: "0 .5em" }} />
              </Link>{" "}
              |{" "}
              <Link to="https://vitejs.dev/">
                <SiVite style={{ display: "inline", margin: "0 .5em" }} />
              </Link>{" "}
              |{" "}
              <Link
                to="https://docs.amplify.aws/"
                style={{ textDecoration: "none" }}
              >
                <SiAwsamplify
                  style={{ display: "inline", margin: "0 0 0 .5em" }}
                />{" "}
                Gen 2
              </Link>
            </Text>
          </Flex>
        </footer>
      </Flex>
    </View>
  );
}
