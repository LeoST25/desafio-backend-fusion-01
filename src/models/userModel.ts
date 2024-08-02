import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  affiliation: string;
}

 const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  affiliation: { type: [String], default: []},
});

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();

});


export const User = mongoose.model<IUser>('User', UserSchema);
