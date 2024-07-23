import { Request, Response } from "express";
import UserModel from "../models/userModel";
import UrlModel from "../models/urlModel";
import upload from "../utils/cloudinaryUpload";
import ClicksModel from "../models/clicksModel";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

const generateToken = (user: any) => {
  
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await UserModel.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
   
    const user = new UserModel({ name, email, password });
    
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
   
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
async function CreateLink(req: Request, res: Response) {
  try {
    const { user_id, original_url, custom_url, title } = req.body;
    const short_url = uuidv4();

    // let qrCodeUrl = '';

    // if (req.file) {
    //   const result = await upload(req.file.path, "Shortrr/qrCodes");
    //   qrCodeUrl = result.secure_url;
    // }

    const urlData = new UrlModel({
      user_id,
      original_url,
      short_url,
      custom_url: custom_url + Math.floor(Math.random() * 1000),
      title,
      // qrCode: qrCodeUrl,
    });

    const url = await urlData.save();

    if (url) {
      res.json({
        status: 200,
        success: true,
        message: "Successfully Created",
        data: url,
      });
    } else {
      res.status(400).json({
        status: 400,
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Server error",
    });
  }
}
async function fetchUrls(req: Request, res: Response) {
  try {
    console.log("initital geting", req.params.id);
    const urlsData = await UrlModel.find({ user_id: req.params.id });
    res.json({
      status: 200,
      success: true,
      data: urlsData,
    });
  } catch (error: any) {
    console.log(error.message);
  }
}
async function deleteLink(req: Request, res: Response) {
  try {
    await UrlModel.deleteOne({ _id: req.body.urlId });
    await ClicksModel.deleteMany({ url_id: req.body.urlId });
    res.json({
      status: 200,
      success: true,
    });
  } catch (error: any) {
    console.log(error.message);
  }
}
async function getLongUrl(req: Request, res: Response) {
  try {
    console.log("Request body:", req.body);

    const url = await UrlModel.findOne({
      $or: [
        { short_url: req.params.shortUrl },
        { custom_url: req.params.shortUrl },
      ],
    });

    console.log("Found URL data:", url);

    if (!url) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "URL not found",
      });
    }

    res.json({
      status: 200,
      success: true,
      urlData: url,
    });
  } catch (error: any) {
    console.error("Error in getLongUrl:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while retrieving the URL",
      error: error.message,
    });
  }
}

async function clicksCreate(req: Request, res: Response) {
  try {
    console.log("initital geting", req.body);
    const urlsData = await ClicksModel.create(req.body);
    res.json({
      status: 200,
      success: true,
      data: urlsData,
    });
  } catch (error: any) {
    console.log(error.message);
  }
}

export const fetchLinkData = async (req: Request, res: Response) => {
  try {
    
    const urlsData = await UrlModel.findOne({
      _id: req.params.id,
      user_id: req.params.userId,
    });
    res.json({
      status: 200,
      success: true,
      data: urlsData,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const fetchClicksForUrl = async (req: Request, res: Response) => {
  try {
   
    const urlsData = await ClicksModel.find({ url_id: req.params.id });
    res.json({
      status: 200,
      success: true,
      data: urlsData,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const totalClicksData = async (req: Request, res: Response) => {
  try {
    console.log("initital geting");
    const urlsData = await ClicksModel.find().countDocuments();
    res.json({
      status: 200,
      success: true,
      data: urlsData,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export {
 
  CreateLink,
  fetchUrls,
  deleteLink,
  getLongUrl,
  clicksCreate,
};
