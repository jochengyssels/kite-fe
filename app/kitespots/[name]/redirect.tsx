import { redirect } from "next/navigation"

export default function KitespotsRedirect({ params }: { params: { name: string } }) {
  // Check if the parameter looks like an ID (numeric) or a name
  const isId = !isNaN(Number(params.name))

  if (isId) {
    // If it's an ID, redirect to the kitespot/[id] route
    redirect(`/kitespot/${params.name}`)
  } else {
    // If it's a name, we're already in the correct route
    // This component won't be rendered if we're in the correct route
    // but we need to return something for TypeScript
    return null
  }
}

