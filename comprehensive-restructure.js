import fs from "fs/promises"
import path from "path"
import { execSync } from "child_process"
import { glob } from "glob"

// Define the root directory of your project
const ROOT_DIR = process.cwd()
const SRC_DIR = path.join(ROOT_DIR, "src")
const BACKUP_DIR = path.join(ROOT_DIR, "backup-before-restructure")

// Define the structure we want to achieve
const DESIRED_STRUCTURE = {
  // Move services from app/services to src/services
  "src/app/services/api-service.ts": "src/services/api-service.ts",
  "src/app/services/backend-api.ts": "src/services/backend-api.ts",

  // Ensure lib files are in the right place
  "src/lib/kitespots-server.ts": "src/lib/kitespots-server.ts", // Keep in place but update imports
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function createBackup() {
  console.log("Creating backup of your project...")

  try {
    // Create backup directory if it doesn't exist
    await fs.mkdir(BACKUP_DIR, { recursive: true })

    // Use a simple copy command based on the platform
    if (process.platform === "win32") {
      execSync(`xcopy "${SRC_DIR}" "${BACKUP_DIR}" /E /I /H`)
    } else {
      execSync(`cp -R "${SRC_DIR}" "${BACKUP_DIR}"`)
    }

    console.log(`Backup created at: ${BACKUP_DIR}`)
    return true
  } catch (error) {
    console.error("Failed to create backup:", error)
    return false
  }
}

async function moveFiles() {
  console.log("Moving files to their correct locations...")

  for (const [sourcePath, destPath] of Object.entries(DESIRED_STRUCTURE)) {
    const fullSourcePath = path.join(ROOT_DIR, sourcePath)
    const fullDestPath = path.join(ROOT_DIR, destPath)

    // Skip if source and destination are the same
    if (sourcePath === destPath) {
      console.log(`Skipping ${sourcePath} (already in correct location)`)
      continue
    }

    // Check if source file exists
    if (await fileExists(fullSourcePath)) {
      // Create destination directory if it doesn't exist
      const destDir = path.dirname(fullDestPath)
      await fs.mkdir(destDir, { recursive: true })

      // Copy the file to the new location
      try {
        const content = await fs.readFile(fullSourcePath, "utf8")
        await fs.writeFile(fullDestPath, content, "utf8")
        console.log(`Moved: ${sourcePath} -> ${destPath}`)
      } catch (error) {
        console.error(`Failed to move ${sourcePath}:`, error)
      }
    } else {
      console.log(`Source file not found: ${sourcePath}`)
    }
  }
}

async function findAllTsFiles() {
  return glob("src/**/*.{ts,tsx}", { cwd: ROOT_DIR })
}

async function updateImportPaths() {
  console.log("Updating import paths in all TypeScript files...")

  const files = await findAllTsFiles()

  for (const filePath of files) {
    const fullPath = path.join(ROOT_DIR, filePath)

    try {
      let content = await fs.readFile(fullPath, "utf8")
      const originalContent = content

      // Update import paths from @/app/services to @/services
      content = content.replace(/from\s+["']@\/app\/services\/(.*?)["']/g, 'from "@/services/$1"')

      // Update import paths for any other patterns if needed

      // Only write the file if changes were made
      if (content !== originalContent) {
        await fs.writeFile(fullPath, content, "utf8")
        console.log(`Updated imports in: ${filePath}`)
      }
    } catch (error) {
      console.error(`Failed to update imports in ${filePath}:`, error)
    }
  }
}

async function main() {
  console.log("Starting comprehensive project restructuring...")

  // Create a backup first
  const backupSuccess = await createBackup()
  if (!backupSuccess) {
    console.log("Aborting restructure due to backup failure.")
    return
  }

  // Move files to their correct locations
  await moveFiles()

  // Update import paths in all TypeScript files
  await updateImportPaths()

  console.log("\nProject restructuring completed!")
  console.log("Please check that everything is working correctly.")
  console.log("If there are any issues, you can restore from the backup at:", BACKUP_DIR)
}

main().catch((error) => {
  console.error("An error occurred during restructuring:", error)
})

