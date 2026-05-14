import mongoose, { Document } from 'mongoose'

export interface IAction {
  type: 'HTTP_REQUEST' | 'DISCORD_WEBHOOK' | 'DELAY'
  config: Record<string, any>
}

export interface IWorkflow extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  trigger: {
    type: 'WEBHOOK'
    webhookPath: string
  }
  actions: IAction[]
  isActive: boolean
}

const workflowSchema = new mongoose.Schema<IWorkflow>({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     { type: String, required: true },
  trigger: {
    type:        { type: String, default: 'WEBHOOK' },
    webhookPath: { type: String, required: true, unique: true },
  },
  actions: { type: [], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model<IWorkflow>('Workflow', workflowSchema)