const bookSchema = require("../api/models/book");
const testData = [
    {
        BibNum: 123456,
        title: "To Kill a Mockingbird",
        shortDescription: "A novel about racial injustice in the Deep South.",
        longDescription: "This Pulitzer Prize-winning novel tells the story of a young girl growing up in the racially charged Depression-era South.",
        publishedDate: new Date("1960-07-11"),
        pageCount: 281,
        isbn: "9780061120084",
        status: "Available",
        ItemCount: 10,
        Author: "Harper Lee",
        Publisher: "J.B. Lippincott & Co.",
        Genre: "Fiction"
    },
    {
        BibNum: 789012,
        title: "1984",
        shortDescription: "A dystopian novel about totalitarianism.",
        longDescription: "George Orwell's seminal work explores a world of perpetual war, surveillance, and propaganda.",
        publishedDate: new Date("1949-06-08"),
        pageCount: 328,
        isbn: "9780451524935",
        status: "Checked Out",
        ItemCount: 15,
        Author: "George Orwell",
        Publisher: "Secker & Warburg",
        Genre: "Dystopian"
    }
];




