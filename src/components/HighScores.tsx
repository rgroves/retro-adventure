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
  const [scores, setScores] = useState<Schema["HighScore"]["type"][]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    const { data: items, errors } = await client.models.HighScore.list({
      limit: 100,
    });
    if (errors) {
      // TODO handle errors gracefully.
      console.log({ errors });
    }
    // TODO this sort should be done by the query, need to figure this out.
    const sortedItems = items.sort((a, b) => (b.score || 0) - (a.score || 0));
    setScores(sortedItems.slice(0, 10));
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
        </TableRow>
      </TableHead>
      <TableBody>
        {scores.map(({ id, preferredUsername, score }) => (
          <TableRow key={id}>
            <TableCell>{preferredUsername}</TableCell>
            <TableCell>{score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
