import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: String, required: true },
    location: { type: String, required: true },
    availableFromDate: { type: Date, required: true },
    propertyType: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", PropertySchema);
