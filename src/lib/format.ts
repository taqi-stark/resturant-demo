export function rupees(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return "Rs " + Math.round(value).toLocaleString("en-PK");
}

export function timeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-PK", {
    hour: "numeric",
    minute: "2-digit",
  });
}
