const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Use environment variable directly or load from a configuration file
const secretKey = process.env.TOKEN_KEY;

const createUser = async (req, res) => {
  const { name, regno, program, cgpa, image, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      regno,
      program,
      cgpa,
      image,
      email,
      password,
    });

    // Generate token upon successful registration
    const token = jwt.sign({ user_id: user._id }, secretKey, {
      expiresIn: "1h",
    });

    console.log("User registered successfully:", user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", { email, password });

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }
    console.log("Secret key of signinig", secretKey);
    // Generate token upon successful login
    const token = jwt.sign({ user_id: user._id }, secretKey, {
      expiresIn: "1h",
    });

    console.log("Login successful!");
    console.log(token);
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    // console.log("near getUser");
    const user = await User.findById(req.user_id);
    // console.log("users data", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user-specific data
    res.status(200).json({ user });
  } catch (error) {
    // console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const testUser = async (req, res) => {
  try {
    res.send({ status: true, data: "secret data!!!!" });
  } catch (error) {
    // console.error("Error fetching user data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserData,
  testUser,
};
