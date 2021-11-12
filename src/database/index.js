const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/noderest');
mongoose.connect('mongodb+srv://root:root@cluster0.nbiem.mongodb.net/noderest');
mongoose.Promise = global.Promise;

module.exports = mongoose;