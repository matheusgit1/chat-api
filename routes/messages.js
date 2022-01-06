const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation")
const { verifyToken } = require("./verifyToken")

//add
router.post("/", verifyToken, async (req, res) => {
  
  try {
    const {conversationId, sender, text} = req.body
    const chat = await Conversation.findById(conversationId)
    console.log(chat)
    if(!chat.members.includes(req.user.id)){
      return res.status(401).json({erro: "you don't have permission for that"});
    }
    await Message.create({
      conversationId: conversationId,
      sender: sender,
      text: text
    })

    const messages = await  Message.find({conversationId: conversationId}).sort({'createdAt':1})
    return res.status(200).json({error: null, msg: "message sended"});
  } catch (error) {
    res.status(500).json({error});
  }
});

//get

router.get("/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json({messages: messages});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
