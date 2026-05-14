import 'express-async-errors'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import authRoutes from './routes/authRoutes'
import workflowRoutes from './routes/workflowRoutes'
import executionRoutes from './routes/executionRoutes'
import webhookRoutes from './routes/webhookRoutes'
import errorMiddleware from './middleware/errorMiddleware'

const app = express()

app.use(cors({
  origin: [process.env.CLIENT_URL as string, 'http://localhost:5173']
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/workflows', workflowRoutes)
app.use('/api/executions', executionRoutes)
app.use('/webhook', webhookRoutes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})