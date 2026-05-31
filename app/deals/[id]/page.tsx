import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DealPage } from "@/components/DealPage";
import { getDeal } from "@/data/deals";

// Server component: params is a Promise in Next 16 — await it, resolve the
// hardcoded deal, then hand off to the client DealPage for the tabbed UI.
export default async function DealDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) notFound();

  return (
    <AppShell>
      <DealPage deal={deal} />
    </AppShell>
  );
}
