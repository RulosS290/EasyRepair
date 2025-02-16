const express = require('express');
const loginRoutes = require('./routes/loginRoutes'); 
const controllers = require('./controllers/controllersUsers'); 
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const appointmentRoutes = require('./routes/appointmentRoutes');
const app = express();
const PORT = 5555;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(loginRoutes);
app.use(appointmentRoutes);
app.get("/endpoint", controllers.endpointHandler);
app.get("/forzar-error", controllers.forzarError);

// Error handling middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});