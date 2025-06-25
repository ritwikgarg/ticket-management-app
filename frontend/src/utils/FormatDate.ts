export const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const suffix =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
            ? "rd"
            : "th";

    let time = date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (time.endsWith("am")) {
        time = time.slice(0, -2) + "AM";
    } else if (time.endsWith("pm")) {
        time = time.slice(0, -2) + "PM";
    }

    const monthYear = date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    return `${time}, ${day}${suffix} ${monthYear}`;
};
