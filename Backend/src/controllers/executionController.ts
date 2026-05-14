import { Response } from 'express'
import Execution from '../models/Execution'
import { AuthRequest } from '../types'

export const getExecutions = async (req: AuthRequest, res: Response) => {
  const executions = await Execution.find({ workflowId: req.params.workflowId }).sort({ startedAt: -1 }).limit(50)
  res.json(executions)
}