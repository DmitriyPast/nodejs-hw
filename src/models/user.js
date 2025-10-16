import { model, Schema } from 'mongoose';

export const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Перевизначаємо метод toJSON
userSchema.methods.toJSON = f1;
function f() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

function f1() {
  return delete this.toObject().password;
}

export const User = model('User', userSchema);
