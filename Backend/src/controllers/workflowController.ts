import { Response } from 'express'
import { nanoid } from 'nanoid'
import Workflow from '../models/Workflow'
import { AuthRequest } from '../types'

export const getWorkflows = async (req: AuthRequest, res: Response) => {
  const workflows = await Workflow.find({ userId: req.user!._id }).sort({ createdAt: -1 })
  res.json(workflows)
}

export const createWorkflow = async (req: AuthRequest, res: Response) => {
  const { name } = req.body
  const workflow = await Workflow.create({
    userId: req.user!._id,
    name,
    trigger: { type: 'WEBHOOK', webhookPath: nanoid(10) },
    actions: [],
  })
  res.status(201).json(workflow)
}

export const updateWorkflow = async (req: AuthRequest, res: Response) => {
  const workflow = await Workflow.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    req.body,
    { new: true }
  )
  if (!workflow) { res.status(404).json({ message: 'Workflow not found' }); return }
  res.json(workflow)
}

export const deleteWorkflow = async (req: AuthRequest, res: Response) => {
  const workflow = await Workflow.findOneAndDelete({ _id: req.params.id, userId: req.user!._id })
  if (!workflow) { res.status(404).json({ message: 'Workflow not found' }); return }
  res.json({ message: 'Deleted' })
}

export const getWorkflowById = async (req: AuthRequest, res: Response) => {
  const workflow = await Workflow.findOne({ _id: req.params.id, userId: req.user!._id })
  if (!workflow) { res.status(404).json({ message: 'Not found' }); return }
  res.json(workflow)
}