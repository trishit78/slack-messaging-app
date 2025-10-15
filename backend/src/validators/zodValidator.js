import { StatusCodes } from "http-status-codes";

export const validate = (schema)=>{
    return async(req,res,next)=>{
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            console.log('Validation error in zod validator',error);
            
            res.status(StatusCodes.BAD_REQUEST).json({
                success:false,
                message:'Validation error',
                explanation:'validation error in zod validator',
                data:error
            })
        }
    }
}