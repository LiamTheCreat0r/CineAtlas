export function calculateScore(
  nodes: number,
  longestStreak: number,
  timeSurvived: number,
): { nodes: number; streak: number; time: number; total: number } {
  const nodeScore = nodes * 100
  const streakScore = longestStreak * 50
  const timeScore = timeSurvived * 10
  return {
    nodes: nodeScore,
    streak: streakScore,
    time: timeScore,
    total: nodeScore + streakScore + timeScore,
  }
}
