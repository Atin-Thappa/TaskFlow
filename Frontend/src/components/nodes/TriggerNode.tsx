import { Handle, Position } from '@xyflow/react'

const TriggerNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gray-900 border-2 border-blue-500 rounded-xl p-4 min-w-[200px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-blue-400" />
        <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Trigger</span>
      </div>
      <p className="text-white font-medium">Webhook</p>
      <p className="text-gray-500 text-xs mt-1 font-mono">/webhook/{data.webhookPath}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  )
}

export default TriggerNode