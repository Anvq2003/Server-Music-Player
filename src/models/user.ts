import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import slugify from 'slugify';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  {
    toJSON: { virtuals: true }, // Include virtuals when document is converted to object
    toObject: { virtuals: true }, // Include virtuals when object is converted to JSON
    timestamps: true,
  },
);

UserSchema.pre<IUser>('save', function (next) {
  const user = this as IUser;
  if(!user.isModified('name')) return next();
  const slug = slugify(user.name, { lower: true });
  user.slug = slug;

  return next();
});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseDelete, { overrideMethods: true });


export default mongoose.model<IUser>('User', UserSchema);