import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    address_line: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zipcode: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: Number,
      default: null,
    },
    status: {
        type: Boolean,
        default: true 
    }
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model('Address', addressSchema)

export default AddressModel;
