require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cron = require('node-cron');
const app = express();

// Configuración inicial
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// Base de datos
const db = require('./models/database');

// Autenticación
require('./routes/auth')(app, passport);

// Rutas
app.use('/api/citas', require('./routes/citas'));
app.use('/api/payments', require('./routes/payments'));

// Tareas programadas (Recordatorios SMS/Email)
cron.schedule('0 9 * * *', () => {
  require('./models/sendNotifications').enviarRecordatorios();
});

app.listen(3000, () => console.log('Servidor iniciado en puerto 3000'));