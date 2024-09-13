const express = require("express");
const app = express();
const cors = require('cors');
const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const getUserByIdRoute = require('./routes/userGetUserById');
const dbConnection = require('./config/db.config');
const editUser = require('./routes/userEditUser');
const deleteUser = require('./routes/userDeleteAll');
const skiResortsRoute = require('./routes/skiResorts'); 

require('dotenv').config();
const SERVER_PORT = 8081;

dbConnection();

// Middleware setup
app.use(cors({ origin: '*' }));
app.use(express.json());

// User-related routes
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);a

// Ski resorts route
app.use('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resorts', skiResortsRoute);

// Start server
app.listen(SERVER_PORT, () => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
