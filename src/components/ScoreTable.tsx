import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";
import { Schema } from "../../amplify/data/resource";

type ScoreTableProps = {
  scores: Schema["GameScores"]["type"][];
};

export default function ScoreTable({ scores }: ScoreTableProps) {
  return (
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
