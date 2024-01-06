type InvalidValue = {
    [key: string]: {
        includes?: string[];
        notIncludes?: string[];
        reason: string;
    }[];
};

const invalidValues = {
    CORS_ORIGIN_URL: [
        {
            includes: ["192.168.x.x"],
            reason: "This is an example value. This will not work.",
        },
        {
            includes: ["localhost"],
            reason: "SnailyCAD will not work with localhost. Use your system's private or public IP address.",
        },
        {
            notIncludes: ["http://", "https://"],
            reason: "Protocol is missing. Expected: http://... or https://...",
        },
    ],
    NEXT_PUBLIC_CLIENT_URL: [
        {
            includes: ["192.168.x.x"],
            reason: "This is an example value. This will not work.",
        },
        {
            includes: ["localhost"],
            reason: "SnailyCAD will not work with localhost. Use your system's private or public IP address.",
        },
        {
            notIncludes: ["http://", "https://"],
            reason: "Protocol is missing. Expected: http://... or https://...",
        },
    ],
    NEXT_PUBLIC_PROD_ORIGIN: [
        {
            includes: ["192.168.x.x"],
            reason: "This is an example value. This will not work.",
        },
        {
            includes: ["localhost"],
            reason: "SnailyCAD will not work with localhost. Use your system's private or public IP address.",
        },
        {
            notIncludes: ["http://", "https://"],
            reason: "Protocol is missing. Expected: http://... or https://...",
        },
    ],
} as InvalidValue;

export default invalidValues;
