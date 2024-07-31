import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import {
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function HighScores() {
  const [scores, setScores] = useState<Schema["GameScores"]["type"][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    const { data: items, errors } =
      await client.models.GameScores.scoresByStory(
        {
          storyTitle: "Demo", // TODO: this needs to be passed in or selected via a drop down
        },
        { limit: 10, sortDirection: "DESC" }
      );

    if (errors) {
      // TODO handle errors gracefully.
      console.log({ errors });
    }

    setScores(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell as="th">Name</TableCell>
          <TableCell as="th">Score</TableCell>
          <TableCell as="th">Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {scores.map(({ id, preferredUsername, score, createdAt }) => (
          <TableRow key={id}>
            <TableCell>{preferredUsername}</TableCell>
            <TableCell>{score}</TableCell>
            <TableCell>{createdAt.substring(0, 10)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
