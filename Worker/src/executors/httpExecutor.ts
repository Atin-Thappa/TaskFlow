import axios from 'axios'

export const executeHttp = async (config: Record<string, any>): Promise<string> => {
  const { url, method = 'GET', headers = {}, body } = config

  const response = await axios({
    url,
    method,
    headers,
    data: body,
  })

  return `HTTP ${method} ${url} → ${response.status}`
}