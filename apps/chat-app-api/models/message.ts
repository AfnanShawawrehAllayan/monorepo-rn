import mongoose, { Document, Model } from 'mongoose';

interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  timeStamp: Date;
}

interface IMessageModel extends Model<IMessage> {}

const messageSchema = new mongoose.Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message: IMessageModel = mongoose.model<IMessage, IMessageModel>('Message', messageSchema);

export default Message;
export type { IMessage, IMessageModel };
