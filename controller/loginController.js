const mongoose = require("mongoose");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { response } = require("express");

// register logic

exports.registerDonor = async (req, res) => {
  if (secretkey !==process.env.secretkey){
    return res.status(401).json({ message: "Unauthorized account creation" });
  }

  // check if the user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "email already exists" });
  }
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create a new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    address,
    role: "donor",
  });
  // save the user
  await user.save();
  // return a success message
  res.status(201).json({ message: "User created successfully" });
  };

  // login logic
  exports.loginDonor = async (req, res) => {
    const {email,password}=req.body;

    if(!User){
      return res.status(404).json({ message: "User not found" });
    }
    // check if the user is active
    if (!User.active) {
      return res.status(400).json({ message: "User is not active" });
      }
      // check if the password is correct
      const isValidPassword = await bcrypt.compare(password, User.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password" });
        }
        // generate a token
        const token = jwt.sign({ userId: User._id,role:User.role }, 
          process.env.JWT_SECRET, {
          expiresIn: "1h",
          }
        
        );
        // return the token
        response.json({
          message: "login successful",
          token,
          user: {
            name: User.name,
            email: User.email,
            address: User.address,
            role: User.role,
          },
        });
  }








