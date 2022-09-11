export const isDev = () => typeof window !== "undefined" && window.location.hostname.includes("localhost");
