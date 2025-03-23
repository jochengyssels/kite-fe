// Function to get chat response from backend
export async function getChatResponse(message: string): Promise<string> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
  
      const data = await response.json()
      return data.reply || "Sorry, I couldn't generate a response."
    } catch (error) {
      console.error("Error fetching chat response:", error)
      throw error
    }
  }
  
  