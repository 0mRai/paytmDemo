const express=require('express');
const app=express();
const router = express.Router();
const zod=require('zod');
const { User }=require('../db');
const jwt=require('jsonwebtoken');
const JWT_SECRET = require('../config');
const  { authMiddleware } = require("../middleware");

const signupSchema=zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.post('/signup', async(req, res)=>{
    const body=req.body;
    const {success}= signupSchema.safeParse(req.body);
    if(!success)
    {
        return res.status(411).json({
            message: "Email already taken / Incorrect output"
        })
    }

    const user=User.findOne({
        username: body.username
    })

    if(user._id)
    {
        return res.status(411).json({
            message: "Email already taken / Incorrect output"
        })
    }

    const dbUser = await User.create(body);

    // const dbUserId=dbUser._id;
    const token=jwt.sign({
        // dbUserId
        userId: dbUser._id
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
});

const updateBody= zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})
router.put('/', authMiddleware, async(req, res)=>{
    const request=updateBody.safeParse(req.body);
    if(!request.success)
    {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    // doubt
    await User.update({_id: req.userId}, req.body);
    res.json({
        message: "Updated Successfully"
    })
})

router.get('/bulk', async(req, res)=>{
    const filter=req.query.filter || "";

    const users= await User.find({
        $or: [{
            firstName:{
                "$regex": filter
            }
         },{
            lastName:{
                "$regex": filter
            }
        }]
    })
    
    res.json({
        user: users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports= router;

