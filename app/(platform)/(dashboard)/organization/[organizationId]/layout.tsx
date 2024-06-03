import OrgControl from "@/components/dashboard/organization/org-control";

export default function OrganizationIdLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <>
         <OrgControl />
         {children}
      </>
   );
}
