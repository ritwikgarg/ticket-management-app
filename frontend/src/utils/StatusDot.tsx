import { type JSX } from "react";
import { Status } from "@/enums/ticket/Status"; // adjust the path as needed

export function getStatusDot(status: Status): JSX.Element {

  const colorClass = (() => {
    switch (status) {
      case Status.OPEN:
        return "bg-blue-500";
      case Status.DOING:
        return "bg-yellow-400";
      case Status.REVIEW:
        return "bg-rose-800";
      case Status.SOLVED:
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  })();

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colorClass} mr-2`}
    />
  );
}
