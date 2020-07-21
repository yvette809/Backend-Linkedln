const express = require ("express")
const ProfilesModel = require("./schema")
const q2m = require("query-to-mongo")

const profileRouter = express.Router()

// get profiles

profileRouter.get("/", async(req,res,next)=>{
    try{
        const profiles = await ProfilesModel.find(req.query)
        res.status(200).send(profiles)

    }catch(error){
        next(error)
    }
})

// get profiles with pagination, filter
profileRouter.get("/", async(req,res,next)=>{
    try{
        const query = q2m(req.query);
        const profiles = await ProfilesModel
        .find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)
        res.send({
            data:profiles,
            total:profiles.length
        })

    }catch(error){
        next(error)
    }
})

// get profile with username
profileRouter.get("/:username", async(req,res,next)=>{
    try{
        const username = req.params.username
        const profile = await ProfilesModel.findOne({username:username})
        if(profile){
            res.send(profile)
        }else{
            const error = new Error()
            error.httpstatusCode =404
            next(error)
        }
    }catch(error){
        next(error)
    }
    
})

// create a new profile
profileRouter.post("/", async(req,res,next)=>{
    try{
        const newProfile = new ProfilesModel(req.body)
        const response = await newProfile.save()
        res.status(201).send(response)

    }catch(error){
        next(error)
    }
})

// update a new profile
profileRouter.put("/:id", async(req,res,next)=>{
    try{
        const updatedProfile = await ProfilesModel.findByIdAndUpdate(req.params.id,req.body );
        if(updatedProfile){
            res.send(updatedProfile)
        }else{
            const error = new Error(`profile with id ${req.params.id}not found`)
            error.httpstatusCode = 404
            next(error)
        }

    }catch(error){
        next(error)
    }
})

// delete aa profile
profileRouter.delete("/:id", async(req,res,next)=>{
    try{
        const profile= await ProfilesModel.findByIdAndDelete(req.params.id)
        if(profile){
            res.send("deleted")
        }else{
            const error = new Error("profile with id${req.params.id} not found")
            error.httpstatusCode=404
            next(error)
        }
    }catch(error){
        next(error)
    }
})

module.exports = profileRouter;