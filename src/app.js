const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'user.html'));
});


app.use('/api', authRoutes);
app.use('/api', userRoutes);

module.exports = app;
