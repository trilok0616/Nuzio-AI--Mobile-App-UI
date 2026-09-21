const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleSub: { type: String, index: true, sparse: true },

    language: { type: String, enum: ["en", "hi"], default: "en" },
    locationPermission: { type: Boolean, default: false },
    location: {
      city: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "" },
      latitude: { type: Number },
      longitude: { type: Number }
    },

    profession: { type: String, trim: true, default: "" },
    interests: [{ type: String, trim: true }],
    voicePreference: {
      type: String,
      enum: ["aria", "kai", "meera"],
      default: "aria"
    },

    notifications: {
      breakingNews: { type: Boolean, default: true },
      dailyBrief: { type: Boolean, default: true },
      productUpdates: { type: Boolean, default: false }
    },

    onboardingCompleted: { type: Boolean, default: false },

    subscription: {
      plan: { type: String, enum: ["free", "plus"], default: "free" },
      status: {
        type: String,
        enum: ["inactive", "active", "trialing", "past_due", "canceled"],
        default: "inactive"
      },
      provider: { type: String, default: "" },
      providerCustomerId: { type: String, default: "" },
      providerSubscriptionId: { type: String, default: "" },
      currentPeriodEnd: { type: Date }
    }
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
