const router = require("express").Router();
const Conversation = require("../models/Conversation");
const { verifyToken } = require("./verifyToken")


//new conv
router.post("/", verifyToken, async (req, res) => {
  
  try {
    const {name, membersId} = req.body
    if(membersId.lenght > 2 && !name){
      return res.status(200).json({error: "you cannot create a group without a name"});
    }
    if(!membersId.includes(req.user.id)){
      return res.status(200).json({error: "you can't create a group without you"});
    }
    const newConversation = new Conversation({
      name: name,
      members: membersId,
    });

    const savedConversation = await newConversation.save();
    return res.status(200).json({error: null, savedConversation, savedConversation});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get("/:id", verifyToken, async (req, res) => {
  try {
    if(req.params.id != req.user.id){
      return res.status(401).json({erro: "you don't have permission for that"});
    }
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).json({error: null, conversation: conversation });
  } catch (error) {
    res.status(500).json({error});
  }
});

// get conv includes two userId
router.get("/find/:id/:secondUserId", verifyToken,async (req, res) => {
  try {
    if(req.params.id != req.user.id){
      return res.status(401).json({erro: "you don't have permission for that"});
    }
    const conversation = await Conversation.find({
      members: { $all: [req.params.id, req.params.secondUserId] },
    });
    return res.status(200).json({error: null, conversation: conversation})
  } catch (error) {
    return res.status(500).json({error});
  }
})
//delete a conversation
router.delete("/delete/:id/:cvs_id", verifyToken, async (req, res)=>{
  try{
    if(req.params.id != req.user.id){
      return res.status(401).json({erro: "you don't have permission for that"});
    }

    const conversation = await Conversation.findByIdAndUpdate(req.params.cvs_id,{
      $pull: { members: req.params.id}
    });
    const newConversation = await Conversation.findById(req.params.cvs_id)

    return res.status(200).json({error: null, conversation: newConversation})

  }catch(error){
    return res.status(401).json({error});
  }
})

module.exports = router;
