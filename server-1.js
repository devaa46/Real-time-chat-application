
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/chat-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({ username: String, password: String });
const MessageSchema = new mongoose.Schema({ username: String, message: String, timestamp: { type: Date, default: Date.now } });

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send({ message: 'User already exists' });
    const user = new User({ username, password });
    await user.save();
    res.send({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).send({ message: 'Invalid credentials' });
    res.send({ message: 'Login successful' });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    Message.find().then(messages => socket.emit('previousMessages', messages));

    socket.on('sendMessage', async (data) => {
        const msg = new Message(data);
        await msg.save();
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(5000, () => console.log('Server running on port 5000'));
