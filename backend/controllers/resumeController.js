import Resume from "../models/Resume.js";
import imageKit from "../configs/imageKit.js";
import fs from 'fs'

// controller for Creating a New Resume
// POST :/api/resumes/create

export const createResume = async(req, res) =>{
    try{
     const userId = req.userId;
     const {title} = req.body;

     // create new resume
     const newResume = await Resume.create({userId, title})
     // return succcess message
     return res.status(201).json({message: "resume created succesfuly" , resume :newResume})
    }

    catch(error){
        return res.status(400).json({message: error.message})
    }
}



// controller for deleting a New Resume
// DELETE :/api/resumes/delete


export const deleteResume = async(req, res) =>{
    try{
     const userId = req.userId;
     const {resumeId} = req.params;

     
      await Resume.findOneAndDelete({userId , _id: resumeId})


     // return succcess message
     return res.status(200).json({message: "Resume deleted succesfuly"})
    }

    catch(error){
        return res.status(400).json({message: error.message})
    }
}



// controller to get user Resume by id 
// GET :/api/resumes/get


export const getResumeById = async(req, res) =>{
    try{
     const userId = req.userId;
     const {resumeId} = req.params;

     
     const resume = await Resume.findOne({userId , _id: resumeId})

    if(!resume) {
        return res.status(404).json({message : "resume not found"})
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updateAt = undefined;

     // return succcess message
     return res.status(200).json({resume})
    }

    catch(error){
        return res.status(400).json({message: error.message})
    }
}



// controller to get  Resume by id public
// GET :/api/resumes/public


export const getPublicResumeById = async(req, res) =>{
    try{
     const {resumeId} = req.params;
     const resume = await Resume.findOne({public :true , _id: resumeId})

    if(!resume) {
        return res.status(404).json({message : "resume not found"})
    }
     // return succcess message
     return res.status(200).json({resume})
    }

    catch(error){
        return res.status(400).json({message: error.message})
    }
}



// controller to Update  Resume by id
// PUT :/api/resumes/update


export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    if (!resumeId || !resumeData) {
      return res.status(400).json({
        message: "Resume ID and resume data are required",
      });
    }

    // Convert resumeData string into an object
    const resumeDataCopy =
      typeof resumeData === "string"
        ? JSON.parse(resumeData)
        : { ...resumeData };

    // Upload image if provided
if (image) {
  try {
    const imageBufferData = fs.createReadStream(image.path);

    const response = await imageKit.files.upload({
      file: imageBufferData,
      fileName: image.originalname || "resume.png",
      folder: "user-resumes",
      transformation: {
        pre:
          "w-300,h-300,fo-face,z-0.75" +
          (removeBackground === "yes" ? ",e-bgremove" : ""),
      },
    });

    resumeDataCopy.personal_info = {
      ...resumeDataCopy.personal_info,
      image: response.url,
    };
  } catch (uploadError) {
    console.error("ImageKit upload error:", uploadError);
    throw uploadError;
  }
}

    // Update resume in MongoDB
    const resume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataCopy },
      { returnDocument: "after", runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};