// Safety event logging
export function logSafetyEvent(event: { type: string; message: string }): void {
  // Log safety events for monitoring
  console.log("[Safety]", event.type, event.message);
}
