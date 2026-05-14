import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { AuthRequest } from '../types'

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
  const user = await User.findById(decoded.id).select('-password')
  if (!user) {
    res.status(401).json({ message: 'User not found' })
    return
  }

  req.user = user
  next()
}

export default authMiddleware