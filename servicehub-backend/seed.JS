require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const ServiceProvider = require("./models/ServiceProvider");
const Services = require("./models/Services");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Services.deleteMany();
    await ServiceProvider.deleteMany();

    const services = await Services.insertMany([
      { name: "Plumbing", description: "Fix leaks, pipes, taps" },
      {
        name: "Electrical",
        description: "Home & office wiring, appliances repair",
      },
      { name: "Cleaning", description: "Home & office cleaning services" },
      { name: "Gardening", description: "Lawn care & garden maintenance" },
      { name: "Tutoring", description: "Math, Science, Coding lessons" },
    ]);

    const users = await User.insertMany([
      {
        name: "Alice",
        email: "alice@example.com",
        password: "123456",
        role: "user",
      },
      {
        name: "Bob",
        email: "bob@example.com",
        password: "123456",
        role: "provider",
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password: "123456",
        role: "provider",
      },
      {
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      },
    ]);

    const providers = await ServiceProvider.insertMany([
      {
        user: users[1]._id,
        services: [services[0]._id, services[1]._id],
        experience: 5,
        avgRating: 4.5,
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        user: users[2]._id,
        services: [services[2]._id, services[3]._id],
        experience: 3,
        avgRating: 4.8,
        photo: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ]);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
