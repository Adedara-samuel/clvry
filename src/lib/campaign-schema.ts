import { z } from "zod";

const link = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/, message: "Use a full https:// link" }),
  z.string().regex(/^\/[\w\-./?=&#%]*$/, "Use a full https:// link or a path on this site, like /explore"),
]);

/** A campaign as written in the admin. The body is plain text: blank lines split paragraphs,
 *  **bold** and [link text](https://…) are supported. */
export const campaignSchema = z.object({
  subject: z.string().trim().min(1, "Add a subject").max(150),
  preheader: z.string().trim().max(150),
  heading: z.string().trim().min(1, "Add a heading").max(120),
  body: z.string().trim().min(1, "Write the message").max(10_000),
  imageUrl: link,
  ctaLabel: z.string().trim().max(40),
  ctaUrl: link,
});

export type Campaign = z.infer<typeof campaignSchema>;

export const emptyCampaign: Campaign = {
  subject: "",
  preheader: "",
  heading: "",
  body: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
};

/** Gmail's daily cap for a regular account; Google Workspace accounts get 2,000. */
export const GMAIL_DAILY_LIMIT = 500;
/** Recipients per send request, so no single request runs long enough to time out. */
export const SEND_BATCH_SIZE = 20;
