const pool = require('../../database');
const queries = require('./queries');

const getBook = (req, res) => {
    pool.query(queries.getBook, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const getBookbyID = (req, res) => {
    const id = req.params.id;
    pool.query(queries.getBookbyID, [id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const addBook = (req, res) => {
    const{BookNumber, BookName, PublicationYear, Pages, SectionID, PublisherID, DiscountID} = req.body;
    //check if book name exists
    pool.query(queries.checkBookName, [BookName], (error, results) => {
        if (results.rows.length) {
            res.send("Book Name Already Exists.");
        }

        //add Book to Database
        pool.query(
            queries.addBook, [BookNumber, BookName, PublicationYear, Pages, SectionID, PublisherID, DiscountID], 
            (error, results) =>{
                if (error) throw error;
                res.status(201).send("Book Added Successfully!");
        })
    });
    
};

const removeBook = (req, res) => {
    const id = req.params.id;
    pool.query(queries.getBookbyID, [id], (error, results) => {
        const noBookFound = !results.rows.length;
        if (noBookFound){
            res.send("Book Doesn't Exists");
        }

        pool.query(queries.removeBook, [id], (error, results) => {
            if(error) throw error;
            res.status(200).send("Book Removes Successfully.")
        });
    });
};

const updateBook = (req, res) => {
    const id = req.params.id;
    const {BookName} = req.body;
    pool.query(queries.getBookbyID, [id], (error, results) => {
        const noBookFound = !results.rows.length;
        if (noBookFound){
            res.send("Book Doesn't Exists");
        }

        pool.query(queries.updateBook, [BookName, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Book updated successfully");
        })
    });
};

const SQLBuilder = (req, res) => {
    const { filter, sort } = req.body;
    let sqlQuery = 'SELECT * FROM "Book"';
    let queryVals = [];
    let conditions = [];

    if (filter) {
        for (const [field, value] of Object.entries(filter)) {
            if (typeof value === "object" && value != null) {
                for (const [operator, conditionValue] of Object.entries(value)) {
                    const paramIndex = queryVals.length + 1;
                    switch (operator) {
                        case 'Start Year':
                            conditions.push(`"${field}" >= $${paramIndex}`);
                            queryVals.push(conditionValue);
                            break;
                        case 'End Year':
                            conditions.push(`"${field}" <= $${paramIndex}`);
                            queryVals.push(conditionValue);
                            break;
                    }
                }
            } else {
                const paramIndex = queryVals.length + 1;
                conditions.push(`"${field}" = $${paramIndex}`);
                queryVals.push(value);
            }
        }
    }

    if (conditions.length > 0) {
        sqlQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sort) {
        sqlQuery += ` ORDER BY "${sort.column}" ${sort.orientation}`;
    }

    console.log('Constructed SQL Query:', sqlQuery); // Add this line to debug the SQL query
    console.log('Query Values:', queryVals); // Add this line to debug the query values

    pool.query(sqlQuery, queryVals, (error, results) => {
        if (error) {
            console.error('Database query error:', error); // Log the error for better debugging
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.status(200).json(results.rows);
        }
    });
}



//TCL
const addBookStocks = async(req, res) => {
    try{
        await pool.query('BEGIN');
        const {BookNumber, BookName, PublicationYear, Pages, SectionID, PublisherID, DiscountID, Warehouse_WarehouseID, Stock} = req.body;

        //Insert Book
        const insertBook = queries.addBook;
        const insertValsBook = [BookNumber, BookName, PublicationYear, Pages, SectionID, PublisherID, DiscountID];
        await pool.query(insertBook, insertValsBook);

        //Insert Stocks
        const insertStocks = queries.addStocks;
        const insertValsStocks = [Warehouse_WarehouseID, BookNumber, Stock];
        await pool.query(insertStocks, insertValsStocks);

        //Commit Transaction
        await pool.query('COMMIT');

        //Show The JoinTable for Book and Book Inventory
        const result = await pool.query(queries.InnerJoinBookStocks);

        console.log('Transaction Success');
        res.status(200).send(result.rows);

    }catch(error){
        pool.query('ROLLBACK');
        console.error(`Transaction Failed : ${error}`);
        res.status(500).send(`Transaction Failed`);
    }
}

const PurchaseBook = async(req, res) => {
    try{
        await pool.query('BEGIN');
        const{BookNumber, Customer_CustomerNumber, Date, Price, Quantity} = req.body;

        //Add Book Purchase
        const Bought = queries.BookPurchase;
        const insertValsBought = [BookNumber, Customer_CustomerNumber, Date, Price, Quantity];
        await pool.query(Bought, insertValsBought);

        //Update Stocks on Purchase
        const UpdateStocksOnPurchase = queries.UpdateStocksOnPurchase;
        const updateStocksVals = [Quantity, BookNumber];
        await pool.query(UpdateStocksOnPurchase, updateStocksVals);

        //Commit Transactions
        await pool.query('COMMIT');

        //Show The Jointable Result
        const result = await pool.query(queries.InnerJoinBookPurchase);

        console.log(`Transaction Success`);
        res.status(200).send(result.rows);
    }catch(error){
        pool.query('ROLLBACK');
        console.error(`Transaction Failed : ${error}`);
        res.status(500).send(`Transaction Failed`);
    }
}

module.exports = {
    getBook,
    getBookbyID,
    addBook,
    removeBook,
    updateBook,
    SQLBuilder,
    addBookStocks,
    PurchaseBook,
};