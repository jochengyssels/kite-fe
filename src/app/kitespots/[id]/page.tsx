import { redirect } from "next/navigation"

export default function KitespotsRedirect({ params }: { params: { id: string } }) {
  // Redirect to the correct path
  redirect(`/kitespot/${params.id}`)

  // This won't be rendered, but is needed for TypeScript
  return null
}

