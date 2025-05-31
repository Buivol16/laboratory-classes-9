function getAuthorCollection(db) {
    return db.collection('authors');
}

module.exports = { getAuthorCollection };