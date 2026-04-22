const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/productModel')
const User = require('./models/userModel')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const products = [
  { name: 'iPhone 15 Pro', brand: 'Apple', category: 'Phones', price: 999, countInStock: 10, rating: 4.5, numReviews: 12, description: 'Latest iPhone with titanium design and A17 Pro chip.', image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=400&hei=400&fmt=jpeg' },  { name: 'Samsung Galaxy S24', brand: 'Samsung', category: 'Phones', price: 799, countInStock: 7, rating: 4.2, numReviews: 8, description: 'Flagship Android phone with Galaxy AI features.', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400' },
  { name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Audio', price: 349, countInStock: 15, rating: 4.8, numReviews: 24, description: 'Industry-leading noise cancelling wireless headphones.', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400' },
  { name: 'MacBook Air M2', brand: 'Apple', category: 'Laptops', price: 1099, countInStock: 5, rating: 4.9, numReviews: 18, description: 'Supercharged by M2 chip. Strikingly thin design.', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400' },
  { name: 'iPad Pro 12.9"', brand: 'Apple', category: 'Tablets', price: 1099, countInStock: 8, rating: 4.7, numReviews: 14, description: 'Ultimate iPad experience with M2 chip and Liquid Retina XDR display.', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
  { name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'Accessories', price: 99, countInStock: 20, rating: 4.6, numReviews: 31, description: 'Advanced wireless mouse for precision work.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
]

const importData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()

    // Create users one by one so the pre('save') hook hashes the password
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopwave.com',
      password: 'admin123',
      isAdmin: true,
    })

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'john123',
    })

    const sampleProducts = products.map((p) => ({ ...p, user: adminUser._id }))
    await Product.insertMany(sampleProducts)

    console.log('Data imported successfully!')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

importData()