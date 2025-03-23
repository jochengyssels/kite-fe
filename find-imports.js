import fs from "fs/promises"
import path from "path"
import { glob } from "glob"

// Define the root directory of your project
const ROOT_DIR = process.cwd()

async function findImportsFromPath(searchPattern) {
  console.log(`Searching for imports from: ${searchPattern}`)

  // Find all TypeScript and JavaScript files
  const files = await glob("src/**/*.{ts,tsx,js,jsx}", { cwd: ROOT_DIR })

  const results = []

  for (const file of files) {
    const fullPath = path.join(ROOT_DIR, file)

    try {
      const content = await fs.readFile(fullPath, "utf8")

      // Create a regex to find imports from the specified path
      const regex = new RegExp(`from\\s+["']${searchPattern}["']`, "g")

      if (regex.test(content)) {
        results.push(file)
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error)
    }
  }

  return results
}

async function main() {
  // Search for imports from @/lib/kitespots-server
  const libImports = await findImportsFromPath("@/lib/kitespots-server")
  console.log("\nFiles importing from @/lib/kitespots-server:")
  libImports.forEach((file) => console.log(`- ${file}`))

  // Search for imports from @/app/services
  const appServicesImports = await findImportsFromPath("@/app/services")
  console.log("\nFiles importing from @/app/services:")
  appServicesImports.forEach((file) => console.log(`- ${file}`))

  // Search for imports from @/services
  const servicesImports = await findImportsFromPath("@/services")
  console.log("\nFiles importing from @/services:")
  servicesImports.forEach((file) => console.log(`- ${file}`))
}

main().catch((error) => {
  console.error("An error occurred:", error)
})

