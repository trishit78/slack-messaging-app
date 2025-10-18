import { Worker } from 'bullmq';
import mailer from '../config/mailConfig.js';
import redisConfig from '../config/redisConfig.js';

new Worker('mailQueue',async(job)=>{
    const emailData = job.data;
    console.log('Processing email',emailData);
    try {
        const response = await mailer.sendMail(emailData);
        console.log('Email sent',response);
    } catch (error) {
        console.log('Error processing email',error);

    }
},{connection:redisConfig});