const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Banner = require('./models/Banner');

dotenv.config();

// Hardcoded data
const mockUsers = [
    {
        name: "Admin User",
        email: "admin@vrishtikalaa.com",
        password: "admin123",
        role: "admin"
    }
];

const mockProducts = [
    {
        name: "Midnight Bloom Kurti",
        description: "Elegant kurti with intricate embroidery...",
        category: "Kurtis",
        price: 1299,
        images: ["/images/cat_women.png"],
        variants: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }],
        inStock: true
    },
    {
        name: "Royal Bagru Print Set",
        description: "Traditional Bagru print...",
        category: "Ethnic Sets",
        price: 2499,
        images: ["/images/cat_couple.png"],
        variants: [{ size: 'M', stock: 5 }],
        inStock: true
    }
];

const mockBanners = [
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
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        await User.deleteMany();
        await Product.deleteMany();
        await Banner.deleteMany();

        await User.insertMany(mockUsers);
        await Product.insertMany(mockProducts);
        await Banner.insertMany(mockBanners);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
