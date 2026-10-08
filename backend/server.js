import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';

const app =express();
const PORT =process.env.PORT || 3000 ;

// Db connection
await connectDB()

app.use(express.json());
app.use(cors());

app.get('/' , (req,res) =>
res.send("server is Live..") )


app.listen(PORT ,() =>{
  console.log(`${PORT} port running `)
})