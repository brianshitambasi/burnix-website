const { User } = require("../model/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// register login
exports.registerAdmin= async (req, res)
const{name,email,password,secretkey}=req.body;
// verify admins secretkey
if(secretkey!==process.env.secretkey){
  return res.status(401).json({message:"Invalid secret key"});
}
//check if the user exists
const user=await User.findOne({ email });
if (user) {
   res.json({ message: "User already exists and email taken" });
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role:"admin"
    });
    // save user
    await newUser.save();
    res.json({ message: "user created successfully",user });

    //login
    exports.login= async (req, res) => {
      const { email, password } = req.body;
      // check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
        }
        // compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ message: "Invalid email or password" });
          }
          // generate token
          const token = jwt.sign({ userId: user._id }, process.env.secretkey, {
            expiresIn: "1h",
            });
            res.json({ message: "Logged in successfully", 
              token,
              user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
              }
             });
            }
            
    

    
    