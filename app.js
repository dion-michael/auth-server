require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ErrorHandler } = require('./middlewares/ErrorHandler');
const routes = require('./routes');

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

/*
    ROUTES
    - HEALTHCHECK: '/'
    - GET USERS: '/users'
    - REGISTER: '/register'
    - LOGIN: '/login'
*/

require('./configs/db');

app.use('/', routes);

app.use(ErrorHandler);

app.listen(port, () => {
    console.info(`listening on port ${port}`)
});