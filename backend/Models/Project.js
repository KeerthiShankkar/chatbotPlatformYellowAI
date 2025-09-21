import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name:{type:String ,required:true},
    description:{type:String,required:true},
    ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    prompts:[{
        role: { type: String, enum: ["user", "assistant"], required: true },
        content:String
    },],

},{timestamps:true})

export default mongoose.model("Project",ProjectSchema);