import { siteConfig } from "~/config/site"
import { sendTweet } from "~/services/twitter"

/**
 * Check if a tool has reached a milestone
 * @param prevStars - The number of stars the tool had before the current update
 * @param newStars - The current number of stars for the tool
 * @returns The milestone reached, or null if it hasn't reached any milestone
 */
export const getMilestoneReached = (prevStars: number, newStars: number) => {
  const milestones = [100, 500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000]
  const unreachedMilestones = milestones.filter(m => prevStars < m)
  const reachedMilestones = unreachedMilestones.filter(m => newStars >= m)

  return reachedMilestones.length ? Math.max(...reachedMilestones) : null
}

/**
 * Send a tweet congratulating a tool for reaching a milestone
 * @param milestone - The milestone reached
 * @param name - The name of the tool
 * @param slug - The slug of the tool
 */
export const sendMilestoneTweet = async (milestone: number, name: string, slug: string) => {
  const tweet = `🎉 ${name} has just reached ${milestone.toLocaleString()} stars on GitHub!
Huge congrats to the team!

Check it out on OpenAlternative: ${siteConfig.url}/${slug}

#opensource #openalternative #github #software`

  try {
    await sendTweet(tweet)
    console.log(`Tweet sent for ${name}`)
  } catch (error) {
    console.error(`Error sending tweet for ${name}:`, error)
  }
}
