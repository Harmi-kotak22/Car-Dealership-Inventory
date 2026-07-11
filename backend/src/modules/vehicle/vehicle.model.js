import { Schema, model as _model } from "mongoose";
import VEHICLE_CATEGORIES from "../../shared/constants/vehicleCategories";

const vehicleSchema = new Schema(
    {
        make: {
            type: String,
            required: [true, "Vehicle make is required"],
            trim: true
        },

        model: {
            type: String,
            required: [true, "Vehicle model is required"],
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: Object.values(VEHICLE_CATEGORIES)
        },

        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"]
        },

        quantity: {
            type: Number,
            required: true,
            min: [0, "Quantity cannot be negative"]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

vehicleSchema.index({ make: 1 });
vehicleSchema.index({ model: 1 });
vehicleSchema.index({ category: 1 });

vehicleSchema.index({
    make: 1,
    model: 1
});

const Vehicle = _model("Vehicle", vehicleSchema);

export default Vehicle;