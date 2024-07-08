import express,{Request,Response} from "express"
const app = express()
const port = 3000

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { details } from "@prisma/client";

import { generateToken } from "./utils/jwt"
import { authenticateJWT } from "./middlewares/auth"

import cors from 'cors'
app.use(cors())

app.use(express.json())

interface User{
    email : string,
    name  : string,
    password : string
}


app.get('/users',async(req:Request,res:Response)=>{
    const allUsers = await prisma.details.findMany();
    res.send(allUsers)
})


app.post('/signup',async (req:Request,res:Response)=>{
    const {email,name,password} = req.body;
    const ifExist : User | null= await prisma.details.findUnique({
        where : {
            email 
        }
    })
    if(ifExist == null){
        try{
            const createdUser : User = await prisma.details.create({
                data : {
                   email,
                   name,
                   password
                }
              })
         res.status(201).json({ "msg": "user created"})
        }
        catch(error){
            res.json({ "msg": error})
        }
    }
    else{
        res.json({
            "msg" : "User already exist try with another email"
        })
    }
})



app.post('/login',async(req:Request,res:Response)=>{
    const {email,password} = req.body
    try{
        const user : User | null = await prisma.details.findUnique({
            where : { email }
        })
        
        if(!user){
            res.status(404).json({"msg":"User not found Please sign up !"})
        }
        else{
            if (password == user.password){
                const name = user.name
               const token = generateToken({name})
               res.status(200).json({token})
            }
            else{
                res.status(401).json({
                    "msg" : "Wrong Password"
                })
            }
        }
    }
    catch(error){
        res.status(500).json({"msg":error})
    }
})


app.get('/protected',authenticateJWT,(req: Request, res: Response) => {
    const user = req.user
    res.status(200).json({"msg" : user.name });
  });


app.listen(3000,()=>{
    console.log("Server is running");
    
})