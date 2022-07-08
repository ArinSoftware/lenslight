import express from 'express';
import dotenv from 'dotenv';
import conn from './db.js';
import pageRoute from './routes/pageRoute.js';
import photoRoute from './routes/photoRoute.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

//connect to the database
conn();

const app = express();
const port = process.env.PORT;

//template engine
app.set('view engine', 'ejs');

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//routes
app.use('/', pageRoute);
app.use('/photos', photoRoute);
app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
});
