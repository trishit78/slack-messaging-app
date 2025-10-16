import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository.js"
import ClientError from "../utils/errors/clientError.js";
import ValidationError from "../utils/errors/validationError.js";
import bcrypt from 'bcrypt';
import { createJWT } from "../utils/common/authUtils.js";
export const signUpService = async (data)=>{
    try {
    const newUser = await userRepository.create(data);
    return newUser;
    } catch (error) {
        console.log('User service error',error);
        if(error.name === 'ValidationError'){
            throw new ValidationError(
                {
                    error:error.errors
                },
                error.message
            );
        }
        if(error.name === 'MongoServerError' && error.code === 11000){
            throw new ValidationError({
                error:['A user with same name or email existts']
            },
            'A user with same name or email exists'
        );
        }
        throw error;
    }
    
}

export const signInService = async(data)=>{
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new ClientError({
                explanation:'Invalid data sent from the client',
                message:'No registered user found with this email',
                statusCode:StatusCodes.NOT_FOUND
            });
        }
        //match the password with hashedpassword

        const isMatch = bcrypt.compareSync(data.password,user.password);
        if(!isMatch){
            throw new ClientError({
                explanation:'Invalid data sent from the client',
                message:'Invalid password,please try again',
                statusCode:StatusCodes.BAD_REQUEST
            })
        }

        return {
            username:user.username,
            avatar:user.avatar,
            email:user.email,
            token: createJWT({id:user._id, email:user.email})
        };


    } catch (error) {
        console.log('User service error',error);
        throw error;
    }
}