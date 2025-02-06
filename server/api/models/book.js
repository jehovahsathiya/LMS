const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        isbn: { type: String, required: true },
        pageCount: { type: String, required: true },
        publishedDate: { type: String, required: true },
        longDescription: { type: String, required: true },
        shortDescription: { type: String, required: true },
        status: { type: String, required: true },
        authors: [],
        genre: [],
        ItemCount: { type: String, required: true },
    },
    { timestamps: true }
);

bookSchema.index({ Title: 'text', 'Author': 'text', 'Category': 'text' });
module.exports = mongoose.model("book", bookSchema);
