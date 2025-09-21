import mongoose, { Schema, models, model } from "mongoose";

const RegistrationSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  phone:     { type: String, required: true },
}, { timestamps: true });

export default models.Registration || model("Registration", RegistrationSchema);
