const express = require("express");
const GRBRoutes = require('./src/GRB/routes')
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World");
});

app.use('/api/v1/GRB', GRBRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));