const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const Message = require('./models/message'); // Ensure this is correctly imported

const app = express();

// Use CORS with default settings
app.use(cors({
     origin:'*',
     methods:'*',
     allowedHeaders:'*',
     exposedHeaders:'*'
}));  
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());

app.get('/', ((req, res) =>{
    res.json("Hello World")
}))
// Connect to MongoDB
const dbConnection = async () => {
  const url = 'mongodb+srv://express:express@cluster0.lb5dmif.mongodb.net/messanger?retryWrites=true&w=majority&appName=Cluster0';
  try {
    await mongoose.connect(url);
    console.log('DB is connected');
  } catch (err) {
    console.log(err);
  }
};

// Socket.io setup
// In your WebSocket setup on the server
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('sendMessage', async (data) => {
      console.log('Message received on server:', data);
      // Avoid duplicate save
      const existingMessage = await Message.findOne({ sender: data.sender, receiver: data.receiver, message: data.message });
      if (!existingMessage) {
        const message = new Message(data);
        await message.save();
        io.emit('message', data); // Broadcast to all connected clients
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
  

// Use chat routes
app.use('/api/messages', chatRoutes);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

dbConnection();
