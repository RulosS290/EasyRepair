const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supportTickets = require('./routes/supportTicketRoutes');
const supportMessages = require('./routes/supportMessageRoutes');
const chatMessages = require('./routes/chatRoutes');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173/'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
};

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
});
app.get('/appointments', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'appointments.html'));
});
app.get('/user/schedule', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'schedule.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

app.get('/user/supportTickets', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'supportTickets.html'));
});

app.get('/user/supportTickets/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'supportChat.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'payment.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', adminRoutes);
app.use('/api', paymentRoutes);
app.use('/api', supportTickets);
app.use('/api', supportMessages);
app.use('/api', chatMessages);


module.exports = app;
