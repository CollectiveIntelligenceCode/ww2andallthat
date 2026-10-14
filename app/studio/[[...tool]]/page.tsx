import { redirect } from "next/navigation";

// Sanity Studio embedded here once NEXT_PUBLIC_SANITY_PROJECT_ID is configured.
// Until then, manage content at sanity.io dashboard.
export default function StudioPage() {
  redirect("https://sanity.io");
}
