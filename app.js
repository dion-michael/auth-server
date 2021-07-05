require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const {handleError} = require('./helpers/errorHandler')
const app = express()
const cors = require('cors')
const port = 3000
const {DB_PATH, DB_NAME, DB_FULLPATH} = process.env;

mongoose.connect(`${DB_FULLPATH}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connection successful');
    }
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/', require('./routes'))

app.use(handleError)
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})