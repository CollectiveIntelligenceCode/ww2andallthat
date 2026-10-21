import { redirect } from "next/navigation";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// Studio is embedded here once NEXT_PUBLIC_SANITY_PROJECT_ID is set.
// Until then, redirect to sanity.io/manage.
export default function StudioPage() {
  if (!projectId || projectId === "placeholder") {
    redirect("https://sanity.io/manage");
  }
  // Dynamic import so the studio bundle is only loaded when actually configured
  const { default: StudioRoot } = require("./StudioRoot");
  return <StudioRoot />;
}
