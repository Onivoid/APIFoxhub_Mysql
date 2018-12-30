require('dotenv').config({
  path : 'config/.env'
})

const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');
const app = express();

const UsersRouter = require('./Users/Users.controller.js');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

db.connect((err) => {

    if (err){
      console.log(err)
    } else {

      app.use(morgan('dev'))
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      app.get('/', (req , res) => {
        res.send('LOL');
      });

      app.get('/users', (req, res) => UsersRouter.GetAll(db, req, res));
      app.get('/user', (req, res) => UsersRouter.GetOne(db, req, res));
      app.post('/user', (req, res) => UsersRouter.NewUser(db, req, res));
      app.put('/user', (req, res) => UsersRouter.UpdateUser(db, req, res));
      app.delete('/user', (req, res) => UsersRouter.RemoveUser(db, req, res));

    }

    app.listen(process.env.PORT, () => console.log('Started on port '+process.env.PORT))
})
