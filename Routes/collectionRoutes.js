const express = require("express");
const { createCollection, deleteCollection, UpdateCollection } = require("../Controllers/CollectionController");
const route = new express.Router();

route.post("/collection/new",createCollection);

route.delete("/collection/delete/:id",deleteCollection);

route.patch("/collection/update/:id",UpdateCollection);

module.exports = route;