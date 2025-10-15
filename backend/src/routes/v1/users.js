import express from 'express';

const router = express.Router();

router.get('/',(req,res)=>{
    res.send('routes for `/get-> users ` ')
})

export default router;