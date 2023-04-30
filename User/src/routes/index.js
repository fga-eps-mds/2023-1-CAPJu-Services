import express from "express";
import userRouter from "./user.js";

const applicationRoutes = express.Router()

applicationRoutes.get('/', (req, res) => {
  res.send('CAPJu Online!')
})

applicationRoutes.use('/users', userRouter)

export default applicationRoutes;
