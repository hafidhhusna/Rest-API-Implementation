const {Router} = require('express');
const controller = require('./controller');

const router = Router();

//Route Get
router.get("/get/book/", controller.getBook);
router.get("/get/book/:id", controller.getBookbyID);

//Route Post
router.post("/add/book/", controller.addBook);
//SQL Builder
router.post("/book/filter", controller.SQLBuilder);

//Route Put
router.put("/update/book/:id", controller.updateBook);

//Route Delete
router.delete("/delete/book/:id", controller.removeBook);

//TCL
router.post("/post/addBookStock", controller.addBookStocks);
router.post("/post/PurchaseBook", controller.PurchaseBook);


module.exports = router;