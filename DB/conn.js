const mongoose = require("mongoose");
const DB = "mongodb://0.0.0.0:27017/sampleDB";

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connection success !!....")
}).catch(console.error());

