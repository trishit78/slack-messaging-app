import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObjects.js";
import { signInService, signUpService } from "../services/user.service.js";

export const signUp = async (req,res) => {
        try {

            const user  = await signUpService(req.body);
            return res.status(StatusCodes.CREATED).json(successResponse(user,'User created successfully'));
        } catch (error) {
            console.log('User controller error', error);
            // if(error.statusCode){
            //     return res.status(error.statusCode).json(customErrorResponse(error));
            // }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:error.message
            })
        }
}


export const signIn = async(req,res)=>{
    try {
        const response =  await signInService(req.body);
        return res.status(StatusCodes.OK).json({
            success:true,
            message:'User signed in successfully',
            data:response
        })
    } catch (error) {
        console.log('User controller error',error);
        if(error.StatusCode){
            return res.status(error.StatusCode).json(customErrorResponse(error));
        }    
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
    }


}