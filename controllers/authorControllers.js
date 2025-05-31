const { ObjectId } = require("mongodb");
const { getAuthorCollection } = require("../models/Author");

async function getAuthors(req, res) {
  try {
    const db = req.app.locals.db;
    const authors = await getAuthorCollection(db).find().toArray();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
}

async function updateAuthor(req, res) {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    const result = await getAuthorCollection(db).updateOne(
      { _id: new ObjectId(id) },
      { $set: { firstName, lastName } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json({ _id: id, firstName, lastName });
  } catch (error) {
    res.status(500).json({ error: "Failed to update author" });
  }
}

module.exports = {
  getAuthors,
  updateAuthor
};