const express = require("express");
const router = express.Router();
const { getAuthors, updateAuthor } = require("../controllers/authorControllers");

router.get("/", getAuthors);
router.put("/:id", updateAuthor);

module.exports = router;