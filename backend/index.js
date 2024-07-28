// Load environment variables
require('dotenv').config({ path: '../vars/.env' });

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { log } = require('console');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

// API routes
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Add product to database
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = (Number(last_product.id) + 1).toString();
        } else {
            id = "1";
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
        });
        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Creating API for deleting products
app.post('/removeproduct', async (req, res) => {
    try {
       // Find the product to get the image URL
        const product = await Product.findOne({ id: req.body.id });
        // Construct the image path
        const imagePath = path.join(__dirname, 'upload', 'images', path.basename(product.image));
        // Delete the image file
        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.error('Error deleting image:', err);
                return res.status(500).json({ success: false, message: 'Error deleting image' });
            }
            // Delete the product from the database
            await Product.findOneAndDelete({ id: req.body.id });
            res.json({ success: true });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Creating API for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Schema creating for user model
const Users = mongoose.model('Users', {
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});
// Creating endpoint for registering the user
app.post('/signup', async (req, res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"Existing user found with same email address"});
    }

    //If no user with same email, new user can register, so that create an empty cart 
    let cart = {};
    for(let i = 0; i<300; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    });

    //save user in the database
    await user.save();

    //JWT authentication
    const data = {
        user:{
            id:user.id
        }
    };
    //create token 
    const token = jwt.sign(data, 'gonutswithdonuts');
    res.json({success:true, token});
});
// Creating endpoint for user login
app.post('/login', async (req, res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const password = req.body.password === user.password;  
        if(password){
            const data = {
                user:{
                    id:user.id
                }
            };
            const token = jwt.sign(data, 'gonutswithdonuts');
            res.json({success:true, token});
        } 
        else{
            res.json({success:false, errors:"Incorrect Password"});
        } 
    }
    else{
        res.json({success:false, errors:"Incorrect e-mail id"});
    }
});

// Creating end point for latest items
app.get('/latest', async (req, res)=>{
    let products = await Product.find({});
    let latest = products.slice(1).slice(-8);
    console.log("Latest Carvings Fetched");
    res.send(latest);
});

// creating end point for popular
app.get('/popular', async(req, res)=>{
    let product1 = await Product.find({category:"donuts"});
    let popular_of_week = product1.slice(0,4);
    console.log("Popular of week fetched");
    res.send(popular_of_week);
});

//creating middleware to fetch user
const fetchUser = async (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try{
            const data = jwt.verify(token, 'gonutswithdonuts');
            req.user = data.user;
            next();
        }
        catch(error){
            res.status(401).send({errors:"Please authenticate using valid token"});
        }
    }
};

//creating end point for adding food in cart data
app.post('/addtocart',fetchUser, async (req, res)=>{
    console.log("added", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    res.send("Added");
});


//creating end point to remove food in cart data
app.post('/removefromcart',fetchUser, async (req, res)=>{
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
        res.send("Removed");
    }  
});


//creating endpoint for get cart data
app.post('/getcart', fetchUser, async(req, res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
});

// Schema creating for order model
const orderSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    items:{
        type:Array,
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    status:{
        type:String,
        default:"Food Processing"
    },
    payment:{
        type:Boolean,
        default:true
    },
    orderId:{
        type:Number,
        unique: true
    }
});

orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastOrder = await Order.findOne().sort({ orderId: -1 });
        this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

app.post('/placeorder', fetchUser, async (req, res) => {
    try {

        // Use the authenticated user's ID from the token
        const userId = req.user.id;
        const newOrder = new Order({
            userId: userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: req.body.payment,
        });
        await newOrder.save();

        // To clear cart data for the authenticated user
        await Users.findOneAndUpdate({_id: userId}, {cartData: {}});
        res.json({success: true, message: "Order placed successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error placing order"});
    }
});
//list orders endpoint creation
app.get('/vieworders', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
});

//Load orders to frontend
app.get('/myorders', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        // Find orders for the user and sort by orderId in descending order
        const orders = await Order.find({ userId: userId }).sort({ orderId: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error retrieving orders" });
    }
});


// order status changing API Endpoint
app.post('/status', async(req, res)=>{
    try{
        await Order.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status Updated"});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }

})





const messageSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Message = mongoose.model('Message', messageSchema);


// Contact form endpoint
app.post('/contact', fetchUser, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.user.id;

    const newMessage = new Message({
      userId,
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});



//list messages endpoint creation
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.json({ success: true, data: messages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
});



app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
