import { Authenticator, Flex, ThemeProvider } from "@aws-amplify/ui-react";
import { theme } from "../components/RetroTheme.tsx";

import { Outlet } from "react-router-dom";
import BaseLayout from "../components/BaseLayout.tsx";

export default function Root() {
  return (
    <Authenticator initialState="signIn">
      {() => {
        return (
          <Authenticator.Provider>
            <ThemeProvider theme={theme} colorMode="system">
              <BaseLayout>
                <Flex justifyContent={"space-around"}>
                  <Outlet />
                </Flex>
              </BaseLayout>
            </ThemeProvider>
          </Authenticator.Provider>
        );
      }}
    </Authenticator>
  );
}
