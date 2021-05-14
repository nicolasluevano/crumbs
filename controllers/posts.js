const Post = require('../models/Post')
const User = require('../models/User')
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getFeed: async (req,res)=>{
    try{
      const posts = await Post.find()
      .sort({ createdAt: 'desc' })
      .lean()
      var users = []
      for(i in posts){
        var user = await User.findById(posts[i].user)
        users.push(user.userName)
    }  
      res.render('feed.ejs', {posts: posts, userName: users,user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  getPost: async (req,res)=>{
    try{
      const post = await Post.findById(req.params.id)
      res.render('post.ejs', {post: post, user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  createPost: async (req, res)=>{
    let result = ''
    try{
      result = await cloudinary.uploader.upload(req.file.path);
    }catch(err){
      console.log("No Image")
    }
    try{
      await Post.create({
        crumb: req.body.crumb,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        likes: 0,
        user: req.user.id
      })

      console.log('Post has been added!')
      res.redirect('/profile')
    }catch(err){
      console.log(err)
      res.redirect('/profile')
    }
  },
  likePost: async (req, res)=>{
    var liked = false
    try{
      var post = await Post.findById({_id:req.params.id})
      liked = (post.likes.includes(req.user.id))
    } catch(err){
    }
    //if already liked we will remove user from likes array
    if(liked){
      try{
        await Post.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'likes' : req.user.id}
          })
          
          console.log('Removed user from likes array')
          res.redirect('back')
        }catch(err){
          console.log(err)
        }
      }
      //else add user to like array
      else{
        try{
          await Post.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'likes' : req.user.id}
            })
            
            console.log('Added user to likes array')
            res.redirect(`back`)
        }catch(err){
            console.log(err)
        }
      }
    },
    deletePost: async (req, res) => {
      try {
        // Find post by id
        let post = await Post.findById({ _id: req.params.id });
        // Delete image from cloudinary
        try{
          await cloudinary.uploader.destroy(post.cloudinaryId);
        } catch(err){
        }
        // Delete post from db
        await Post.remove({ _id: req.params.id });
        console.log("Deleted Post");
        res.redirect("/profile");
      } catch (err) {
        res.redirect("/profile");
      }
    },
  }
