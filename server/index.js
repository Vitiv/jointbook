const express = require('express');
const indexRouter = require('./routes');
const http = require('http');
const config = require('config');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.set("view engine", "ejs");

app.use('/', indexRouter);
app.set('port', config.get('port'));

const server = http.createServer(app);
server.listen(config.get('port'));

module.exports = app; // для тестирования
