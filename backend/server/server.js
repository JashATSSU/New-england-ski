const express = require('express');
const app = express();
const cors = require('cors');
const loginRoute = require('./routes/userLogin');
const getAllUsersRoute = require('./routes/userGetAllUsers');
const registerRoute = require('./routes/userSignUp');
const getUserByIdRoute = require('./routes/userGetUserById');
const dbConnection = require('./config/db.config');
const editUser = require('./routes/userEditUser');
const deleteUser = require('./routes/userDeleteAll');

require('dotenv').config();
const { fetchResorts } = require('./utilities/api'); // Import fetchResorts function
const SERVER_PORT = 8081;

dbConnection();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);

// Add the route for fetching ski resorts
app.get('/api/resorts', async (req, res) => {
  try {
    const resorts = await fetchResorts();
    res.json(resorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resorts' });
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
});
