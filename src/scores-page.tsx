import { View } from "@aws-amplify/ui-react";
import HighScores from "./components/HighScores";

export default function ScoresPage() {
  return (
    <View id="scores-page">
      <HighScores />
    </View>
  );
}
