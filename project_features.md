# Rivaya E-Commerce Project - Features & Settings Documentation

## 1. Project Overview
  Rivaya   is a full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). It features a modern, responsive user interface, secure payment processing, comprehensive product management, and a robust admin dashboard.

---

## 2. Key Features

### A. Customer Frontend (User Experience)
      User Interface & Design  
          Responsive Design  : Fully optimized for mobile, tablet, and desktop views.   (Implemented)  
          Modern Aesthetics  : Clean layout with "Lucide React" icons, smooth transitions, and a cohesive color palette (Maroon/White).   (Implemented)  
          Interactive Components  : Hero Slider, Sticky Navigation, Back-to-Top button, and Floating WhatsApp support button.   (Implemented)  

      Product Browsing & Discovery  
          Home Page  : dynamic hero banners, "Shop by Category" grid, "Sale" sticky banner, and featured testimonials.   (Implemented)  
          Product Listing  : Grid view of products with price, images, and "Quick Add" functionality.   (Implemented)  
          Product Details  : High-quality image gallery, size selection, stock status indicators, and detailed descriptions.   (Implemented)  
          Collections  : Curated groups of products for targeted browsing.   (Implemented)  

      Shopping Cart & Checkout  
          Cart Drawer  : Slide-out cart allowing users to view items without leaving the current page.   (Implemented)  
          Real-time Updates  : Instant subtotal calculation and shipping cost estimates.   (Implemented)  
          Secure Checkout  : 3-Step Information -> Shipping -> Payment flow.   (Implemented)  
          Order Confirmation  : Digital receipt with order ID and summary.   (Implemented)  

      User Account Management  
          Authentication  : Secure Sign Up and Login via Email/Password (Pop-up Modal).   (Implemented)  
          Profile Dashboard  : 
            Edit personal details (Name, Phone).   (Implemented)  
              Address Book  : Save, edit, and delete multiple shipping addresses.   (Implemented)  
              Order History  : View past orders and their status (Processing, Delivered, etc.).   (Implemented)  
              Account Controls  : "Danger Zone" user ability to delete their account permanently.   (Implemented)  

      Customer Support & Engagement  
          Complaint System  : Dedicated form for users to register complaints or issues.   (Implemented)  
          Reviews  : Verified buyers can rate products (1-5 stars) and leave comments.   (Implemented)  
          Social Proof  : Testimonials section to build trust.   (Implemented)  

### B. Admin Dashboard (Backend Management)
      Overview & Analytics  
          Dashboard Stats  : Real-time counters for Total Products, Total Orders, Total Customers, and Total Revenue.   (Implemented)  
          Recent Orders  : Quick view of the latest incoming orders.   (Implemented)  

      Product Management  
          Inventory Control  : Add, Edit, and Delete products.   (Implemented)  
          Image Management  : Upload product images directly via the dashboard.   (Implemented)  
          Categorization  : Assign products to specific categories and sub-categories.   (Implemented)  

      Order Management  
          Full Order List  : View all orders with customer details and payment status.   (Implemented)  
          Status Updates  : Admins can change order status (e.g., from "Pending" to "Shipped" or "Delivered").   (Implemented)  

      Content Management (CMS)  
          Banner System  : 
              Hero Slider  : Toggle and update the main 4 slider images and text on the homepage.   (Implemented)  
              Sale Banner  : Enable/Disable the top sticky announcement bar and edit its text.   (Implemented)  
          Review Moderation  : Admins can view all reviews and delete inappropriate content. Includes manual "Add Review" tool for seeding initial feedback.   (Implemented)  

      Customer Service  
          Complaint Resolution  : View customer complaints and mark them as "Resolved".   (Implemented)  

### C. Technical Integrations
      Payment Gateway  :   Razorpay   integration for secure credit card, debit card, and UPI payments.   (Implemented)  
        Supports automatic payment verification via signature headers.   (Implemented)  
        Fallback support for   Cash on Delivery (COD)  .   (Implemented)  
      Authentication  : JSON Web Tokens (JWT) for stateless, secure user sessions.   (Implemented)  
      Database  : MongoDB for scalable storage of Users, Products, Orders, and Reviews.   (Configured & Implemented)  

---

## 3. Configuration & Settings

To run the project, the following settings are configured in the `server/.env` file:

### Core Settings
    `PORT`: The port on which the backend server runs (e.g., `5000` or `3000`).   (Configured)  
    `MONGODB_URI`: Connection string for the MongoDB database (Local or Atlas Cloud).   (Configured)  
    `JWT_SECRET`: A secret key used to sign and verify user authentication tokens.   (Configured)  

### Payment Settings (Razorpay)
    `RAZORPAY_KEY_ID`: Public key for initiating client-side payments.   (Configured)  
    `RAZORPAY_KEY_SECRET`: Private key for verifying payments on the server.   (Configured)  

### Email Settings (Nodemailer)
    `EMAIL_USER`: The email address used to send system notifications (e.g., Order Confirmation).   (Configured)  
    `EMAIL_PASS`: App password or credentials for the email service.   (Configured)  

### Admin Defaults
    `ADMIN_EMAIL`: The default email to recognize administrative login privileges (if hardcoded or seeded).   (Configured)  

---

## 4. Dependencies
  Frontend  : `React`, `Vite`, `React Router DOM`, `Lucide React` (Icons).   (Installed)  
  Backend  : `Express`, `Mongoose` (MongoDB), `Bcryptjs` (Password Hashing), `JsonWebToken`, `Multer` (File Uploads), `Nodemailer`, `Razorpay`.   (Installed)  
