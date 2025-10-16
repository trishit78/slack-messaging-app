import { StatusCodes } from "http-status-codes";
import Workspace from "../schema/workspaceSchema.js";
import crudRepository from "./crudRepository.js";
import User from "../schema/user.js";
import channelRepository from "./channel.repository.js";

const workspaceRepository = {
  ...crudRepository(Workspace),
  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({ name: workspaceName });
    return workspace;
  },
  getWorkspaceById: async function (workspaceId) {
    const workspace = await Workspace.findById( workspaceId )
      .populate("members.memberId", "username email avatar")
      .populate("channels");
    return workspace;
  },
  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await Workspace.findOne({ joinCode });
    if (!workspace) {
      throw new Error({
        success: false,
        explanation: "Invalid join code sent by the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
  },
  addMemberToWorkspace: async function (workspaceId , memberId, role ) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new Error({
        success: false,
        explanation: "Invalid data sent from the client",
        message: "not workspace found",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const isValidUser = await User.findById(memberId);
    if (!isValidUser) {
      throw new Error({
        success: false,
        explanation: "Invalid data sent from the client",
        message: "Invalid user",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMemberPartofWorkspace = workspace.members.find(
      (member) => member.memberId === memberId
    );

    if (isMemberPartofWorkspace) {
      throw new Error({
        success: false,
        explanation: "Invalid data sent from the client",
        message: "User already part of workspace",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }
    workspace.members.push({
        memberId,role
    })
    await workspace.save();

    return workspace;
  },


  addChannelsToWorkspace:async function (workspaceId,channelName) {
    const workspace = await Workspace.findById(workspaceId);
    if(!workspace){
        throw new Error({
            success:false,
            explanation:'Invalid data sent from the client',
            message:'Invalid workspace id',
            statusCode:StatusCodes.NOT_FOUND
        })
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
        (channel)=> channel.name === channelName
    );
 if (isChannelAlreadyPartOfWorkspace) {
      throw new Error({
        success: false,
        explanation: "Invalid data sent from the client",
        message: "Channel already part of workspace",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const channel = await channelRepository.create({
        name:channelName,
        workspaceId:workspaceId
    });

    console.log("channel",channel);

    workspace.channels.push(channel);

    await workspace.save();

    return workspace;

  },
  fetchAllWorkspaceByMemberId: async function(memberId){
    const workspace = await Workspace.find({
        'members.memberId': memberId
    }).populate('member.memberId', 'username email avatar')
    return workspace;


  }

};

export default workspaceRepository;
