import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if (exists) {
    res.status(400).json({ message: 'Email already in use' })
    return
  }
  const user = await User.create({ name, email, password })
  const token = signToken(user._id.toString())
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }
  const token = signToken(user._id.toString())
  res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } })
}