export function formatEnumValue(value: string | number): string {
    if (typeof value === "number") {
        return value.toString();
    }
    return value
        .split("_") // ['in', 'progress']
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // ['In', 'Progress']
        .join(" "); // 'In Progress'
}
