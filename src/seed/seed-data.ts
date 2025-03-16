import { SeedProduct } from '../interfaces';

export const initialData: { products: SeedProduct[] } = {
  products: [
    {
      title: "Men's Classic White T-Shirt",
      description: "Essential cotton t-shirt perfect for everyday wear. Features a comfortable fit and durable fabric.",
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 50,
      price: 29.99,
      sizes: ['S', 'M', 'L', 'XL'],
      slug: 'mens-classic-white-tshirt',
      tags: ['t-shirt', 'basic', 'cotton', 'casual'],
      type: 'shirt',
      gender: 'men'
    },
    {
      title: "Women's Slim Fit Jeans",
      description: "High-waisted slim fit jeans with stretch comfort. Modern design with classic 5-pocket styling.",
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 35,
      price: 59.99,
      sizes: ['XS', 'S', 'M', 'L'],
      slug: 'womens-slim-fit-jeans',
      tags: ['jeans', 'denim', 'slim-fit', 'high-waisted'],
      type: 'pants',
      gender: 'women'
    },
    {
      title: "Unisex Running Shoes",
      description: "Lightweight and breathable running shoes with superior cushioning. Perfect for daily runs and training.",
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 25,
      price: 89.99,
      sizes: ['M', 'L', 'XL'],
      slug: 'unisex-running-shoes',
      tags: ['shoes', 'running', 'sports', 'athletic'],
      type: 'shoes',
      gender: 'unisex'
    },
    {
      title: "Kids' Dinosaur Print T-Shirt",
      description: "Fun and colorful dinosaur print t-shirt made from soft cotton. Perfect for playtime and casual wear.",
      images: [
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519278409-1f56fdda7485?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 40,
      price: 19.99,
      sizes: ['XS', 'S', 'M'],
      slug: 'kids-dinosaur-print-tshirt',
      tags: ['kids', 't-shirt', 'dinosaur', 'casual'],
      type: 'shirt',
      gender: 'kid'
    },
    {
      title: "Women's Summer Dress",
      description: "Floral print summer dress with a flattering fit. Made from lightweight and breathable fabric.",
      images: [
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 30,
      price: 49.99,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      slug: 'womens-summer-dress',
      tags: ['dress', 'summer', 'floral', 'casual'],
      type: 'shirt',
      gender: 'women'
    },
    {
      title: "Men's Leather Belt",
      description: "Classic leather belt with silver-tone buckle. Perfect for both casual and formal wear.",
      images: [
        'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613431812949-77b3351af049?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 45,
      price: 34.99,
      sizes: ['M', 'L', 'XL'],
      slug: 'mens-leather-belt',
      tags: ['belt', 'leather', 'accessory', 'formal'],
      type: 'accessory',
      gender: 'men'
    },
    {
      title: "Unisex Winter Beanie",
      description: "Warm and comfortable wool beanie. Perfect for cold weather and casual styling.",
      images: [
        'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511500118080-275313ec90a1?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532073150508-0c1df022bdd1?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 60,
      price: 24.99,
      sizes: ['M', 'L'],
      slug: 'unisex-winter-beanie',
      tags: ['beanie', 'wool', 'winter', 'accessory'],
      type: 'accessory',
      gender: 'unisex'
    },
    {
      title: "Men's Cargo Pants",
      description: "Durable cargo pants with multiple pockets. Perfect for outdoor activities and casual wear.",
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1638394440667-aa54a7c0a703?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 40,
      price: 69.99,
      sizes: ['M', 'L', 'XL', 'XXL'],
      slug: 'mens-cargo-pants',
      tags: ['pants', 'cargo', 'outdoor', 'casual'],
      type: 'pants',
      gender: 'men'
    },
    {
      title: "Kids' Colorful Sneakers",
      description: "Fun and comfortable sneakers. Durable construction perfect for active kids.",
      images: [
        'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 25,
      price: 44.99,
      sizes: ['S', 'M', 'L'],
      slug: 'kids-colorful-sneakers',
      tags: ['shoes', 'kids', 'sneakers', 'colorful'],
      type: 'shoes',
      gender: 'kid'
    },
    {
      title: "Women's Yoga Pants",
      description: "High-waisted yoga pants with four-way stretch. Perfect for yoga, gym, or casual wear.",
      images: [
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548663390-28c93deeka45?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1604644401890-0bd678c83788?q=80&w=1000&auto=format&fit=crop',
      ],
      inStock: 55,
      price: 54.99,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      slug: 'womens-yoga-pants',
      tags: ['pants', 'yoga', 'athletic', 'stretchy'],
      type: 'pants',
      gender: 'women'
    }
  ]
}; 