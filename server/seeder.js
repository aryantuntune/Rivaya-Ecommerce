const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Collection = require('./models/Collection'); // Ensure this model exists or create it

dotenv.config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Banner.deleteMany();
        await Collection.deleteMany();

        // 1. Prepare Users (Hash Password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const users = await User.insertMany([
            {
                name: "Admin User",
                email: "admin@vrishtikalaa.com",
                password: hashedPassword, // Hashed!
                role: "admin",
                phone: "+91 98765 43210"
            }
        ]);

        console.log('Users Imported');

        // 2. Prepare Products (Full List from mockDatabase)
        const products = await Product.insertMany([
            {
                name: "Midnight Bloom Kurti",
                description: "Elegant kurti with intricate embroidery and premium silk blend fabric. Perfect for festive occasions.",
                category: "Kurtis",
                price: 1299,
                originalPrice: 1999,
                images: ["/images/cat_women.png"],
                variants: [
                    { size: 'S', stock: 5, sku: 'RIV-MBK-S' },
                    { size: 'M', stock: 8, sku: 'RIV-MBK-M' },
                    { size: 'L', stock: 0, sku: 'RIV-MBK-L' },
                    { size: 'XL', stock: 4, sku: 'RIV-MBK-XL' }
                ],
                inStock: true,
                isNew: true,
                rating: 4.5,
                reviews: 128,
                analytics: { views: 1234, addToCart: 89, wishlist: 45, purchases: 23 }
            },
            {
                name: "Royal Bagru Print Set",
                description: "Traditional Bagru print ethnic set with modern silhouette. Handcrafted by artisans.",
                category: "Ethnic Sets",
                price: 2499,
                originalPrice: 3500,
                images: ["/images/cat_couple.png"],
                variants: [
                    { size: 'S', stock: 2, sku: 'RIV-RBPS-S' },
                    { size: 'M', stock: 5, sku: 'RIV-RBPS-M' },
                    { size: 'L', stock: 3, sku: 'RIV-RBPS-L' },
                    { size: 'XL', stock: 1, sku: 'RIV-RBPS-XL' }
                ],
                inStock: true,
                isNew: true,
                rating: 4.8,
                reviews: 95,
                analytics: { views: 987, addToCart: 67, wishlist: 34, purchases: 19 }
            },
            {
                name: "Golden Hour Anarkali",
                description: "Stunning anarkali with golden embellishments. Features flared silhouette and intricate work.",
                category: "Anarkali",
                price: 3999,
                originalPrice: 5000,
                images: ["/images/hero_anarkali.png"],
                variants: [
                    { size: 'S', stock: 0, sku: 'RIV-GHA-S' },
                    { size: 'M', stock: 2, sku: 'RIV-GHA-M' },
                    { size: 'L', stock: 0, sku: 'RIV-GHA-L' }
                ],
                inStock: true,
                isNew: false,
                rating: 4.7,
                reviews: 203,
                analytics: { views: 1567, addToCart: 123, wishlist: 78, purchases: 45 }
            },
            {
                name: "Crimson Silk Saree",
                description: "Pure silk saree in rich crimson with gold zari border. Timeless elegance.",
                category: "Sarees",
                price: 4500,
                originalPrice: 6000,
                images: ["/images/hero_saree.png"],
                variants: [
                    { size: 'One Size', stock: 15, sku: 'RIV-CSS-OS' }
                ],
                inStock: true,
                isNew: false,
                rating: 5.0,
                reviews: 342,
                analytics: { views: 2345, addToCart: 156, wishlist: 98, purchases: 67 }
            },
            {
                name: "Emerald Palazzo Set",
                description: "Contemporary palazzo set in emerald green. Comfortable and stylish for all-day wear.",
                category: "Palazzo Sets",
                price: 1899,
                originalPrice: 2800,
                images: ["/images/cat_accessories.png"],
                variants: [
                    { size: 'S', stock: 10, sku: 'RIV-EPS-S' },
                    { size: 'M', stock: 12, sku: 'RIV-EPS-M' },
                    { size: 'L', stock: 8, sku: 'RIV-EPS-L' },
                    { size: 'XL', stock: 5, sku: 'RIV-EPS-XL' }
                ],
                inStock: true,
                isNew: true,
                rating: 4.6,
                reviews: 87,
                analytics: { views: 876, addToCart: 54, wishlist: 32, purchases: 15 }
            },
            {
                name: "Ivory Chikankari Kurta",
                description: "Delicate chikankari work on premium cotton. Classic ivory elegance.",
                category: "Kurtis",
                price: 1599,
                originalPrice: 2200,
                images: ["/images/cat_women.png"],
                variants: [
                    { size: 'S', stock: 6, sku: 'RIV-ICK-S' },
                    { size: 'M', stock: 9, sku: 'RIV-ICK-M' },
                    { size: 'L', stock: 4, sku: 'RIV-ICK-L' },
                    { size: 'XL', stock: 0, sku: 'RIV-ICK-XL' }
                ],
                inStock: true,
                isNew: false,
                rating: 4.4,
                reviews: 156,
                analytics: { views: 1123, addToCart: 78, wishlist: 45, purchases: 28 }
            },
            {
                name: "Peacock Blue Lehenga",
                description: "Majestic lehenga in peacock blue with intricate embroidery. Perfect for weddings.",
                category: "Lehenga",
                price: 5999,
                originalPrice: 8500,
                images: ["/images/hero_lehenga.png"],
                variants: [
                    { size: 'S', stock: 2, sku: 'RIV-PBL-S' },
                    { size: 'M', stock: 1, sku: 'RIV-PBL-M' },
                    { size: 'L', stock: 0, sku: 'RIV-PBL-L' }
                ],
                inStock: true,
                isNew: true,
                rating: 4.9,
                reviews: 267,
                analytics: { views: 3456, addToCart: 234, wishlist: 145, purchases: 89 }
            },
            {
                name: "Maroon Long Kurti",
                description: "Floor length maroon kurti with gold foil print. Elegant and royal.",
                category: "Kurtis", // Mapped Long Kurti -> Kurtis
                price: 2199,
                originalPrice: 3200,
                images: ["/images/hero_anarkali.png"],
                variants: [
                    { size: 'S', stock: 4, sku: 'RIV-MLK-S' },
                    { size: 'M', stock: 6, sku: 'RIV-MLK-M' },
                    { size: 'L', stock: 2, sku: 'RIV-MLK-L' },
                    { size: 'XL', stock: 3, sku: 'RIV-MLK-XL' }
                ],
                inStock: true,
                isNew: false,
                rating: 4.3,
                reviews: 74,
                analytics: { views: 654, addToCart: 43, wishlist: 21, purchases: 12 }
            }
        ]);
        console.log('Products Imported');

        // 3. Prepare Banners
        await Banner.insertMany([
            {
                image: "/images/hero_lehenga.png",
                title: "Modern Ethnic Wear",
                subtitle: "Discover our latest collection of contemporary lehengas",
                link: "/shop",
                enabled: true,
                order: 1
            },
            {
                image: "/images/hero_saree.png",
                title: "Festive Elegance",
                subtitle: "Shine bright this wedding season",
                link: "/collections",
                enabled: true,
                order: 2
            },
            {
                image: "/images/hero_anarkali.png",
                title: "Premium Anarkalis",
                subtitle: "Flowy silhouettes for every occasion",
                link: "/shop?category=Anarkali",
                enabled: true,
                order: 3
            },
            {
                image: "/images/cat_accessories.png",
                title: "Handcrafted Jewelry",
                subtitle: "Complete your look with antique gold",
                link: "/shop?category=Accessories",
                enabled: true,
                order: 4
            }
        ]);
        console.log('Banners Imported');

        // 4. Collections (Need Product IDs)
        // Helper to find ID by name pattern
        const findId = (pattern) => {
            const p = products.find(prod => prod.name.includes(pattern));
            return p ? p._id : null;
        };

        await Collection.insertMany([
            {
                name: "Summer Collection 2025",
                description: "Light and breezy ethnic wear perfect for summer festivities",
                heroImage: "/images/cat_women.png",
                products: [findId("Midnight Bloom"), findId("Emerald"), findId("Ivory")].filter(Boolean),
                isActive: true
            },
            {
                name: "Wedding Collection",
                description: "Exquisite pieces for your special day",
                heroImage: "/images/cat_couple.png",
                products: [findId("Golden Hour"), findId("Crimson"), findId("Peacock")].filter(Boolean),
                isActive: true
            }
        ]);
        console.log('Collections Imported');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
