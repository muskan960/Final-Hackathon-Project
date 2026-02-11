
import sql from "../configs/db.js";
import OpenAI from "openai";
import { clerkClient } from '@clerk/express';
import axios from "axios";
import FormData from "form-data";
import { v2 as cloudinary } from "cloudinary";



const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth(); // agar auth middleware ne set kiya ho
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: 'Limit reached. Upgrade to continue.' });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt, }],
      temperature: 0.7,
      max_tokens: Math.min(length * 2, 4096)
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type)
                   VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: 'Limit reached. Upgrade to continue.' });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type)
                   VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const plan = req.plan;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscription."
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      transformation: [{ effect: "background_removal" }]
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.log("REMOVE BG ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    if (!object) {
      return res.status(400).json({
        success: false,
        message: "Object name is required"
      });
    }

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscription."
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }]
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (
        ${userId},
        ${`Removed ${object} from image`},
        ${imageUrl},
        'image'
      )
    `;

    res.json({ success: true, content: imageUrl });

  } catch (error) {
    console.log("REMOVE OBJECT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

import fs from 'fs'
import path from 'path'
import { extractResumeText } from "../utils/extractResumeText.js";
      

export const resumeReview = async (req, res) => {
  let filePath;

  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    // ---- Plan check ----
    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: "Premium feature only"
      });
    }

    // ---- File check ----
    if (!resume) {
      return res.json({
        success: false,
        message: "No resume uploaded"
      });
    }

    // ---- Extension check ----
    if (path.extname(resume.originalname).toLowerCase() !== '.pdf') {
      fs.unlinkSync(resume.path);
      return res.json({
        success: false,
        message: "Only PDF resumes are allowed"
      });
    }

    // ---- Size check (5MB) ----
    if (resume.size > 5 * 1024 * 1024) {
      fs.unlinkSync(resume.path);
      return res.json({
        success: false,
        message: "Resume size must be under 5MB"
      });
    }

    filePath = resume.path;

    // ---- Extract text ----
    const resumeText = await extractResumeText(filePath);

    if (!resumeText || resumeText.trim().length < 20) {
      throw new Error('Unable to extract resume text');
    }

    // ---- AI Prompt ----
    const prompt = `
The following text was uploaded as a resume.

If it is a traditional resume:
- Review strengths
- Point out weaknesses
- Suggest improvements

If it is NOT a resume:
- Clearly state that it is not a resume
- Explain what kind of document it appears to be
- Suggest how to convert it into a proper resume

Resume Content:
${resumeText}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
    });

    const content = response.choices[0].message.content;

    // ---- Save to DB ----
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'Resume review')
    `;

    return res.json({
      success: true,
      content
    });

  } catch (error) {
    console.error('Resume Error:', error);
    return res.status(500).json({
      success: false,
      message: "Resume review failed"
    });

  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

