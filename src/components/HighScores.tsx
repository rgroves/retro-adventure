import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { Heading, Loader, SelectField } from "@aws-amplify/ui-react";
import ScoreTable from "./ScoreTable";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function HighScores() {
  const [scores, setScores] = useState<Schema["GameScores"]["type"][]>([]);
  const [loading, setLoading] = useState(true);
  const [storyTitle, setStoryTitle] = useState("Demo");

  const fetchScores = async () => {
    setLoading(true);

    const { data: items, errors } =
      await client.models.GameScores.scoresByStory(
        {
          storyTitle: storyTitle,
        },
        { limit: 10, sortDirection: "DESC" }
      );

    if (errors) {
      // TODO handle errors gracefully.
      console.log({ errors });
    }

    console.log("Setting new scores");
    setScores(items);
    setLoading(false);
  };

  useEffect(() => {
    console.log("useEffect: fetchScores");
    fetchScores();
  }, [storyTitle]);

  return (
    <>
      <SelectField
        minWidth="320px"
        label="Story"
        descriptiveText="Choose a story title?"
        value={storyTitle}
        onChange={(e) => {
          setStoryTitle(e.target.value);
        }}
      >
        <option value="Demo">Original Minimal Demo</option>
        <option value="Corgi Quest">Corgi Quest</option>
      </SelectField>
      <Heading level={1} lineHeight={"1.5em"}>
        Top 10 High Scores
      </Heading>
      {loading ? <Loader /> : <ScoreTable scores={scores} />}
    </>
  );
}
