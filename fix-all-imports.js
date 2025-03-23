import fs from "fs/promises"
import path from "path"
import { glob } from "glob"

// Define the root directory of your project
const ROOT_DIR = process.cwd()
const BACKUP_DIR = path.join(ROOT_DIR, "backup-all-imports")

// Create a backup function
async function createBackup(filePath) {
  const backupPath = path.join(BACKUP_DIR, path.relative(ROOT_DIR, filePath) + ".bak")

  try {
    // Create backup directory structure
    await fs.mkdir(path.dirname(backupPath), { recursive: true })

    // Copy the file content
    const content = await fs.readFile(filePath, "utf8")
    await fs.writeFile(backupPath, content, "utf8")

    return true
  } catch (error) {
    console.error(`Failed to backup ${filePath}:`, error)
    return false
  }
}

// Find all TypeScript files in the project
async function findAllTsFiles() {
  console.log("Searching for all TypeScript files in the project...")

  // Find all TypeScript files
  const files = await glob("src/**/*.{ts,tsx}", { cwd: ROOT_DIR })

  console.log(`Found ${files.length} TypeScript files.`)

  return files
}

// Update imports in a file
async function updateImportsInFile(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath)

  try {
    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch {
      return false
    }

    // Read the file content
    const content = await fs.readFile(fullPath, "utf8")

    // Check if the file contains references to kitespots-server
    if (content.includes("@/lib/kitespots-server")) {
      // Create a backup before modifying
      await createBackup(fullPath)

      // Replace all occurrences
      const updatedContent = content.replace(/@\/lib\/kitespots-server/g, "@/services/api-service")

      // Write the updated content back to the file
      await fs.writeFile(fullPath, updatedContent, "utf8")
      console.log(`Updated imports in: ${filePath}`)

      return true
    }

    return false
  } catch (error) {
    console.error(`Failed to update imports in ${filePath}:`, error)
    return false
  }
}

async function main() {
  console.log("Starting comprehensive import fix process...")

  // Create backup directory
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  console.log(`Backup directory created at: ${BACKUP_DIR}`)

  // Find all TypeScript files
  const files = await findAllTsFiles()

  // Update imports in each file
  let updatedCount = 0

  for (const file of files) {
    const updated = await updateImportsInFile(file)
    if (updated) updatedCount++
  }

  console.log(`\nUpdated imports in ${updatedCount} out of ${files.length} files.`)
  console.log("\nComprehensive import fix process completed!")
  console.log("Please check that everything is working correctly.")
  console.log("If there are any issues, you can restore from the backups at:", BACKUP_DIR)
}

main().catch((error) => {
  console.error("An error occurred during the comprehensive import fix process:", error)
})

