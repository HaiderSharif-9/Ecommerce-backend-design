const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const app = express();

// --- EJS AUR MIDDLEWARE SETUP ---
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// --- DATABASE CONNECTION ---
mongoose.connect("mongodb://mrhaider346_db_user:hadiking09@ac-a5788v0-shard-00-00.kd5ih58.mongodb.net:27017,ac-a5788v0-shard-00-01.kd5ih58.mongodb.net:27017,ac-a5788v0-shard-00-02.kd5ih58.mongodb.net:27017/?ssl=true&replicaSet=atlas-hll5vl-shard-0&authSource=admin&appName=Cluster0")
.then(()=> console.log("DB Connected"))
.catch(err=> console.log("DB Error: ", err));

// --- SCHEMA & MODEL ---
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String
});
const Product = mongoose.model("Product", productSchema);
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);
const auth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/signup");
    }

    try {
        const verified = jwt.verify(token, 'mysecret');
        req.user = verified; 
        next();
    } catch (err) {
        res.redirect("/login");
    }
};
// ==========================================
// --- 1. ADMIN PANEL (Password: hadi09) ---
// ==========================================
app.get("/admin", async (req, res) => {
    const adminPass = req.query.pass;
    if (adminPass === "hadi09") {
        try {
            const products = await Product.find();
            res.render("index", { products: products }); 
        } catch (err) {
            res.status(500).send("Server Error");
        }
    } else {
        res.send(`
            <div style="text-align:center; padding:100px; font-family:sans-serif; background:#f4f7f6; min-height:100vh;">
                <div style="background:white; display:inline-block; padding:40px; border-radius:10px; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color:#2c3e50;">🔐 Admin Access</h2>
                    <form action="/admin" method="GET">
                        <input type="password" name="pass" placeholder="Password" required style="padding:12px; width:200px; border:1px solid #ddd; border-radius:5px;">
                        <br><br>
                        <button type="submit" style="padding:12px 25px; background:#0d6efd; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Unlock</button>
                    </form>
                    ${adminPass ? '<p style="color:red; margin-top:15px;">❌ Galat Password!</p>' : ''}
                </div>
            </div>
        `);
    }
});

// ==========================================
// --- 2. PRODUCT ROUTES (Gallery & Details) ---
// ==========================================
app.get("/products", auth, async (req, res) => {
    try {
        let searchQuery = {};
        if (req.query.search) {
            searchQuery.name = { $regex: req.query.search, $options: 'i' };
        }
        const products = await Product.find(searchQuery);
        res.render("product", { products: products });
    } catch (err) {
        res.redirect("/login");
    }
});

app.get("/products/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render("product-details", { product: product });
    } catch (err) {
        res.status(404).send("Product not found");
    }
});

// ==========================================
// --- 3. API ROUTES (Add & Delete) ---
// ==========================================
app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.redirect("/admin?pass=hadi09");
    } catch (err) {
        res.status(500).send("Error saving product");
    }
});

app.post("/products/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/admin?pass=hadi09");
    } catch (err) {
        res.status(500).send("Error deleting product");
    }
});

// ==========================================
// --- 4. AUTH ROUTES (GET & POST) ---
// ==========================================

// --- SIGNUP ---
app.get("/signup", (req, res) => res.render("signup"));

app.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        res.redirect("/login");
    } catch (err) {
        res.status(500).send("Signup Failed");
    }
});

// --- LOGIN ---
app.get("/login", (req, res) => res.render("login"));

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ userId: user._id }, "mysecret", { expiresIn: '1h' });
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/products");
        } else {
            res.send("<script>alert('Invalid Email/Password'); window.location='/login';</script>");
        }
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// --- LOGOUT ---
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// ==========================================
// --- 5. REDIRECTS & 404 ---
// ==========================================
app.get("/", (req, res) => res.redirect("/login"));

app.use((req, res) => {
    res.status(404).send("<h1 style='text-align:center; margin-top:50px;'>404 - Raasta Band Hai!</h1>");
});

// --- SERVER START ---
app.listen(3000, () => {
    console.log("🔥 Server running on http://localhost:3000");
});

