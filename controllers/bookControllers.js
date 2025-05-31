const { ObjectId } = require("mongodb");
const { getBookCollection } = require("../models/Book");
const { getAuthorCollection } = require("../models/Author");

async function getBooks(req, res) {
    try {
        const db = req.app.locals.db;
        const books = await getBookCollection(db)
            .aggregate([
                {
                    $lookup: {
                        from: "authors",
                        localField: "author",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    $unwind: "$author"
                }
            ])
            .toArray();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
}

async function addBook(req, res) {
    try {
        const db = req.app.locals.db;
        const { title, year, author } = req.body;

        const authorColl = getAuthorCollection(db);
        const foundAuthor = await authorColl.findOne({ _id: new ObjectId(author) });
        if (!foundAuthor) {
            return res.status(400).json({ error: "Author not found" });
        }

        const result = await getBookCollection(db).insertOne({
            title,
            year,
            author: new ObjectId(author)
        });

        res.status(201).json({ _id: result.insertedId, title, year, author });
    } catch (error) {
        res.status(500).json({ error: "Failed to add book" });
    }
}

async function deleteBook(req, res) {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;

        const result = await getBookCollection(db).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete book" });
    }
}

module.exports = {
    getBooks,
    addBook,
    deleteBook
};