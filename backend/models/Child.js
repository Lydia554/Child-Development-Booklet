const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  developmentStage: String, 
  milestones: [{
    ageInMonths: { type: Number, required: true },
    physical: String,
    emotional: String,
    intellectual: String,
    social: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model("Child", childSchema);
