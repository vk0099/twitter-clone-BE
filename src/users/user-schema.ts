import { Schema, model } from "mongoose";

const schema = new Schema({
    name: String,
    email: { type: String, required: [ true, "required email id" ] },
    password : { type: String, required: [ true, "required password" ] },
    token : String,
    is_active : { type: Boolean, default: true }
}, { timestamps: true });

export const userSchema = model("user", schema);