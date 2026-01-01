export const mockProducts = [
    {
        id: 1,
        name: "Midnight Bloom Kurti",
        description: "Elegant kurti with intricate embroidery and premium silk blend fabric. Perfect for festive occasions.",
        category: "Short Kurti",
        price: 1299,
        originalPrice: 1999,
        images: ["https://images.unsplash.com/photo-1583391733958-e02376903394?q=80&w=2070&auto=format&fit=crop"],
        variants: [
            { size: 'S', stock: 5, sku: 'RIV-MBK-S' },
            { size: 'M', stock: 8, sku: 'RIV-MBK-M' },
            { size: 'L', stock: 0, sku: 'RIV-MBK-L' },
            { size: 'XL', stock: 4, sku: 'RIV-MBK-XL' }
        ],
        inStock: true, // Computed from variants
        isNew: true,
        rating: 4.5,
        reviews: 128,
        collections: [],
        analytics: { views: 1234, addToCart: 89, wishlist: 45, purchases: 23 }
    },
    {
        id: 2,
        name: "Royal Bagru Print Set",
        description: "Traditional Bagru print ethnic set with modern silhouette. Handcrafted by artisans.",
        category: "Ethnic Sets",
        price: 2499,
        originalPrice: 3500,
        images: ["https://images.unsplash.com/photo-1605906233513-57c5a013329f?q=80&w=1887&auto=format&fit=crop"],
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
        collections: [],
        analytics: { views: 987, addToCart: 67, wishlist: 34, purchases: 19 }
    },
    {
        id: 3,
        name: "Golden Hour Anarkali",
        description: "Stunning anarkali with golden embellishments. Features flared silhouette and intricate work.",
        category: "Anarkali",
        price: 3999,
        originalPrice: 5000,
        images: ["https://images.unsplash.com/photo-1610030469450-40af9250af7a?q=80&w=2070&auto=format&fit=crop"],
        variants: [
            { size: 'S', stock: 0, sku: 'RIV-GHA-S' },
            { size: 'M', stock: 2, sku: 'RIV-GHA-M' },
            { size: 'L', stock: 0, sku: 'RIV-GHA-L' }
        ],
        inStock: true,
        isNew: false,
        rating: 4.7,
        reviews: 203,
        collections: [],
        analytics: { views: 1567, addToCart: 123, wishlist: 78, purchases: 45 }
    },
    {
        id: 4,
        name: "Crimson Silk Saree",
        description: "Pure silk saree in rich crimson with gold zari border. Timeless elegance.",
        category: "Sarees",
        price: 4500,
        originalPrice: 6000,
        images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1887&auto=format&fit=crop"],
        variants: [
            { size: 'One Size', stock: 15, sku: 'RIV-CSS-OS' }
        ],
        inStock: true,
        isNew: false,
        rating: 5.0,
        reviews: 342,
        collections: [],
        analytics: { views: 2345, addToCart: 156, wishlist: 98, purchases: 67 }
    },
    {
        id: 5,
        name: "Emerald Palazzo Set",
        description: "Contemporary palazzo set in emerald green. Comfortable and stylish for all-day wear.",
        category: "Palazzo Sets",
        price: 1899,
        originalPrice: 2800,
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1887&auto=format&fit=crop"],
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
        collections: [],
        analytics: { views: 876, addToCart: 54, wishlist: 32, purchases: 15 }
    },
    {
        id: 6,
        name: "Ivory Chikankari Kurta",
        description: "Delicate chikankari work on premium cotton. Classic ivory elegance.",
        category: "Short Kurti",
        price: 1599,
        originalPrice: 2200,
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1887&auto=format&fit=crop"],
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
        collections: [],
        analytics: { views: 1123, addToCart: 78, wishlist: 45, purchases: 28 }
    },
    {
        id: 7,
        name: "Peacock Blue Lehenga",
        description: "Majestic lehenga in peacock blue with intricate embroidery. Perfect for weddings.",
        category: "Lehenga",
        price: 5999,
        originalPrice: 8500,
        images: ["https://images.unsplash.com/photo-1583391733975-b8c1b5b3a4cf?q=80&w=1887&auto=format&fit=crop"],
        variants: [
            { size: 'S', stock: 2, sku: 'RIV-PBL-S' },
            { size: 'M', stock: 1, sku: 'RIV-PBL-M' },
            { size: 'L', stock: 0, sku: 'RIV-PBL-L' }
        ],
        inStock: true,
        isNew: true,
        rating: 4.9,
        reviews: 267,
        collections: [],
        analytics: { views: 3456, addToCart: 234, wishlist: 145, purchases: 89 }
    },
    // Adding Long Kurti specifically for requirements
    {
        id: 8,
        name: "Maroon Long Kurti",
        description: "Floor length maroon kurti with gold foil print. Elegant and royal.",
        category: "Long Kurti",
        price: 2199,
        originalPrice: 3200,
        images: ["https://images.unsplash.com/photo-1583391733981-5ff4d0ae9c91?q=80&w=1887&auto=format&fit=crop"],
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
        collections: [],
        analytics: { views: 654, addToCart: 43, wishlist: 21, purchases: 12 }
    }
];

export const mockCollections = [
    {
        id: 1,
        name: "Summer Collection 2025",
        description: "Light and breezy ethnic wear perfect for summer festivities",
        heroImage: "https://images.unsplash.com/photo-1583391733958-e02376903394?q=80&w=2070&auto=format&fit=crop",
        productIds: [1, 5, 6],
        isActive: true,
        createdAt: new Date('2025-01-01')
    },
    {
        id: 2,
        name: "Wedding Collection",
        description: "Exquisite pieces for your special day",
        heroImage: "https://images.unsplash.com/photo-1583391733975-b8c1b5b3a4cf?q=80&w=1887&auto=format&fit=crop",
        productIds: [3, 4, 7],
        isActive: true,
        createdAt: new Date('2025-01-15')
    }
];

export const mockUsers = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@vrishtikalaa.com",
        password: "admin123", // In real app, this would be hashed
        role: "admin",
        phone: "+91 98765 43210",
        addresses: [],
        wishlist: [],
        cart: []
    }
];

export const mockSaleBanner = {
    id: 1,
    text: "🎉 SALE TODAY! Get 50% OFF on Selected Items - Limited Time Only!",
    backgroundColor: "#5e1e2d",
    textColor: "#ffffff",
    link: "/shop",
    enabled: true,
    countdown: {
        enabled: false,
        endDate: null
    }
};

export const mockBanners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1583391733958-e02376903394?q=80&w=2070&auto=format&fit=crop",
        title: "Modern Ethnic Wear",
        subtitle: "Discover our latest collection of contemporary kurtis",
        link: "/shop",
        enabled: true
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1583391733975-b8c1b5b3a4cf?q=80&w=1887&auto=format&fit=crop",
        title: "Festive Elegance",
        subtitle: "Shine bright this wedding season",
        link: "/collections",
        enabled: true
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1610030469450-40af9250af7a?q=80&w=2070&auto=format&fit=crop",
        title: "Premium Anarkalis",
        subtitle: "Flowy silhouettes for every occasion",
        link: "/shop?category=Anarkali",
        enabled: true
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1628143242630-9e6727284725?q=80&w=2070&auto=format&fit=crop",
        title: "Handcrafted Sarees",
        subtitle: "Timeless drapes for the modern woman",
        link: "/shop?category=Sarees",
        enabled: true
    }
];

export const mockOrders = [];
