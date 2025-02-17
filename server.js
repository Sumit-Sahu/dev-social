const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect database
connectDB();

//middleware
app.use(express.json({ extended:false }));

app.get('/',(req,res) => {
    res.send("server running");
});

//Define routers
app.use('/api/users',require('./routes/api/user'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));

PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`listening on server ${PORT}`));