import type { Metadata } from "next";
import { Campaigns } from "@/components/admin/campaigns";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return <Campaigns />;
}
