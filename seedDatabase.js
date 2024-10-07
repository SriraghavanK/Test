const mongoose = require("mongoose");
const MenuItem = require("./server/models/MenuItem");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.log("MongoDB connection error:", err));

const menuItems = [
  {
    name: "Pizza",
    description: "Delicious pizza with various toppings",
    price: 12.99,
    image:"https://images6.alphacoders.com/609/thumb-1920-609345.jpg"
  },
  {
    name: "Burger",
    description: "Juicy burger with fresh vegetables",
    price: 8.99,
    image:"https://e1.pxfuel.com/desktop-wallpaper/961/317/desktop-wallpaper-roasted-vegetable-burger-recipe-with-hummus-by-archana-s-kitchen-veggie-burger.jpg"
  },
  { name: "Salad",
    description: "Fresh and healthy salad", 
    price: 6.99,
    image:"https://wallpaperaccess.com/full/1370547.jpg" 
  },
  { name:"Veg Roll",
    description:"Super Delicious Veg Roll",
    price:10.99,
    image:"https://i.ytimg.com/vi/kUaGj-IwUtA/maxresdefault.jpg"
},
];

const seedDatabase = async () => {
  try {
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
