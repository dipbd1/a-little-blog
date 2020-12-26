require('dotenv').config();
const express = require('express');
var cors = require('cors');
require('./db/db.js');

const userRouter = require('./router/user');
const postRouter = require('./router/post');

const app = express();
app.use(cors());

app.use(express.json());
app.use(userRouter);
// app.use(postRouter);

const port = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
	console.log('Server runing on: ' + port);
});
