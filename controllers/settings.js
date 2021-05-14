const User = require('../models/User')
const validator = require("validator");

module.exports = {
  getSettings: async (req,res)=>{
    try{
      res.render('settings.ejs', {user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  changeUserName: async (req,res)=>{
    try{
      await User.findOneAndUpdate({_id: req.user.id},
        {$set: {userName : req.body.newUserName}})
        res.redirect('back')
      }catch(err){
        console.log(err)
      }
    },
    changeUserEmail: async (req,res)=>{
      try{
        const validationErrors = [];
        if (!validator.isEmail(req.body.newUserEmail))
          validationErrors.push({ msg: "Please enter a valid email address." });
        if (validationErrors.length) {
          req.flash("errors", validationErrors);
          return res.redirect("back");
        }

        await User.findOneAndUpdate({_id: req.user.id},
          {$set: {email : req.body.newUserEmail}})
          res.redirect('back')
        }catch(err){
          console.log(err)
        }
      },
    }
