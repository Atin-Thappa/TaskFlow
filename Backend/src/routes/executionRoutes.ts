import { Router } from 'express'
import { getExecutions } from '../controllers/executionController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()
router.use(authMiddleware)
router.get('/:workflowId', getExecutions)
export default router