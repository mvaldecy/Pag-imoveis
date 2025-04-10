import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardHeader } from "@/components/dashboard-header"
import { RecentContracts } from "@/components/recent-contracts"

export default function Home() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardStats />
      <RecentContracts />
    </div>
  )
}
