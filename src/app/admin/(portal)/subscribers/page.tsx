import type { Metadata } from "next";
import { Subscribers } from "@/components/admin/subscribers";

export const metadata: Metadata = { title: "Subscribers" };

export default function SubscribersPage() {
  return <Subscribers />;
}
