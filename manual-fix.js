import fs from "fs/promises"
import path from "path"
import readline from "readline"

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Define the root directory of your project
const ROOT_DIR = process.cwd()
const BACKUP_DIR = path.join(ROOT_DIR, "backup-manual-fix")

// Function to ask a question and get user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

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

// Function to manually fix a specific file
async function manuallyFixFile(filePath) {
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
    const content = await fs.readFile(fullPath, "utf8")

    // Display the file content
    console.log(`\nContent of ${filePath}:`)
    console.log("-----------------------------------")
    console.log(content)
    console.log("-----------------------------------\n")

    // Ask user if they want to replace all occurrences of @/lib/kitespots-server
    const replace = await askQuestion(
      "Replace all occurrences of @/lib/kitespots-server with @/services/api-service? (y/n): ",
    )

    if (replace.toLowerCase() === "y") {
      // Replace all occurrences
      const updatedContent = content.replace(/@\/lib\/kitespots-server/g, "@/services/api-service")

      // Write the updated content back to the file
      await fs.writeFile(fullPath, updatedContent, "utf8")
      console.log(`Updated imports in: ${filePath}`)

      // Display the updated content
      console.log(`\nUpdated content of ${filePath}:`)
      console.log("-----------------------------------")
      console.log(updatedContent)
      console.log("-----------------------------------\n")

      return true
    } else {
      console.log("No changes made to the file.")
      return false
    }
  } catch (error) {
    console.error(`Failed to update imports in ${filePath}:`, error)
    return false
  }
}

async function main() {
  console.log("Starting manual fix process...")

  // Create backup directory
  await fs.mkdir(BACKUP_DIR, { recursive: true })
  console.log(`Backup directory created at: ${BACKUP_DIR}`)

  try {
    // Ask for the file path to fix
    const filePath = await askQuestion(
      "Enter the path to the file you want to fix (e.g., src/app/spots/[name]/page.tsx): ",
    )

    // Fix the specified file
    await manuallyFixFile(filePath)

    console.log("\nManual fix process completed!")
    console.log("Please check that everything is working correctly.")
    console.log("If there are any issues, you can restore from the backups at:", BACKUP_DIR)
  } finally {
    // Close the readline interface
    rl.close()
  }
}

main().catch((error) => {
  console.error("An error occurred during the manual fix process:", error)
  rl.close()
})

