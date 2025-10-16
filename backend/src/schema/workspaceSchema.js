

const workspaceSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:[true,'Workspace name is required'],
        unique:true
    },
    description:{
        type:String
    },
    members:[
        {
            memberId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            role:{
                type:String,
                enum:['admin','member'],
                default:'member'
            }
        }
    ],
    joinCode:{
        type:String,
        required:[true,'Join code is required']
    },
    channels:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Channel'
        }
    ]
});


const Workspace = mongoose.model('Wrokspace', workspaceSchema);


export default Workspace;