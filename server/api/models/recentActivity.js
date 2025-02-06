const mongoose = require("mongoose");

const recentActivitySchema = mongoose.Schema(
    {
        isbn: {
            type: "String",
            required: true,
        },
        username: {
            type: "String",
            required: true,
        },
        activityType: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("RecentActivity", recentActivitySchema);
