const { sendNewBookEmail, sendReturnBookEmailToAdmin, sendReturnBookEmail } = require("../../utils/email");
const bookSchema = require("../models/book");
const userSchema = require("../models/user");



exports.addBook = async (req, res) => {
    try {
        const { title, isbn, pageCount, publishedDate, longDescription, shortDescription, status, authors, ItemCount } = req.body;
        const image = req.file ? req.file.path : null; // Store image path

        const newBook = new bookSchema({
            title,
            isbn,
            pageCount,
            publishedDate,
            longDescription,
            shortDescription,
            status,
            authors,
            ItemCount,
            image: image,
        });
        await newBook.save();

        // sendNewBookEmail(userEmail, newBook); // Send email to user

        const users = await userSchema.find({ userType: "user" });
        users.forEach(async (user) => {
           await sendNewBookEmail(user.username, newBook);
        });
        console.log(users);

        res.status(201).json({ message: "Book created successfully", newBook });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
   
};



exports.getAllBooks = async (req, res) => {
    try {
        const books = await bookSchema.find();
        return res.status(200).json({ books });
    } catch (error) {
        throw error;
    }
};

exports.searchBooks = async (req, res) => {
    try {
        const searchText = req.params.id;
        if (searchText == "-") {
            const books = await bookSchema.find();
            return res.status(200).json({ books });
        }
        const regex = new RegExp(searchText, 'i'); // 'i' flag for case-insensitive search
        const books = await bookSchema.find({ Title: { $regex: regex } }).limit(4);
        res.status(200).json({ books });
    } catch (error) {
        throw error;
    }
};


exports.addToCart = async (req, res) => {
    try {
        const { username } = req.body;
        console.log(username);
        console.log(username);
        
        const books = req.body.books;
        console.log(books);
        
        if (!books || !Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ msg: "Invalid books array" });
        }   

        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        for (let i = 0; i < books.length; i++) {
            const ISBN = books[i].isbn;
            const book = await bookSchema.findOne({ isbn:ISBN });

            if (!book) {
                return res.status(400).json({ msg: `Book with ISBN ${ISBN} not found` });
            }

            console.log(book);
            

            if (book.ItemCount > 0) {
                // Decrease item count of the book
                // book.ItemCount -= 1;
                // await book.save();

                // Add ISBN to user's cart
                // user.cart.push(ISBN);
                user.cart.push({
                    isbn: book.isbn
                });
            } else {
                return res.status(400).json({ msg: `Book with ISBN ${ISBN} is out of stock` });
            }
        }

        await user.save();

        return res.status(200).json({ msg: "Books added to cart successfully" });
    } catch (error) {
        throw error;
    }
};




exports.checkout = async (req, res) => {
    try {
        const { username } = req.body;
        console.log(username);
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const booksInCart = user.cart;
        const borrowedBooks = [];

        for (let i = 0; i < booksInCart.length; i++) {
            const isbn = booksInCart[i].isbn;
            const book = await bookSchema.findOne({ isbn: isbn });

            if (!book) {
                return res.status(400).json({ msg: `Book with ISBN ${isbn} not found` });
            }

            if (book.ItemCount > 0) {
                // Decrease item count of the book
                book.ItemCount -= 1;
                await book.save();

                // Add book to borrowed array
                borrowedBooks.push({
                    isbn: book.isbn,
                    takenDate: new Date(),
                    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // Adds 15 days
                });
                
            } else {
                return res.status(400).json({ msg: `Book with ISBN ${isbn} is out of stock` });
            }
        }

        // Empty the user's cart and update the borrowed books
        user.cart = [];
        user.borrowed = [...user.borrowed, ...borrowedBooks];
        await user.save();

        return res.status(200).json({ msg: "Checkout successful" });
    } catch (error) {
        throw error;
    }

};

exports.returnBooks = async (req, res) => {
    try {
        const { uniqueId, isbn } = req.body;

        // Find the user
        const user = await userSchema.findOne({ uniqueId });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Find the books with the provided ISBNs
        const books = await bookSchema.find({ isbn: { $in: isbn } });

        if (books.length === 0) {
            return res.status(404).json({ msg: 'No books found with the provided ISBN' });
        }

        // Remove the books from the user's borrowed array
        user.borrowed = user.borrowed.filter(book => !isbn.includes(book.isbn));

        // Increase the itemCount of the returned books
        for (const book of books) {
            book.ItemCount = 1;
            await book.save();
        }

        // Save the updated user
        await user.save();

     const   users = await userSchema.find({ userType: "admin" });
        users.forEach(async (user) => {
            await sendReturnBookEmailToAdmin(user.username,user,books[0]);
        }
        );


        sendReturnBookEmail(user.username, books[0]); // Send email to user

        return res.status(200).json({ msg: 'Books returned successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}


exports.removeFromCart = async (req, res) => {
    try {
        const { username, isbn } = req.body;

        // Find the user
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Remove the book from the user's cart
        user.cart = user.cart.filter((book) => book.isbn !== isbn);

        // Save the updated user
        await user.save();

        return res.status(200).json({ msg: 'Book removed from cart successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};

exports.filter = async (req, res) => {
    try {
        const genre = req.params.genre;
        const year = req.params.year;
        const title = req.params.title;

        const query = {};

        // Apply genre filter
        if (genre !== 'all') {
            query.genre = genre;
        }

        // Apply year filter
        if (year !== 'all') {
            query.year = year;
        }

        // Apply title filter
        if (title !== 'all') {
            query.title = { $regex: title, $options: 'i' };
        }

        // Find books based on the filter criteria
        const books = await bookSchema.find(query);

        return res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.booksInCart = async (req, res) => {
    try {
        const username = req.params.username;

        // Find the user
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Extract ISBNs from the user's cart
        const isbnList = user.cart.map(book => book.isbn);

        // Find the books based on the extracted ISBNs
        const books = await bookSchema.find({ isbn: { $in: isbnList } });

        if (books.length === 0) {
            return res.status(404).json({ msg: 'No books found' });
        }

        // Send the book details to the client
        return res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};
exports.borrowedBooks = async (req, res) => {
    try {
        const users = await userSchema.find({ borrowed: { $exists: true, $ne: [] } });

        if (users.length === 0) {
            return res.status(404).json({ msg: "No borrowed books found" });
        }

        const borrowedBooks = [];

        for (const user of users) {
            for (const book of user.borrowed) {
                const borrowedBook = {
                    isbn: book.isbn,
                    title: "",
                    author: "",
                    uid: user.uniqueId,
                    borrower: user.name,
                    takenDate: book.takenDate,
                    dueDate:book.dueDate
                };

                const bookDetails = await bookSchema.findOne({ isbn: book.isbn });
                console.log(bookDetails);
                if (bookDetails) {
                    borrowedBook.title = bookDetails.Title;
                    borrowedBook.author = bookDetails.Author;
                } else {
                    borrowedBook.title = "Unknown";
                    borrowedBook.author = "Unknown";
                }

                borrowedBooks.push(borrowedBook);
            }
        }

        return res.status(200).json(borrowedBooks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}