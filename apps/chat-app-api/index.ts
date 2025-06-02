import crypto from 'crypto';
import fs from 'fs';
import http from 'http';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response, Router, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer, { FileFilterCallback } from 'multer';
import { Server, Socket } from 'socket.io';

import Message, { IMessage } from './models/message';
import User, { IUser } from './models/user';

const app = express();
const router = Router();
const port = 4000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connection with better error handling
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://AfnanShawawreh:AfnanShawawreh@cluster0.j3m2mm2.mongodb.net/chatApp?' +
    'retryWrites=true' +
    '&w=majority' +
    '&appName=Cluster0';

// Set mongoose options
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false); // Disable command buffering

// Define MongoDB connection states
const DB_STATES = {
  DISCONNECTED: 0,
  CONNECTED: 1,
  CONNECTING: 2,
  DISCONNECTING: 3,
} as const;

type DBState = (typeof DB_STATES)[keyof typeof DB_STATES];

const DB_STATE_NAMES: Record<DBState, string> = {
  [DB_STATES.DISCONNECTED]: 'disconnected',
  [DB_STATES.CONNECTED]: 'connected',
  [DB_STATES.CONNECTING]: 'connecting',
  [DB_STATES.DISCONNECTING]: 'disconnecting',
};

// Define types for request handlers
type EmptyParams = Record<string, never>;
type EmptyQuery = Record<string, never>;

// Define JWT payload type
interface JWTPayload {
  userId: string;
  [key: string]: unknown;
}

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// Update the request handler type to be more specific
type TypedRequestHandler<
  P = EmptyParams,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = EmptyQuery,
> = RequestHandler<P, ResBody, ReqBody, ReqQuery>;

// Update Express types using module augmentation
declare module 'express' {
  interface Request {
    user?: JWTPayload;
  }
}

// Add more detailed connection event handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack,
    uri: MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'),
  });
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Connection state:', mongoose.connection.readyState);
  console.log('Connection URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'));
  connectWithRetry();
});

mongoose.connection.on('reconnected', () => {
  console.log(
    'MongoDB reconnected successfully. Connection state:',
    mongoose.connection.readyState,
  );
});

mongoose.connection.on('connecting', () => {
  console.log('MongoDB connecting... Connection state:', mongoose.connection.readyState);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully. Connection state:', mongoose.connection.readyState);
});

const connectWithRetry = async (retryCount = 0) => {
  const maxRetries = 2;
  const retryDelay = 1000; // 1 second

  try {
    console.log(`Attempting MongoDB connection (attempt ${retryCount + 1}/${maxRetries + 1})...`);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.error('MongoDB connection error:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
      attempt: retryCount + 1,
      maxRetries,
      uri: MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'),
    });

    if (retryCount < maxRetries) {
      const nextRetryDelay = retryDelay * Math.pow(2, retryCount);
      console.log(
        `Retrying MongoDB connection in ${nextRetryDelay / 1000} seconds... ` +
          `(Attempt ${retryCount + 1}/${maxRetries})`,
      );
      await new Promise(resolve => setTimeout(resolve, nextRetryDelay));
      return connectWithRetry(retryCount + 1);
    }

    console.error('Max retry attempts reached. Please check your MongoDB connection settings.');
    return false;
  }
};

// Create a single HTTP server instance
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap: UserSocketMap = {};

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }: SendMessageRequest) => {
    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', {
        senderId,
        message,
      });
    }
  });
});

// Initialize MongoDB connection before starting the server
const initializeServer = async () => {
  try {
    console.log('Initializing MongoDB connection...');
    const connected = await connectWithRetry();

    if (!connected) {
      throw new Error('Failed to connect to MongoDB after multiple attempts');
    }

    // Only start the server after successful MongoDB connection
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
      console.log('Socket.IO is running on the same port');
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

// Start the server
initializeServer().catch(error => {
  console.error('Server initialization failed:', error);
  process.exit(1);
});

interface LoginRequest {
  email: string;
  password: string;
}

interface SendRequestRequest {
  senderId: string;
  receiverId: string;
  message: string;
}

interface AcceptRequestRequest {
  userId: string;
  requestId: string;
}

interface SendMessageRequest {
  senderId: string;
  receiverId: string;
  message: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  image?: string;
}

interface MessagesQuery {
  senderId: string;
  receiverId: string;
}

interface UserSocketMap {
  [key: string]: string;
}

// Use a consistent secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Update the verifyToken middleware
const verifyToken: RequestHandler = (req: AuthenticatedRequest, res: Response, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const uploadDir = path.join(__dirname, 'uploads');
    console.log('Multer destination:', uploadDir);
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating uploads directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    console.log('Multer file info:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    console.log('Multer fileFilter:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
    });
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Extend Express Request type to include file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Update the register endpoint to handle file uploads
router.post('/register', upload.single('image'), (async (req: MulterRequest, res: Response) => {
  try {
    console.log('Register request received:', {
      body: req.body,
      file: req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
          }
        : undefined,
    });
    const { name, email, password } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newUser = new User({ name, email, password, image });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    res.status(200).json({ token, message: 'User registered successfully!' });
  } catch (error: any) {
    console.log('Error creating a user:', error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error registering the user' });
    }
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, RegisterRequest>);

router.post('/login', (async (req: Request<EmptyParams, unknown, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.log('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, LoginRequest>);

router.get('/users/:userId', (async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;
    // First get the current user to get their friends list
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all users except the current user and their friends
    const users = await User.find({
      _id: {
        $ne: userId,
        $nin: currentUser.friends, // Exclude users who are already friends
      },
    }).select('name email image');

    res.json(users);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}) as unknown as TypedRequestHandler<{ userId: string }, unknown>);

router.post('/sendrequest', (async (
  req: Request<EmptyParams, unknown, SendRequestRequest>,
  res: Response,
) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Create a new request with a generated _id
    const newRequest = {
      _id: new mongoose.Types.ObjectId(),
      from: new mongoose.Types.ObjectId(senderId),
      message,
      status: 'pending' as const,
    };

    receiver.requests.push(newRequest);
    await receiver.save();

    res.status(200).json({ message: 'Request sent successfully', requestId: newRequest._id });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error sending request' });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, SendRequestRequest>);

router.get('/getrequests/:userId', (async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('Fetching requests for user:', userId);

    const user = await User.findById(userId).populate('requests.from', 'name email image');
    console.log('Found user:', {
      exists: !!user,
      userId: user?._id,
      requestsCount: user?.requests?.length,
      requests: user?.requests?.map(req => ({
        id: req._id,
        from: req.from,
        status: req.status,
        message: req.message,
      })),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.requests);
  } catch (error) {
    console.log('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
}) as unknown as TypedRequestHandler<{ userId: string }, unknown>);

router.post('/acceptrequest', (async (
  req: Request<EmptyParams, unknown, AcceptRequestRequest>,
  res: Response,
) => {
  try {
    const { userId, requestId } = req.body;
    console.log('Accepting request:', { userId, requestId });

    // Find the user and the request
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the request in the user's requests array
    const requestIndex = user.requests.findIndex(
      req => req._id && req._id.toString() === requestId,
    );
    if (requestIndex === -1) {
      console.log('Request not found:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    const request = user.requests[requestIndex];
    // Get the friend's ID from the request's from field
    const friendId = request.from;
    console.log('Friend ID from request:', friendId);

    // First verify that the friend exists
    const friendUser = await User.findById(friendId);
    if (!friendUser) {
      console.log('Friend user not found:', friendId);
      return res.status(404).json({ message: 'Friend not found' });
    }

    console.log('Before update - User friends:', user.friends);
    console.log('Before update - Friend friends:', friendUser.friends);

    // Remove the specific request from the user's requests array
    user.requests.splice(requestIndex, 1);

    // Add friend to user's friends list if not already there
    if (!user.friends.some(id => id.toString() === friendId.toString())) {
      user.friends.push(friendId);
    }

    // Save the user changes
    await user.save();
    console.log('Updated user:', {
      userId: user._id,
      friendsCount: user.friends.length,
      requestsCount: user.requests.length,
    });

    // Remove any sent requests from friend to user
    friendUser.requests = friendUser.requests.filter(
      req => req.from.toString() !== userId.toString(),
    );

    // Add user to friend's friends list if not already there
    if (!friendUser.friends.some(id => id.toString() === userId.toString())) {
      friendUser.friends.push(new mongoose.Types.ObjectId(userId));
    }

    // Save the friend changes
    await friendUser.save();
    console.log('Updated friend:', {
      friendId: friendUser._id,
      friendsCount: friendUser.friends.length,
      requestsCount: friendUser.requests.length,
    });

    res.status(200).json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Error accepting request:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({
      message: 'Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, AcceptRequestRequest>);

router.get('/user/:userId', (async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('friends', 'name email image');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.friends);
  } catch (error) {
    console.log('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
}) as unknown as TypedRequestHandler<{ userId: string }, unknown>);

router.post('/sendMessage', (async (
  req: Request<EmptyParams, unknown, SendMessageRequest>,
  res: Response,
) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      message,
    });

    await newMessage.save();

    const receiverSocketId = userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, SendMessageRequest>);

router.get('/messages', (async (
  req: Request<EmptyParams, unknown, EmptyQuery, MessagesQuery>,
  res: Response,
) => {
  try {
    const { senderId, receiverId } = req.query as unknown as MessagesQuery;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate('senderId', '_id name');

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, EmptyQuery, MessagesQuery>);

// Update the /me endpoint to handle undefined user
router.get('/me', verifyToken, (async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.userId;
    // Populate friends with name, email, image
    const user = await User.findById(userId)
      .select('-password')
      .populate('friends', 'name email image');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
}) as TypedRequestHandler<EmptyParams, unknown>);

// Update the test endpoint to handle database status more safely
router.get('/test', async (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = DB_STATE_NAMES[dbState as DBState] || 'unknown';
    const isConnected = dbState === DB_STATES.CONNECTED;

    res.json({
      message: 'Server is running',
      database: {
        status: dbStatus,
        readyState: dbState,
        isConnected,
        uri: MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@'),
      },
      server: {
        port,
        socketPort: 3001,
        uptime: process.uptime(),
      },
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Add new interface for sent requests
interface SentRequestsQuery {
  userId: string;
}

// Add new endpoint to get sent requests
router.get('/sentrequests/:userId', (async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params;

    // Find all users who have received requests from this user
    const users = await User.find({
      'requests.from': new mongoose.Types.ObjectId(userId),
    }).select('name email image requests');

    // Transform the data to only include relevant request information
    const sentRequests = users
      .map(user => ({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        request: user.requests.find(req => req.from.toString() === userId),
      }))
      .filter(item => item.request); // Only include users where we found a matching request

    res.json(sentRequests);
  } catch (error) {
    console.log('Error fetching sent requests:', error);
    res.status(500).json({ message: 'Error fetching sent requests' });
  }
}) as unknown as TypedRequestHandler<{ userId: string }, unknown>);

// Add new interface for remove friend request
interface RemoveFriendRequest {
  userId: string;
  friendId: string;
}

// Add new endpoint to remove a friend
router.post('/removefriend', (async (
  req: Request<EmptyParams, unknown, RemoveFriendRequest>,
  res: Response,
) => {
  try {
    const { userId, friendId } = req.body;
    console.log('Removing friend:', { userId, friendId });

    // Remove friend from user's friends list
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true },
    );

    if (!updatedUser) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove user from friend's friends list
    const updatedFriend = await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true },
    );

    if (!updatedFriend) {
      console.log('Friend not found:', friendId);
      return res.status(404).json({ message: 'Friend not found' });
    }

    console.log('Friend removed successfully');
    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.log('Error removing friend:', error);
    res.status(500).json({ message: 'Error removing friend' });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, RemoveFriendRequest>);

// Add new interface for cancel request
interface CancelRequestRequest {
  userId: string;
  requestId: string;
}

// Add new endpoint to cancel a friend request
router.post('/cancelrequest', (async (
  req: Request<EmptyParams, unknown, CancelRequestRequest>,
  res: Response,
) => {
  try {
    const { userId, requestId } = req.body;
    console.log('Cancelling request:', { userId, requestId });

    // Find all users who might have received this request
    const users = await User.find({
      'requests.from': new mongoose.Types.ObjectId(userId),
    });

    let requestCancelled = false;

    // Try to find and remove the request from each user
    for (const user of users) {
      const requestIndex = user.requests.findIndex(
        req => req._id && req._id.toString() === requestId && req.from.toString() === userId,
      );

      if (requestIndex !== -1) {
        // Only allow cancelling pending requests
        if (user.requests[requestIndex].status !== 'pending') {
          return res.status(400).json({ message: 'Can only cancel pending requests' });
        }

        // Remove the request
        user.requests.splice(requestIndex, 1);
        await user.save();
        requestCancelled = true;
        break;
      }
    }

    if (!requestCancelled) {
      console.log('Request not found:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Request cancelled successfully');
    res.status(200).json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.log('Error cancelling request:', error);
    res.status(500).json({ message: 'Error cancelling request' });
  }
}) as unknown as TypedRequestHandler<EmptyParams, unknown, CancelRequestRequest>);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', router);
