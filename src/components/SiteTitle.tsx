import { Flex, Heading } from "@aws-amplify/ui-react";

export default function SiteTitle() {
  return (
    <Flex className="site-title-container">
      <Heading level={1} className="site-title">
        Retro Adventure
      </Heading>
    </Flex>
  );
}
