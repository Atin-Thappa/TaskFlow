export const executeDelay = async (config: Record<string, any>): Promise<string> => {
  const ms = (config.seconds || 1) * 1000
  await new Promise(resolve => setTimeout(resolve, ms))
  return `Waited ${config.seconds || 1} seconds`
}