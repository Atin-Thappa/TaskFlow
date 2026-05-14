import mongoose, { Document, CallbackWithoutResultAndOptionalError } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

userSchema.pre<IUser>('save', async function(next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model<IUser>('User', userSchema)