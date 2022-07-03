import express from 'express';
import dotenv from 'dotenv';
import conn from './db.js';

dotenv.config();

//connect to the database
conn();

const app = express();
const port = process.env.PORT;

//template engine
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
});
