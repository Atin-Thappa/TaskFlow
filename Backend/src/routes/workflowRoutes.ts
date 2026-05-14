import { Router } from 'express'
import { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow, getWorkflowById } from '../controllers/workflowController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()
router.use(authMiddleware)
router.get('/', getWorkflows)
router.get('/:id', getWorkflowById)
router.post('/', createWorkflow)
router.put('/:id', updateWorkflow)
router.delete('/:id', deleteWorkflow)
export default router