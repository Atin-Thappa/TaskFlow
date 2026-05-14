import { useState, useEffect } from 'react'
import { useWorkflowStore } from '../../store/workflowStore'
import type { Node } from '@xyflow/react'

const ConfigPanel = ({ node }: { node: Node }) => {
  const { updateNodeData } = useWorkflowStore()
  const { type, config = {} } = node.data as any

  const [local, setLocal] = useState<Record<string, any>>(config)

  useEffect(() => {
    setLocal(config)
  }, [node.id])

  const commit = (updates: Record<string, any>) => {
    updateNodeData(node.id, { config: { ...config, ...updates } })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') (e.target as HTMLElement).blur()
  }

  if (type === 'TRIGGER') return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-3">Webhook Trigger</h3>
      <p className="text-gray-400 text-sm">This workflow starts when a POST request is sent to the webhook URL shown on the node.</p>
    </div>
  )

  if (type === 'DELAY') return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">Delay</h3>
      <label className="block text-sm text-gray-300 mb-1.5">Seconds to wait</label>
      <input
        type="number"
        min={1}
        value={local.seconds ?? 1}
        onChange={e => setLocal({ ...local, seconds: e.target.value })}
        onBlur={() => commit({ seconds: parseInt(local.seconds) || 1 })}
        onKeyDown={handleKeyDown}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  )

  if (type === 'DISCORD_WEBHOOK') return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">Discord Message</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Webhook URL</label>
          <input
            type="text"
            value={local.webhookUrl || ''}
            onChange={e => setLocal({ ...local, webhookUrl: e.target.value })}
            onBlur={() => commit(local)}
            onKeyDown={handleKeyDown}
            placeholder="https://discord.com/api/webhooks/..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Message</label>
          <textarea
            value={local.message || ''}
            onChange={e => setLocal({ ...local, message: e.target.value })}
            onBlur={() => commit(local)}
            onKeyDown={handleKeyDown}
            placeholder="Your message..."
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  )

  if (type === 'HTTP_REQUEST') return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">HTTP Request</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">URL</label>
          <input
            type="text"
            value={local.url || ''}
            onChange={e => setLocal({ ...local, url: e.target.value })}
            onBlur={() => commit(local)}
            onKeyDown={handleKeyDown}
            placeholder="https://api.example.com/endpoint"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Method</label>
          <select
            value={local.method || 'GET'}
            onChange={e => {
              const updated = { ...local, method: e.target.value }
              setLocal(updated)
              commit(updated)
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option>GET</option>
            <option>POST</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Body (JSON)</label>
          <textarea
            value={local.body || ''}
            onChange={e => setLocal({ ...local, body: e.target.value })}
            onBlur={() => commit(local)}
            onKeyDown={handleKeyDown}
            placeholder='{"key": "value"}'
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )

  return null
}

export default ConfigPanel