import mongoose from 'mongoose';

const conn = () => {
  mongoose
    .connect(process.env.DB_URI, {
      dbName: 'lenslight',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to the DB Succesfully');
    })
    .catch((err) => {
      console.log(`Something happened! : ${err}`);
      process.exit(1);
    });
};

export default conn;
