const express = require("express");
require ("dotenv").config();

const app = express()

app.use(express.json())

app.get("/",(req, res)=>{res.json({
    message: "Welcome to FindIt Product Search API",
    status: "Running!"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`FindIt server running on port ${PORT}`);
}) 