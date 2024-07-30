import { Heading, View } from "@aws-amplify/ui-react";
import HighScores from "./components/HighScores";

export default function ScoresPage() {
  return (
    <View id="scores-page">
      <Heading level={1} lineHeight={"1.5em"}>High Scores</Heading>
      <HighScores />
    </View>
  );
}
