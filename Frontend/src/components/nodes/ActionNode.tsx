import { Handle, Position } from '@xyflow/react'

const ACTION_LABELS: Record<string, string> = {
  DELAY: 'Delay',
  DISCORD_WEBHOOK: 'Discord Message',
  HTTP_REQUEST: 'HTTP Request',
}

const ACTION_COLORS: Record<string, string> = {
  DELAY: 'border-yellow-500',
  DISCORD_WEBHOOK: 'border-indigo-500',
  HTTP_REQUEST: 'border-green-500',
}

const DOT_COLORS: Record<string, string> = {
  DELAY: 'bg-yellow-400',
  DISCORD_WEBHOOK: 'bg-indigo-400',
  HTTP_REQUEST: 'bg-green-400',
}

const ActionNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div className={`bg-gray-900 border-2 ${ACTION_COLORS[data.type] || 'border-gray-600'} ${selected ? 'ring-2 ring-white/20' : ''} rounded-xl p-4 min-w-[200px]`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500" />
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${DOT_COLORS[data.type] || 'bg-gray-400'}`} />
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Action</span>
      </div>
      <p className="text-white font-medium">{ACTION_LABELS[data.type] || data.type}</p>
      {data.type === 'DELAY' && (
        <p className="text-gray-500 text-xs mt-1">Wait {data.config?.seconds || 1}s</p>
      )}
      {data.type === 'DISCORD_WEBHOOK' && (
        <p className="text-gray-500 text-xs mt-1 truncate max-w-[160px]">{data.config?.message || 'No message set'}</p>
      )}
      {data.type === 'HTTP_REQUEST' && (
        <p className="text-gray-500 text-xs mt-1">{data.config?.method || 'GET'} request</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500" />
    </div>
  )
}

export default ActionNode