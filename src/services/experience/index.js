const express = require("express")
const multer = require("multer")
const path =require("path")
const fs =require("fs-extra")
const ExperienceSchema = require("./schema")
const json2csv = require('json2csv');

const experienceRouter = express.Router()
const imagePath = path.join(__dirname, "../../../public/images/experience");
console.log(imagePath)
const upload = multer({});

experienceRouter.get("/", async (req, res, next) => {
  try {
    const experience = await ExperienceSchema.find(req.query)
    res.send(experience)
  } catch (error) {
    next(error)
  }
})

experienceRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const experience = await ExperienceSchema.findById(id)
    if (experience) {
      res.send(experience)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading experience list a problem occurred!")
  }
})

experienceRouter.post("/",
 async (req, res, next) => {
  try {
   
    const newExperience = new ExperienceSchema(req.body)
     const { _id } = await newExperience.save()
     res.status(201).send(_id)
     
     
   } catch (error) {
     next(error)
   }
})

experienceRouter.post("/csv", async (req, res, next) => {
  try {
   
    const newExperience = new ExperienceSchema(req.body)
     const { _id } = await newExperience.save()
     //res.status(201).send(_id)
     
     const json2csv = new Transform( {fields:['_id', 'role', 'company', 'startDate', 'endDate', 'description', 'area','username','image', 'createdAt','updatedAt']})
    
     const data =json2csv({data: newExperience, fields: fields, fieldNames: fieldNames}) 
     res.attachment('filename.csv');
     res.status(200).send(data);
   } catch (error) {
     next(error)
   }
})


experienceRouter.post("/:id/upload", upload.single("experience"), async (req, res, next) => {
  try {
    await fs.writeFile(path.join(imagePath, `${req.params.id}.png`), req.file.buffer)
    req.body = {
      image: `https://linkedln-backend.herokuapp.com/images/experience${req.params.id}.png`
    }
    
    const post =await ExperienceSchema.findByIdAndUpdate(req.params.id, req.body)
    if(post){
        res.send("image uploaded")
    }
    
  } catch (error) {
    next(error)
  }
})
 
experienceRouter.put("/:id", async (req, res, next) => {
  try {
    const experience = await ExperienceSchema.findByIdAndUpdate(req.params.id, req.body)
    console.log(experience)
    if (experience) {
      res.send("Ok")
    } else {
      const error = new Error(`Experience with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

experienceRouter.delete("/:id", async (req, res, next) => {
  try {
    const experience = await ExperienceSchema.findByIdAndDelete(req.params.id)
    if (experience) {
      res.send("Deleted")
    } else {
      const error = new Error(`Experience with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = experienceRouter
