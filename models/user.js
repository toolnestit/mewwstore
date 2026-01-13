import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["customer", "admin", "manager"],
      default: "customer",
    },
    access: [
      {
        slug: String,
        expireAt: Date,
      },
    ],
    ownedPlans: [
      {
        slug: String,
        expireAt: Date,
      },
    ],
    ipAddresses: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
