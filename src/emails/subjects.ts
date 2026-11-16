/*
 * Subject prefixes of the emails the site sends to its own inbox. The admin portal rebuilds the
 * subscriber list and campaign history by searching Gmail for these, so don't change them: older
 * emails would stop being found. (Archiving or labelling the emails is fine; deleting them isn't.)
 */
export const SIGNUP_SUBJECT = "[CLVRY Website] New newsletter sign-up: ";
export const UNSUBSCRIBE_SUBJECT = "[CLVRY Website] Unsubscribed: ";
export const CAMPAIGN_SUBJECT = "[CLVRY Website] Campaign sent: ";

/** Custom header on campaign log emails carrying the send stats as JSON. */
export const CAMPAIGN_STATS_HEADER = "X-Clvry-Campaign";
