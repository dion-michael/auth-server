const mongoose = require('mongoose')

mongoose.connect(process.env.DB_FULLPATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('connection successful');
    }
})