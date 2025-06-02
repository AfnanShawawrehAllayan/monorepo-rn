import mongoose, { Document, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  requests: Array<{
    _id: mongoose.Types.ObjectId;
    from: mongoose.Types.ObjectId;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  friends: mongoose.Types.ObjectId[];
}

interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  requests: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
export type { IUser, IUserModel };
