import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import methodOverride from 'method-override';
import conn from './db.js';
import pageRoute from './routes/pageRoute.js';
import photoRoute from './routes/photoRoute.js';
import userRoute from './routes/userRoute.js';
import { checkUser } from './middlewares/authMiddleware.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//connect to the database
conn();

const app = express();
const port = process.env.PORT;

//template engine
app.set('view engine', 'ejs');

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(fileUpload({ useTempFiles: true }));

// override with POST having ?_method=DELETE
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

//routes
app.use('*', checkUser);
app.use('/', pageRoute);
app.use('/photos', photoRoute);
app.use('/users', userRoute);

app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
});
