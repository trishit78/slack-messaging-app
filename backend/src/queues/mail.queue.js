import {Queue} from 'bullmq';

import { REDIS_HOST, REDIS_PORT } from '../config/serverConfig.js';


export default new Queue('mailQueue',{
    redis:{
        host:REDIS_HOST,
        port:REDIS_PORT
    }
});
