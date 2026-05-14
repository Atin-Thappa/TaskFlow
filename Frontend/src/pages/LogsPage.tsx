import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import type { Execution, Workflow } from '../types'

const LogsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [executions, setExecutions] = useState<Execution[]>([])
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Execution | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [wRes, eRes] = await Promise.all([
          api.get(`/workflows/${id}`),
          api.get(`/executions/${id}`),
        ])
        setWorkflow(wRes.data)
        setExecutions(eRes.data)
        if (eRes.data.length > 0) setSelected(eRes.data[0])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const statusColor = (status: string) => {
    if (status === 'success') return 'text-green-400 bg-green-500/10 border-green-500/20'
    if (status === 'failed') return 'text-red-400 bg-red-500/10 border-red-500/20'
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleString()

  const duration = (e: Execution) => {
    if (!e.completedAt) return '—'
    const ms = new Date(e.completedAt).getTime() - new Date(e.startedAt).getTime()
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <span className="text-gray-600">|</span>
          <div>
            <h2 className="text-2xl font-bold text-white">{workflow?.name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">Execution history</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : executions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No executions yet</p>
            <p className="text-gray-600 text-sm mt-2">Trigger the webhook to see logs here</p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Execution list */}
            <div className="w-72 shrink-0 space-y-2">
              {executions.map(e => (
                <div
                  key={e._id}
                  onClick={() => setSelected(e)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    selected?._id === e._id
                      ? 'bg-gray-800 border-gray-600'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColor(e.status)}`}>
                      {e.status}
                    </span>
                    <span className="text-gray-500 text-xs">{duration(e)}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{formatDate(e.startedAt)}</p>
                </div>
              ))}
            </div>

            {/* Execution detail */}
            {selected && (
              <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-3 py-1 rounded-full border font-medium ${statusColor(selected.status)}`}>
                      {selected.status}
                    </span>
                    <span className="text-gray-400 text-sm">Duration: {duration(selected)}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{formatDate(selected.startedAt)}</span>
                </div>

                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Logs</h3>
                  <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm space-y-1">
                    {selected.logs.length === 0 ? (
                      <p className="text-gray-600">No logs</p>
                    ) : selected.logs.map((log, i) => (
                      <p key={i} className="text-green-400">{log}</p>
                    ))}
                  </div>
                </div>

                {selected.outputs.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Outputs</h3>
                    <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
                      <pre className="text-blue-400 whitespace-pre-wrap break-all">
                        {JSON.stringify(selected.outputs, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogsPage