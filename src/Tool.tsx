import React from "react";
import type { Ticket } from "./types";

interface ToolProps {
  tickets: Ticket[];
}

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  console.log("render Tool");
  console.log(tickets.length);

  return <div>テスト</div>;
};

export default Tool;
