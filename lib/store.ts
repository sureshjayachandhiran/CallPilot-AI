import type { Campaign, Contact, CallLog } from "./types";
const CONTACTS = "callpilot_contacts_v1", CAMPAIGNS = "callpilot_campaigns_v1", LOGS = "callpilot_logs_v1";
const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => { if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(value)); };
export const getContacts = () => read<Contact[]>(CONTACTS, []);
export const saveContacts = (v: Contact[]) => write(CONTACTS, v);
export const getCampaigns = () => read<Campaign[]>(CAMPAIGNS, []);
export const saveCampaigns = (v: Campaign[]) => write(CAMPAIGNS, v);
export const getLogs = () => read<CallLog[]>(LOGS, []);
export const saveLogs = (v: CallLog[]) => write(LOGS, v);
export const uid = () => typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const dateNow = () => new Date().toISOString();