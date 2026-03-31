const mongoose = require("mongoose");
const Product = require("./models/Product"); // Ensure path sahi ho

const dbURI = "mongodb://mrhaider346_db_user:hadiking09@ac-a5788v0-shard-00-00.kd5ih8.mongodb.net/ecommerce?replicaSet=atlas-h115vl-shard-0&authSource=admin&retryWrites=true&w=majority";

const seedProducts = [
    {
        name: "Wireless Headphones",
        price: 50,
        category: "Electronics",
        image: "https://via.placeholder.com/150",
        description: "High quality wireless headphones",
        stock: 10
    },
    {
        name: "Smart Watch",
        price: 120,
        category: "Electronics",
        image: "https://via.placeholder.com/150",
        description: "Feature rich smart watch",
        stock: 5
    },
    {
        name: "Running Shoes",
        price: 80,
        category: "Fashion",
        image: "https://via.placeholder.com/150",
        description: "Comfortable running shoes",
        stock: 15
    }
];

mongoose.connect(dbURI)
    .then(async () => {
        console.log("Connected to DB for seeding...");
        await Product.deleteMany({}); // Purana data clear karne ke liye
        await Product.insertMany(seedProducts);
        console.log("Data Added Successfully!");
        process.exit();
    })
    .catch(err => console.log(err));

