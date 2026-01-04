const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Robust Env Loading
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
    // Fallback try loading from parent dir if running from root
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Check again
if (!process.env.MONGODB_URI) {
    console.error("CRITICAL: MONGODB_URI is not defined.");
    console.log("Current Dir:", __dirname);
    process.exit(1);
}

const User = require('./models/User');
const Product = require('./models/Product');
const Banner = require('./models/Banner');

const products = [
    {
        name: "Royal Silk Saree",
        description: "Elegant Banarasi silk saree with intricate gold zari work. Perfect for weddings and special occasions. Handwoven by master weavers of Varanasi.",
        price: 12999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop",
        stock: 15,
        rating: 4.8,
        reviews: [],
        sizes: ["Free Size"],
        trending: true,
        colors: ["Red", "Gold"]
    },
    {
        name: "Designer Lehenga Choli",
        description: "Hand-embroidered floral lehenga with a matching blouse and dupatta. Features exquisite thread work and sequins.",
        price: 24999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1583391733958-e026f3e5dd3d?q=80&w=2752&auto=format&fit=crop",
        stock: 8,
        rating: 4.9,
        reviews: [],
        sizes: ["S", "M", "L"],
        trending: true,
        colors: ["Pink", "Peach"]
    },
    {
        name: "Classic Men's Sherwani",
        description: "Premium ivory sherwani with pearl embellishments. A timeless choice for the groom or festive wear.",
        price: 15999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?q=80&w=2695&auto=format&fit=crop",
        stock: 10,
        rating: 4.7,
        reviews: [],
        sizes: ["M", "L", "XL"],
        trending: true,
        colors: ["Ivory", "Cream"]
    },
    {
        name: "Gold Plated Necklace Set",
        description: "Traditional temple jewelry set with ruby and emerald stones. Includes necklace and matching earrings.",
        price: 4999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2670&auto=format&fit=crop",
        stock: 25,
        rating: 4.6,
        reviews: [],
        sizes: ["Free Size"],
        trending: false,
        colors: ["Gold"]
    },
    {
        name: "Cotton Kurtis Combo",
        description: "Set of 2 breathable cotton kurtis for daily wear. Comfortable fitting with vibrant prints.",
        price: 1999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2666&auto=format&fit=crop",
        stock: 50,
        rating: 4.5,
        reviews: [],
        sizes: ["S", "M", "L", "XL"],
        trending: true,
        colors: ["Blue", "Yellow"]
    },
    {
        name: "Embroidered Silk Kurta",
        description: "Men's festive wear silk kurta in maroon. Detailed embroidery on the collar and cuffs.",
        price: 2999,
        category: "Men",
        image: "https://images.unsplash.com/photo-1622122608249-aeaa1bb0801d?q=80&w=2574&auto=format&fit=crop",
        stock: 20,
        rating: 4.4,
        reviews: [],
        sizes: ["M", "L", "XL"],
        trending: false,
        colors: ["Maroon"]
    },
    {
        name: "Kundan Earrings",
        description: "Handcrafted Kundan earrings with pearl drops. Lightweight and perfect for ethnic outfits.",
        price: 1299,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2574&auto=format&fit=crop",
        stock: 30,
        rating: 4.6,
        reviews: [],
        sizes: ["Free Size"],
        trending: true,
        colors: ["White", "Gold"]
    },
    {
        name: "Couple Wedding Combo",
        description: "Matching outfit set for couples - Saree and Sherwani. Color coordinated for the perfect wedding look.",
        price: 35999,
        category: "Couple",
        image: "https://images.unsplash.com/photo-1627931327170-c752ba18261e?q=80&w=2670&auto=format&fit=crop",
        stock: 5,
        rating: 5.0,
        reviews: [],
        sizes: ["M", "L"],
        trending: true,
        colors: ["Red", "Beige"]
    },
    {
        name: "Floral Summer Dress",
        description: "Light and airy floral print dress, perfect for summer outings.",
        price: 2499,
        category: "Women",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2546&auto=format&fit=crop",
        stock: 30,
        rating: 4.3,
        reviews: [],
        sizes: ["XS", "S", "M", "L"],
        trending: true
    },
    {
        name: "Designer Handbag",
        description: "Premium leather textured handbag with spacious compartments.",
        price: 5999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2535&auto=format&fit=crop",
        stock: 12,
        rating: 4.7,
        reviews: [],
        sizes: ["Standard"],
        trending: false
    },
    {
        name: "Men's Linen Shirt",
        description: "Casual linen shirt in pastel blue. Ideal for beach weddings or casual Fridays.",
        price: 2199,
        category: "Men",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=2576&auto=format&fit=crop",
        stock: 25,
        rating: 4.5,
        reviews: [],
        sizes: ["M", "L", "XL", "XXL"],
        trending: true
    },
    {
        name: "Silk Scarf",
        description: "Luxurious printed silk scarf that adds elegance to any outfit.",
        price: 1499,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1584022067786-9dc730d7cb6c?q=80&w=2574&auto=format&fit=crop",
        stock: 40,
        rating: 4.2,
        reviews: [],
        sizes: ["Free Size"],
        trending: false
    }
];

const banners = [
    {
        title: "Wedding Collection 2026",
        subtitle: "Experience the grandeur of Indian weddings",
        image: "https://images.unsplash.com/photo-1545959734-d07dbebc6199?q=80&w=2669&auto=format&fit=crop",
        link: "/shop",
        enabled: true,
        order: 1
    },
    {
        title: "Festive Elegance",
        subtitle: "Shine bright this season",
        image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2670&auto=format&fit=crop",
        link: "/shop",
        enabled: true,
        order: 2
    },
    {
        title: "Modern Silk",
        subtitle: "Tradition meets contemporary design",
        image: "https://images.unsplash.com/photo-1575296500595-df7228833446?q=80&w=2574&auto=format&fit=crop",
        link: "/shop",
        enabled: true,
        order: 3
    },
    {
        title: "Accessories Sale",
        subtitle: "Up to 50% off on Jewelry",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb0521ed?q=80&w=2670&auto=format&fit=crop",
        link: "/shop",
        enabled: true,
        order: 4
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        // Clear existing data to ensure clean demo state
        // await Product.deleteMany({});
        // await Banner.deleteMany({});

        // Upsert Products
        for (const product of products) {
            await Product.findOneAndUpdate(
                { name: product.name },
                product,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
        console.log("Products Seeded");

        // Upsert Banners (Preserve IDs if possible, or just overwrite slots)
        // We want to ensure 4 distinct slots
        const existingBanners = await Banner.find().sort({ order: 1 });

        if (existingBanners.length < 4) {
            // Not enough slots? Clear and reset properly
            await Banner.deleteMany({});
            await Banner.insertMany(banners);
            console.log("Banners Reset and Seeded");
        } else {
            // Overwrite content of existing banners to restore demo look
            for (let i = 0; i < 4; i++) {
                if (existingBanners[i]) {
                    Object.assign(existingBanners[i], banners[i]);
                    await existingBanners[i].save();
                }
            }
            console.log("Existing Banners Restored");
        }

        // Ensure Admin Exists (Safety)
        // Ensure Admin Exists (Safety)
        const adminEmail = 'admin@rivaya.com';
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Find and update, or upsert (better than create to ensure fields are fixed)
        await User.findOneAndUpdate(
            { email: adminEmail },
            {
                name: 'System Admin',
                firstName: 'System',
                lastName: 'Admin',
                phone: '9999999999',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            },
            { upsert: true, new: true, runValidators: true }
        );
        console.log('Admin account verified/updated');

        console.log("Database Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("Error Seeding:", error);
        process.exit(1);
    }
};

seedDB();
