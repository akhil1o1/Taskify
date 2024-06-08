import { OrganizationProfile } from "@clerk/nextjs";

export default function SettingsPage() {
   return (
      <div className="w-full">
         <OrganizationProfile
            routing="hash"
            appearance={{
               elements: {
                  cardBox: {
                     border: "1px solid #e5e5e5",
                     boxShadow: "none",
                     width: "100%",
                  },
                  card: {
                     boxShadow: "none",
                     width: "100%",
                  },
                  scrollBox: {
                     borderRadius: 0,
                  },
               },
            }}
         />
      </div>
   );
}
