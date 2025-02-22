const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const supportTickets = require('./routes/supportTicketRoutes');
const supportMessages = require('./routes/supportMessageRoutes');

const app = express();

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

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', adminRoutes);
app.use('/', paymentRoutes);
app.use('/api', supportTickets);
app.use('/api', supportMessages);


module.exports = app;
