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
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

//   function () {
//   const obj = this.toObject();
//   return delete obj.password && obj;
// }; Why not to use this ^: Метод toJSON видаляє поле password, використовуючи логічний вираз (delete obj.password && obj), що може повернути false, якщо delete obj.password поверне false. Це може призвести до того, що метод поверне false замість об'єкта. Метод завжди має повертати об'єкт без поля password.

userSchema.pre('save', function (next) {
  if (!this.username) this.username = this.email;
  next();
});

export const User = model('User', userSchema);
