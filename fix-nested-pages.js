import fs from "fs/promises"
import path from "path"
import { glob } from "glob"

// Define the root directory of your project
const ROOT_DIR = process.cwd()
const BACKUP_DIR = path.join(ROOT_DIR, "backup-nested-pages")

// Create a backup function
async function createBackup(filePath) {
  const backupPath = path.join(BACKUP_DIR, path.relative(ROOT_DIR, filePath) + ".bak")

  try {
    // Create backup directory structure
    await fs.mkdir(path.dirname(backupPath), { recursive: true })

    // Copy the file content
    const content = await fs.readFile(filePath, "utf8")
    await fs.writeFile(backupPath, content, "utf8")

    console.log(`Created backup: ${backupPath}`)
    return true
  } catch (error) {
    console.error(`Failed to backup ${filePath}:`, error)
    return false
  }
}

// Find all nested page files under spots/[name]
async function findNestedPageFiles() {
  console.log("Searching for nested page files under spots/[name]...")

  // Find all TypeScript and JavaScript files in the spots/[name] directory
  const files = await glob("src/app/spots/[name]/**/*.{ts,tsx,js,jsx}", { cwd: ROOT_DIR })

  console.log(`Found ${files.length} files in spots/[name] directory:`)
  files.forEach((file) => console.log(`- ${file}`))

  return files
}

// Update imports in a file with detailed logging
async function updateImportsInFile(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath)

  try {
    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch {
      console.log(`File not found: ${filePath}`)
      return false
    }

    // Create a backup first
    await createBackup(fullPath)

    // Read the file content
    let content = await fs.readFile(fullPath, "utf8")
    console.log(`Processing file: ${filePath}`)

    // Check for different import patterns
    let modified = false

    // Pattern 1: import { x } from "@/lib/kitespots-server"
    const pattern1 = /import\s+{([^}]+)}\s+from\s+["']@\/lib\/kitespots-server["']/g
    if (pattern1.test(content)) {
      console.log(`Found Pattern 1 in ${filePath}`)
      content = content.replace(pattern1, `import {$1} from "@/services/api-service"`)
      modified = true
    }

    // Pattern 2: import x from "@/lib/kitespots-server"
    const pattern2 = /import\s+(\w+)\s+from\s+["']@\/lib\/kitespots-server["']/g
    if (pattern2.test(content)) {
      console.log(`Found Pattern 2 in ${filePath}`)
      content = content.replace(pattern2, `import $1 from "@/services/api-service"`)
      modified = true
    }

    // Pattern 3: import * as x from "@/lib/kitespots-server"
    const pattern3 = /import\s+\*\s+as\s+(\w+)\s+from\s+["']@\/lib\/kitespots-server["']/g
    if (pattern3.test(content)) {
      console.log(`Found Pattern 3 in ${filePath}`)
      content = content.replace(pattern3, `import * as $1 from "@/services/api-service"`)
      modified = true
    }

    // Check for any other references to kitespots-server
    if (content.includes("@/lib/kitespots-server")) {
      console.log(`Found other references to kitespots-server in ${filePath}`)
      content = content.replace(/@\/lib\/kitespots-server/g, "@/services/api-service")
      modified = true
    }

    // Write the updated content back to the file if modified
    if (modified) {
      await fs.writeFile(fullPath, content, "utf8")
      console.log(`Updated imports in: ${filePath}`)
      return true
    } else {
      console.log(`No imports to update in: ${filePath}`)
      return false
    }
  } catch (error) {
    console.error(`Failed to update imports in ${filePath}:`, error)
    return false
  }
}

// Print the content of a file for debugging
async function printFileContent(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath)

  try {
    const content = await fs.readFile(fullPath, "utf8")
    console.log(`\nContent of ${filePath}:`)
    console.log("-----------------------------------")
    console.log(content)
    console.log("-----------------------------------\n")
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error)
  }
}

async function main() {
  console.log("Starting nested pages fix process...")

  // Create backup directory
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  console.log(`Backup directory created at: ${BACKUP_DIR}`)

  // Find nested page files
  const files = await findNestedPageFiles()

  if (files.length === 0) {
    console.log("No nested page files found. Exiting.")
    return
  }

  // Print content of page.tsx for debugging
  const pageFile = files.find((f) => f.endsWith("page.tsx"))
  if (pageFile) {
    await printFileContent(pageFile)
  }

  // Update imports in each file
  let updatedCount = 0

  for (const file of files) {
    const updated = await updateImportsInFile(file)
    if (updated) updatedCount++
  }

  console.log(`\nUpdated imports in ${updatedCount} out of ${files.length} files.`)

  // Also check and fix the main spots/[name]/page.tsx file specifically
  const mainPageFile = "src/app/spots/[name]/page.tsx"
  console.log(`\nChecking main page file: ${mainPageFile}`)

  try {
    const fullPath = path.join(ROOT_DIR, mainPageFile)
    if (
      await fs
        .access(fullPath)
        .then(() => true)
        .catch(() => false)
    ) {
      await updateImportsInFile(mainPageFile)

      // Print the updated content for verification
      await printFileContent(mainPageFile)
    } else {
      console.log(`Main page file not found: ${mainPageFile}`)
    }
  } catch (error) {
    console.error(`Error processing main page file:`, error)
  }

  console.log("\nNested pages fix process completed!")
  console.log("Please check that everything is working correctly.")
  console.log("If there are any issues, you can restore from the backups at:", BACKUP_DIR)
}

main().catch((error) => {
  console.error("An error occurred during the nested pages fix process:", error)
})

