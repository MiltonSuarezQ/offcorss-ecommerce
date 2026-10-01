import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    userType: { type: String, required: true, enum: ['ADMIN', 'USER'], default: 'USER' },
  },
  { versionKey: false }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: unknown };
export const User = model('User', userSchema);
