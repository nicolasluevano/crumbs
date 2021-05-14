const Post = require('../models/Post')

module.exports = {
    getProfile: async (req,res)=>{
        try{
            const posts = await Post.find({user:req.user.id})
            res.render('profile.ejs', {posts: posts, user: req.user})
        }catch(err){
            console.log(err)
        }
    }
}
