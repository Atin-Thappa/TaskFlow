import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/layout/Navbar'
import type { Workflow } from '../types'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [showInput, setShowInput] = useState(false)

  const fetchWorkflows = async () => {
    try {
      const res = await api.get('/workflows')
      setWorkflows(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWorkflows() }, [])

  const createWorkflow = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await api.post('/workflows', { name: newName })
      setWorkflows(prev => [res.data, ...prev])
      setNewName('')
      setShowInput(false)
    } finally {
      setCreating(false)
    }
  }

  const deleteWorkflow = async (id: string) => {
    await api.delete(`/workflows/${id}`)
    setWorkflows(prev => prev.filter(w => w._id !== id))
  }

  const toggleWorkflow = async (w: Workflow) => {
    const res = await api.put(`/workflows/${w._id}`, { isActive: !w.isActive })
    setWorkflows(prev => prev.map(x => x._id === w._id ? res.data : x))
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Workflows</h2>
            <p className="text-gray-400 mt-1">Manage your automation workflows</p>
          </div>
          <button
            onClick={() => setShowInput(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Workflow
          </button>
        </div>

        {showInput && (
          <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-xl flex gap-3">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createWorkflow()}
              placeholder="Workflow name..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={createWorkflow}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => { setShowInput(false); setNewName('') }}
              className="text-gray-400 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No workflows yet</p>
            <p className="text-gray-600 text-sm mt-2">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflows.map(w => (
              <div key={w._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${w.isActive ? 'bg-green-400' : 'bg-gray-600'}`} />
                  <div>
                    <h3 className="text-white font-medium">{w.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {w.actions.length} action{w.actions.length !== 1 ? 's' : ''} · webhook/{w.trigger.webhookPath}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWorkflow(w)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      w.isActive
                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {w.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => navigate(`/workflow/${w._id}/builder`)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/workflow/${w._id}/logs`)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Logs
                  </button>
                  <button
                    onClick={() => deleteWorkflow(w._id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage