import express from 'express';
import { PORT } from './config/serverConfig.js';
import {StatusCodes} from 'http-status-codes'
import connectDB from './config/dbConfig.js';
import apiRouter from '../src/routes/apiRoutes.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',apiRouter);


app.get('/ping',(req,res)=>{
    return res.status(StatusCodes.OK).json({message:'pong'});
});


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    connectDB();
})