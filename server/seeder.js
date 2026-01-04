const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Collection = require('./models/Collection');
const Banner = require('./models/Banner');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Product.deleteMany();
        await Collection.deleteMany();
        await Banner.deleteMany();
        await User.deleteMany();

        console.log('Data Cleared...');

        // 0. Create Admin User
        await User.create({
            name: 'Demo Admin',
            email: 'admin@vrishtikalaa.com',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin'
        });
        console.log('Admin User Created...');

        // 1. Create Banners
        const banners = await Banner.create([
            {
                title: "New Wedding Collection",
                subtitle: "Handcrafted elegance for your special day",
                image: "/images/hero_lehenga.png",
                link: "/shop?category=Lehenga",
                enabled: true,
                order: 1
            },
            {
                title: "Festive Saree Edit",
                subtitle: "Timeless drapes for every occasion",
                image: "/images/hero_saree.png",
                link: "/shop?category=Sarees",
                enabled: true,
                order: 2
            },
            {
                title: "Modern Fusion",
                subtitle: "Contemporary styles for the new you",
                image: "/images/hero_anarkali.png",
                link: "/shop?category=Anarkali",
                enabled: true,
                order: 3
            },
            {
                title: "The Royal Collection",
                subtitle: "Exquisite designs for grand celebrations",
                image: "/images/hero_lehenga.png",
                link: "/shop?collection=royal",
                enabled: true,
                order: 4
            }
        ]);
        console.log('Banners Added...');

        // 2. Create Collections
        const collections = await Collection.create([
            {
                name: "Royal Weddings",
                description: "Premium lehengas and sherwanis for the grand occasion",
                heroImage: "/images/hero_lehenga.png",
                isActive: true
            },
            {
                name: "Summer Breeze",
                description: "Lightweight cottons and breathable fabrics",
                heroImage: "/images/cat_women.png",
                isActive: true
            },
            {
                name: "Festive Glamour",
                description: "Shine bright with our party wear collection",
                heroImage: "/images/hero_anarkali.png",
                isActive: true
            }
        ]);
        console.log('Collections Added...');

        // 3. Create Products
        const products = [
            // Wedding Collection Products
            {
                name: "Royal Red Bridal Lehenga",
                description: "Intricate zardosi work on pure raw silk fabric. Comes with double dupatta.",
                category: "Lehenga",
                price: 45999,
                images: ["/images/hero_lehenga.png", "/images/cat_women.png"],
                inStock: true,
                stockQuantity: 5,
                rating: 4.8,
                numReviews: 12,
                collections: [collections[0]._id]
            },
            {
                name: "Golden Embroidered Sherwani",
                description: "Hand embroidered sherwani in ivory and gold. Perfect for grooms.",
                category: "Ethnic Sets",
                price: 28999,
                images: ["/images/cat_men.png", "/images/cat_couple.png"],
                inStock: true,
                stockQuantity: 8,
                rating: 4.5,
                numReviews: 5,
                collections: [collections[0]._id]
            },
            {
                name: "Designer Couple Set",
                description: "Matching outfit for the perfect couple. Includes lehenga and sherwani.",
                category: "Ethnic Sets",
                price: 65000,
                images: ["/images/cat_couple.png"],
                inStock: true,
                stockQuantity: 2,
                rating: 5.0,
                numReviews: 3,
                collections: [collections[0]._id]
            },

            // Summer Breeze Products
            {
                name: "Pink Floral Anarkali",
                description: "Cotton silk anarkali with hand block prints. Breathable and stylish.",
                category: "Anarkali",
                price: 4999,
                images: ["/images/hero_anarkali.png"],
                inStock: true,
                stockQuantity: 15,
                rating: 4.2,
                numReviews: 20,
                collections: [collections[1]._id]
            },
            {
                name: "Daily Wear Kurti Set",
                description: "Comfortable cotton kurti with palazzo pants.",
                category: "Kurtis",
                price: 1299,
                images: ["/images/cat_women.png"],
                inStock: true,
                stockQuantity: 50,
                rating: 4.0,
                numReviews: 45,
                collections: [collections[1]._id]
            },
            {
                name: "Blue Cotton Saree",
                description: "Soft cotton saree with geometric prints.",
                category: "Sarees",
                price: 1899,
                images: ["/images/hero_saree.png"],
                inStock: true,
                stockQuantity: 25,
                rating: 4.3,
                numReviews: 18,
                collections: [collections[1]._id]
            },

            // Festive Products
            {
                name: "Banarasi Silk Saree",
                description: "Authentic banarasi silk with gold zari border.",
                category: "Sarees",
                price: 12500,
                images: ["/images/hero_saree.png"],
                inStock: true,
                stockQuantity: 10,
                rating: 4.9,
                numReviews: 32,
                collections: [collections[2]._id]
            },
            {
                name: "Embroidered Palazzo Suit",
                description: "Georgette suit with heavy embroidery on neck and sleeves.",
                category: "Palazzo Sets",
                price: 5500,
                images: ["/images/cat_women.png"],
                inStock: true,
                stockQuantity: 12,
                rating: 4.4,
                numReviews: 8,
                collections: [collections[2]._id]
            },
            {
                name: "Velvet Lehenga Choli",
                description: "Maroon velvet lehenga for winter weddings.",
                category: "Lehenga",
                price: 18000,
                images: ["/images/hero_lehenga.png"],
                inStock: true,
                stockQuantity: 4,
                rating: 4.7,
                numReviews: 10,
                collections: [collections[2]._id]
            },
            {
                name: "Statement Necklace Set",
                description: "Kundan work necklace with matching earrings.",
                category: "Ethnic Sets", // Mapping to existing enum, assuming accessories might fall here or be added later
                price: 2500,
                images: ["/images/cat_accessories.png"],
                inStock: true,
                stockQuantity: 20,
                rating: 4.1,
                numReviews: 15,
                collections: [collections[2]._id]
            }
        ];

        await Product.create(products);
        console.log('Products Added...');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
