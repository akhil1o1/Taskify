import DashboardNavbar from "@/components/dashboard/dashboard-navbar";

export default function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="h-full">
         <DashboardNavbar />
         {children}
      </div>
   );
}
