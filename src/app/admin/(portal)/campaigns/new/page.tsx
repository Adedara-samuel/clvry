import type { Metadata } from "next";
import { CampaignComposer } from "@/components/admin/campaign-composer";

export const metadata: Metadata = { title: "New campaign" };

export default function NewCampaignPage() {
  return <CampaignComposer />;
}
