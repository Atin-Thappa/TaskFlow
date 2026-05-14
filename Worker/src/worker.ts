import 'dotenv/config'
import { Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { executeDelay } from './executors/delayExecutor'
import { executeDiscord } from './executors/discordExecutor'
import { executeHttp } from './executors/httpExecutor'
import mongoose from 'mongoose'
import Execution from './models/Execution'

const redis = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null
})

interface ActionJob {
  workflowId: string
  executionId: string
  actions: Array<{ type: string; config: Record<string, any> }>
  payload: Record<string, any>
}

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI as string)
  console.log('[Worker] MongoDB connected')

  const worker = new Worker(
    'workflow-execution',
    async (job: Job<ActionJob>) => {
      const { actions, executionId } = job.data
      const logs: string[] = []
      const outputs: string[] = []

      console.log(`[Worker] Starting execution ${executionId}`)

      try {
        for (const action of actions) {
          console.log(`[Worker] Executing action: ${action.type}`)

          let result = ''

          if (action.type === 'DELAY') {
            result = await executeDelay(action.config)
          } else if (action.type === 'DISCORD_WEBHOOK') {
            result = await executeDiscord(action.config)
          } else if (action.type === 'HTTP_REQUEST') {
            result = await executeHttp(action.config)
          } else {
            result = `Unknown action type: ${action.type}`
          }

          logs.push(`[${action.type}] ${result}`)
          outputs.push(result)
          console.log(`[Worker] ${result}`)
        }

        await Execution.findByIdAndUpdate(
          executionId,
          { status: 'success', completedAt: new Date(), logs, outputs },
          { returnDocument: 'after' }
        )

        console.log(`[Worker] Execution ${executionId} complete`)
        return { logs, outputs }

      } catch (err: any) {
        await Execution.findByIdAndUpdate(executionId, {
          status: 'failed',
          completedAt: new Date(),
          logs: [`Error: ${err.message}`],
          outputs: [],
        })
        throw err
      }
    },
    { connection: redis }
  )

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message)
  })

  console.log('[Worker] Listening for jobs...')
}

start()