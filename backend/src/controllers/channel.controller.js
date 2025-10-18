import { StatusCodes } from "http-status-codes";
import { getChannelByIdService } from "../services/channel.service.js";

export const getChannelByIdController = async(req,res)=>{
    try {
        const response  = await getChannelByIdService(req.params.channelId,req.user);
        return res.status(StatusCodes.OK).json({
            success:true,
            message:"Channel fetched successfully",
            data:response
        })
    } catch (error) {
        console.log('get channel by id controller error',error);
        if(error.statusCode){
            return res.status(error.statusCode).json({
                success:false,
                message:'Error occured int '
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:'Internal server error',
            data:error
        })
    }
}