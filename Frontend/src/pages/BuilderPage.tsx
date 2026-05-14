import { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import{ ReactFlow, Background, Controls, MiniMap, addEdge, BackgroundVariant, applyNodeChanges, applyEdgeChanges} from '@xyflow/react'
import type { Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import api from '../api/axios'
import { useWorkflowStore } from '../store/workflowStore'
import TriggerNode from '../components/nodes/TriggerNode'
import ActionNode from '../components/nodes/ActionNode'
import ConfigPanel from '../components/builder/ConfigPanel'
import type { Workflow } from '../types'

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
}

const ACTION_TYPES = ['DELAY', 'DISCORD_WEBHOOK', 'HTTP_REQUEST']

const BuilderPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/workflows/${id}`)
      const w: Workflow = res.data
      setWorkflow(w)

      const triggerNode = {
        id: 'trigger',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: { type: 'TRIGGER', webhookPath: w.trigger.webhookPath, config: {} },
        deletable: false,
      }

      const actionNodes = w.actions.map((action, i) => ({
        id: `action-${i}`,
        type: 'action',
        position: { x: 250, y: 180 + i * 130 },
        data: { type: action.type, config: action.config },
      }))

      const allNodes = [triggerNode, ...actionNodes]
      setNodes(allNodes)

      const builtEdges = allNodes.slice(0, -1).map((_, i) => ({
        id: `e-${i}`,
        source: allNodes[i].id,
        target: allNodes[i + 1].id,
        style: { stroke: '#4B5563' },
      }))
      setEdges(builtEdges)
    }
    load()
  }, [id])

  const onConnect = useCallback(
    (connection: Connection) => setEdges(addEdge({ ...connection, style: { stroke: '#4B5563' } }, edges)),
    [edges]
  )

  const addAction = (type: string) => {
    const newNode = {
      id: `action-${Date.now()}`,
      type: 'action',
      position: { x: 250, y: 180 + (nodes.length - 1) * 130 },
      data: { type, config: {} },
    }
    const prevId = nodes[nodes.length - 1]?.id
    setNodes([...nodes, newNode])
    if (prevId) {
      setEdges([...edges, {
        id: `e-${Date.now()}`,
        source: prevId,
        target: newNode.id,
        style: { stroke: '#4B5563' },
      }])
    }
  }

  const removeSelected = () => {
    if (!selectedNode || selectedNode.id === 'trigger') return
    setNodes(nodes.filter(n => n.id !== selectedNode.id))
    setEdges(edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id))
    setSelectedNode(null)
  }

  const save = async () => {
    setSaving(true)
    try {
      const actions = nodes
        .filter(n => n.id !== 'trigger')
        .map(n => ({ type: (n.data as any).type, config: (n.data as any).config }))
      await api.put(`/workflows/${id}`, { actions })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <span className="text-gray-600">|</span>
          <span className="text-white font-medium">{workflow?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedNode && selectedNode.id !== 'trigger' && (
            <button
              onClick={removeSelected}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Remove Node
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium transition-colors"
          >
            {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Add Action</p>
            <div className="space-y-2">
              {ACTION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => addAction(type)}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {type === 'DELAY' && '⏱ Delay'}
                  {type === 'DISCORD_WEBHOOK' && '💬 Discord'}
                  {type === 'HTTP_REQUEST' && '🌐 HTTP Request'}
                </button>
              ))}
            </div>
          </div>

          {selectedNode && (
            <div className="flex-1 overflow-y-auto border-t border-gray-800">
              <ConfigPanel node={selectedNode} />
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {setNodes(applyNodeChanges(changes, nodes))}}
            onEdgesChange={(changes) => {setEdges(applyEdgeChanges(changes, edges))}}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} color="#374151" />
            <Controls />
            <MiniMap nodeColor="#1f2937" maskColor="#030712" />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default BuilderPage