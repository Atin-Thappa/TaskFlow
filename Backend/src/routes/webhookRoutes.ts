import { Router, Request, Response } from 'express'
import Workflow from '../models/Workflow'
import Execution from '../models/Execution'
import workflowQueue from '../queue/workflowQueue'

const router = Router()

router.post('/:webhookPath', async (req: Request, res: Response) => {
  const workflow = await Workflow.findOne({
    'trigger.webhookPath': req.params.webhookPath,
    isActive: true,
  })

  if (!workflow) {
    res.status(404).json({ message: 'Workflow not found or inactive' })
    return
  }

  const execution = await Execution.create({ workflowId: workflow._id })

  await workflowQueue.add('execute', {
    workflowId: workflow._id.toString(),
    executionId: execution._id.toString(),
    actions: workflow.actions,
    payload: req.body,
  })

  res.status(202).json({ message: 'Workflow triggered', executionId: execution._id })
})

export default router