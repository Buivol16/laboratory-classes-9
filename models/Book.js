function getBookCollection(db) {
  return db.collection('books');
}

module.exports = { getBookCollection };