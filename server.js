const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();

app.get('/',(req,res) => {
    res.send("server running");
});

port = process.env.port || 3000;

app.listen(port,() => console.log(`listening on server ${port}`));