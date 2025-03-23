import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Frontend() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Frontend Overview</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Project Structure</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Next.js Frontend</CardTitle>
              <CardDescription>Built with App Router, TypeScript, and Tailwind CSS</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This is the frontend part of your master project. It's built with Next.js using the App Router pattern,
                TypeScript for type safety, and Tailwind CSS for styling.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-700 mb-2">Next.js</h3>
                  <p className="text-sm">Modern React framework with both client and server components</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-700 mb-2">TypeScript</h3>
                  <p className="text-sm">Strongly typed programming language that builds on JavaScript</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-700 mb-2">Tailwind CSS</h3>
                  <p className="text-sm">Utility-first CSS framework for rapid UI development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Project Structure</CardTitle>
              <CardDescription>How the frontend code is organized</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-gray-100 p-4 rounded-md">
                <pre>
                  {`app/
├── api/
│   └── backend-proxy/
│       └── route.ts      # API route that proxies requests to the backend
├── frontend/
│   └── page.tsx          # Frontend overview page
├── backend/
│   └── page.tsx          # Backend overview page
├── api-test/
│   └── page.tsx          # Page to test API connection
├── layout.tsx            # Root layout with metadata
��── page.tsx              # Home page
└── globals.css           # Global styles
components/
├── ui/                   # UI components (buttons, cards, etc.)
└── api-connector.tsx     # Component to connect to the backend API`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>Key components in the frontend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-semibold mb-2">API Connector</h3>
                  <p className="text-sm mb-2">Handles communication with the backend API</p>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono">components/api-connector.tsx</div>
                </div>

                <div className="border p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Backend Proxy</h3>
                  <p className="text-sm mb-2">Next.js API route that forwards requests to the Python backend</p>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono">app/api/backend-proxy/route.ts</div>
                </div>

                <div className="border p-4 rounded-md">
                  <h3 className="font-semibold mb-2">UI Components</h3>
                  <p className="text-sm mb-2">Reusable UI components from shadcn/ui</p>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono">components/ui/*</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

