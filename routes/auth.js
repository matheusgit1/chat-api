const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const transport = require("../utils/transporter")
const mailConfig = require("../utils/mailConfig.json")
const {verifyToken} = require("./verifyToken")
router.get("/test", async (req, res)=>{
  return res.status(200).json({ok:true})
})

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if(req.body.password != req.body.confirmPassword){
      return res.status(401).json({error:"password do not match"})
    }
    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json({error: null, msg: "user created"});
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({ email: email });
    if(!user){return res.status(404).json({error: "user not found"});}
    
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){return  res.status(400).json("wrong password") }

    const acessToken = await jwt.sign({
      id: user?._id,
      email: user?.email
    },process.env.JWT_SEC,{expiresIn: '7d'})

    const newUser = await User.findOne({ email: email },{password: 0});

    return res.status(200).json({user: newUser, acessToken: acessToken})
  } catch (error) {
    return res.status(401).json({error})
  }
});

//DELETE password

router.delete("/delete/:id", verifyToken, async (req, res)=>{
  try{
    const {id} = req.params;
    const {password} = req.body;

    const user = await User.findById(id);
    if(!user){return res.status(404).json({error: "user not found"});}
    
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){return  res.status(400).json("wrong password") }
    if(req.user.id != id){return  res.status(401).json({error: "you don't have permission for that"})}

    await User.findByIdAndDelete(id)
    return res.status(200).json({error: null, msg:"user deleted successfully"})
  }catch(error){
    return res.status(401).json({error})
  }
})

//RESET PASSWORD

router.put("/reset-password", verifyToken, async (req, res)=>{
  try{
    const {email} = req.body

    const user = await User.findOne({"email": email})
     
    if (!user) {
      return res.status(401).json("Wrong email");
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex")
    const now = new Date();
    now.setHours(now.getHours() + 1)

    const updatedUser = await User.findOneAndUpdate({email: email},{ passwordResetToken: resetPasswordToken, resetPasswordExpires: now})

    const info = await transport.sendMail({
      from: mailConfig.from, // sender address
      to: updatedUser.email, // list of receivers
      subject: "RECUPERAÇÃO DE SENHA ", // Subject line
      text: `acesse http://localhost:3333/api/auth/change-password/${resetPasswordToken} para redefinir sua senha`, // plain text body
      html: `acesse este <a href="http://localhost:3333/api/auth/change-password/${resetPasswordToken}">link</a> para reconfigurar sua senha` // html body
    });
   

    return res.status(200).json({error: null, msg:"we send a password recovery email"})

  }catch(error){
    return res.status(401).json({error})
  }
})

router.put("/change-password/:resetToken", async (req, res)=>{
  try{
    const {email, password, confirmPassword} = req.body;
    const {resetToken} = req.params;

    const user = await User.findOne({ "email": email})
    console.log(user)
    if (!user) {
      return res.status(401).json("Wrong email");
    }

    if(resetToken != user.resetPasswordToken){
      return res.status(401).json("invalid token");
    }

    const now = new Date()
    if(now > user.resetPasswordExpires){
      return res.status(401).json("expired token");
    }

    if(password != confirmPassword){
      return res.status(401).json({ error: "passwords do not match" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await User.findOneAndUpdate({"email": email},{password: hashedPassword})
    return res.status(200).json({ error: null, msg:"password updated successfully"});
  }catch(error){
    return res.status(401).json({error});
  }
})




module.exports = router;
