export const issueMetadata = {
    hardware: {
        motor: "Motor Issue",
        chuck: "Chuck Malfunction",
        robot_arm: "Robot Arm Failure",
        other: "Other",
    },
    software: {
        gap_check: "Gap Check Error",
        cut_path: "Cut Path Issue",
        connection: "Connection Problem",
        registration: "Registration Failure",
        other: "Other",
    },
    other: {
        dispatch: "Dispatch",
        other: "Other",
    },
} as const;


export const issueMetdataMap = Object.fromEntries(
  Object.entries(issueMetadata).map(([category, subcategories]) => [
    category,
    Object.keys(subcategories),
  ])
) 
