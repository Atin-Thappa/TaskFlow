import mongoose, { Document } from 'mongoose'

export interface IExecution extends Document {
  workflowId: mongoose.Types.ObjectId
  status: 'running' | 'success' | 'failed'
  startedAt: Date
  completedAt?: Date
  logs: string[]
  outputs: Record<string, any>[]
}

const executionSchema = new mongoose.Schema<IExecution>({
  workflowId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
  status:      { type: String, enum: ['running', 'success', 'failed'], default: 'running' },
  startedAt:   { type: Date, default: Date.now },
  completedAt: { type: Date },
  logs:    { type: [], default: [] },
  outputs: { type: [], default: [] },
})

export default mongoose.model<IExecution>('Execution', executionSchema)