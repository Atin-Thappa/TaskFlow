import { Queue } from 'bullmq'
import redis from '../config/redis'

const workflowQueue = new Queue('workflow-execution', {
  connection: redis,
})

export default workflowQueue