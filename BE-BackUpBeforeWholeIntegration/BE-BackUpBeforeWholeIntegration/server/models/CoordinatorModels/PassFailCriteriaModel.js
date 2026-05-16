const mongoose = require("mongoose");

const PassFailCriteriaSchema = new mongoose.Schema({
    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FYPTerm",
        required: true,
    },
    passingCriteria: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure one criteria per term
PassFailCriteriaSchema.index({ term: 1 }, { unique: true });

const PassFailCriteria = mongoose.model("PassFailCriteria", PassFailCriteriaSchema);

module.exports = PassFailCriteria;
