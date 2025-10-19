import express from 'express';
import { PORT } from './config/serverConfig.js';
import {StatusCodes} from 'http-status-codes'
import connectDB from './config/dbConfig.js';
import apiRouter from '../src/routes/apiRoutes.js'
//import mailer from '../src/config/mailConfig.js'
import './processors/mailProcessor.js'

import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import {ExpressAdapter} from '@bull-board/express';
import mailQueue from './queues/mail.queue.js';
import testQueue from './queues/test.queue.js';

import {Server} from 'socket.io';
import {createServer} from 'http';
import messageHandlers from './controllers/message.SocketController.js';


const app = express();
const server = createServer(app);
const io = new Server(server);



const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/ui');
createBullBoard({
    queues:[new BullMQAdapter(mailQueue),new BullMQAdapter(testQueue)],
    serverAdapter:bullServerAdapter
})


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/ui',bullServerAdapter.getRouter());
app.use('/api',apiRouter);


app.get('/ping',(req,res)=>{
    return res.status(StatusCodes.OK).json({message:'pong'});
});

io.on('connection',(socket)=>{
    // console.log('new socket connection ', socket.id);

    // socket.on('messageFromClient',(data)=>{
    //     console.log('Message from client',data);
    //     io.emit('new message',data.toUpperCase());  //broadcasting message
    // }); 
    messageHandlers(io,socket);   
});

server.listen(PORT, async()=>{
    console.log(`server is running on ${PORT}`);
    connectDB();
    // const mailResponse = await mailer.sendMail({
    // from:'trishit456@gmail.com',
    // to:'trishit456@gmail.com',
    // subject:'hello',
    // text:'hellojs'      
    // });
    // console.log(mailResponse);
})