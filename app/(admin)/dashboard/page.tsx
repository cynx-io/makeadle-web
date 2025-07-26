import { AdminDashboard } from "@/components/admin/AdminDashboard";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  return <AdminDashboard defaultTab={tab || "overview"} />;
}
