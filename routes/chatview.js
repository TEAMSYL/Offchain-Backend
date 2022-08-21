const express = require('express')
const { isLoggedIn } = require("./middlewares");
const Chatcontent = require("../models/chatcontent");
const { Op } = require('sequelize');
const router = express.Router();

router.get('/chatview', async (req, res) => {
    try{
        const chatcontents = await Chatcontent.findAll({
        where:{
            id: req.query.room
        }
      })
      console.log(chatcontents)
    if(chatcontents) res.send(chatcontents);
    }catch (error){
        console.log(error);
        next(error);
        }
    })


module.exports = router