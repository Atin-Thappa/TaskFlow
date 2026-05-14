import { Request, Response, NextFunction } from 'express'

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal server error' })
}

export default errorMiddleware