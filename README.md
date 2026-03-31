# 🛒 Pro-Brand E-commerce Store

A modern, fully functional E-commerce web application developed as a university project. This project demonstrates the integration of a backend server with a cloud database and a professional frontend.

## 🚀 Live Demo
**Link:** [Apna Render wala link yahan paste karein]

## ✨ Features
* **User Authentication:** Secure Login and Signup system using JWT and Bcrypt.
* **Admin Panel:** A dedicated `/admin` route protected by a secret password (`hadi09`) to manage inventory.
* **Product Management:** Ability to Add and Delete products directly from the Admin interface.
* **Cloud Database:** Fully integrated with **MongoDB Atlas** for real-time data storage.
* **Search Functionality:** Users can search for products by name.
* **Responsive Design:** Clean and modern UI built with EJS and Custom CSS.

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Frontend:** EJS (Embedded JavaScript), CSS3, FontAwesome
* **Security:** JSON Web Tokens (JWT), HTTP-Only Cookies, Password Hashing (Bcrypt)
* **Deployment:** Render

## 📂 Project Structure
```text
├── models/           # Mongoose Schemas (User, Product)
├── views/            # EJS Templates (Login, Signup, Admin, Gallery)
├── public/           # Static files (CSS, Images)
├── server.js         # Main server file & API Routes
└── package.json      # Project dependencies
