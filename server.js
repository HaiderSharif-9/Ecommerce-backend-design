const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"views","index.html"));
});

app.get("/products",(req,res)=>{
res.sendFile(path.join(__dirname,"views","products.html"));
});

app.get("/products/:id",(req,res)=>{
res.sendFile(path.join(__dirname,"views","productDetails.html"));
});

app.listen(3000, ()=>{
console.log("Server running on port 3000");
});
