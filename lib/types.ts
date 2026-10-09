export type Outcome = "Interested" | "Callback requested" | "Not interested" | "No answer" | "Failed" | "Opted out" | "Queued";
export type Contact = {
  id: string; name: string; phone: string; city: string; type: "B2B" | "B2C";
  language: string; consent: boolean; consentSource: string; status: Outcome; createdAt: string;
};
export type Campaign = {
  id: string; name: string; audience: string; language: string; script: string;
  status: "Draft" | "Paused" | "Ready"; createdAt: string;
};
export type CallLog = {
  id: string; contactName: string; phone: string; campaign: string; status: Outcome;
  duration: string; time: string; note: string;
};