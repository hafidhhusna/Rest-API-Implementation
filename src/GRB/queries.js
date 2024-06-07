const getBook = 'SELECT * FROM "Book"';
const getBookbyID = 'SELECT * FROM "Book" WHERE "BookNumber" = $1';
const checkBookName = 'SELECT b FROM "Book" b WHERE b."BookName" = $1';
const addBook = 'INSERT INTO "Book" ("BookNumber", "BookName", "PublicationYear", "Pages", "SectionID", "PublisherID", "DiscountID") VALUES ($1, $2, $3, $4, $5, $6, $7)';
const addStocks = 'INSERT INTO "Book Inventory" ("Warehouse_WarehouseID", "Book_BookNumber", "Stock") VALUES ($1, $2, $3)';
const removeBook = 'DELETE FROM "Book" WHERE "BookNumber" = $1';
const updateBook = 'UPDATE "Book" SET "BookName" = $1 WHERE "BookNumber" = $2';
const InnerJoinBookStocks = 'SELECT b."BookNumber", b."BookName", b."PublicationYear", b."Pages", BI."Stock" FROM "Book" b INNER JOIN "Book Inventory" BI ON b."BookNumber" = BI."Book_BookNumber"';
const BookPurchase = 'INSERT INTO "Bought" ("Book_BookNumber", "Customer_CustomerNumber", "Date", "Price", "Quantity") VALUES ($1, $2, $3, $4, $5)';
const UpdateStocksOnPurchase = 'UPDATE "Book Inventory" SET "Stock" = "Stock" - $1 WHERE "Book_BookNumber" = $2';
const InnerJoinBookPurchase = 'SELECT bo."Book_BookNumber", bo."Quantity", BI."Stock" FROM "Bought" bo INNER JOIN "Book Inventory" BI ON bo."Book_BookNumber" = BI."Book_BookNumber"';

module.exports = {
    getBook,
    getBookbyID,
    checkBookName,
    addBook,
    removeBook,
    updateBook,
    addStocks,
    InnerJoinBookStocks,
    BookPurchase,
    UpdateStocksOnPurchase,
    InnerJoinBookPurchase,
};
