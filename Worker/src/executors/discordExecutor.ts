import axios from 'axios'

export const executeDiscord = async (config: Record<string, any>): Promise<string> => {
  await axios.post(config.webhookUrl, {
    content: config.message || 'TaskFlow triggered this message',
  })
  return `Discord message sent`
}