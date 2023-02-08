require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');
const jsonProduct = require('./products.json');

const start=async ()=>{
try {
    await connectDB(process.env.MONGO_URI);
    //deleting all the previous products to start from scratch
    await Product.deleteMany();
    // move the fresh products into the database
    await Product.create(jsonProduct);
    console.log('success');
    // to show success 0 and otherwise 1 
    //to exit the process
    process.exit(0);
} catch (error) {
    console.log(error);
    process.exit(1);
}
}
start();