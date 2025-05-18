var express = require("express")
var app = express()
var router = require("./routes/routes")
let knex = require("./database/connection")
require('dotenv').config();

 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/",router);

app.listen(process.env.PORT,() => {
    console.log("Servidor rodando na porta " + process.env.PORT);
});
