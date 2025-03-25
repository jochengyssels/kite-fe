const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

export async function fetchWithRetry(url: string, retryCount = 0): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 }, // 1 hour revalidation
    })

    if (!response.ok) {
      const errorText = await response.text()

      // If we hit rate limit and have retries left, wait and try again
      if (response.status === 429) {
        throw new Error("Rate limit exceeded")
      }

      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
        console.log(`Rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithRetry(url, retryCount + 1)
      }

      throw new Error(`API responded with status: ${response.status}
${errorText}`)
    }

    return await response.json()
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
      console.log(`API error, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(url, retryCount + 1)
    }
    throw error
  }
} 