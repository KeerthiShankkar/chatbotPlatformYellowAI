import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Project from '../Models/Project.js';
import AuthMiddleware from '../Middlewares/AuthMiddleware.js';
import { model } from '../Utils/GeminiModel.js';

const router = express.Router();

// Create a new project
router.post('/createProject', AuthMiddleware, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const newProject = await Project.create({
      name,
      description,
      ownerId: req.user.id,
      prompts: []
    });
    return res.status(201).json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all projects
router.get('/getProjects', AuthMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id });
    return res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get a single project prompts
router.get('/getProject/:projectId', AuthMiddleware, async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOne({ _id: projectId, ownerId: req.user.id });
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.status(200).json({ prompts: project.prompts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Chat with a project
router.post('/:projectId/chat', AuthMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  try {
    const project = await Project.findOne({ _id: projectId, ownerId: req.user.id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Save user prompt
    project.prompts.push({ role: "user", content: prompt });
    await project.save();

    // Prepare messages for Gemini model
    const messages = project.prompts.map(p => ({
      role: p.role === "assistant" ? "model" : "user",
      parts: [{ text: p.content }]
    }));

    const chat = model.startChat({ history: messages });
    const result = await chat.sendMessage(prompt);
    const reply = result.response.text();

    // Save assistant reply
    project.prompts.push({ role: "assistant", content: reply });
    await project.save();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete a project
router.delete('/deleteProject/:projectId', AuthMiddleware, async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findOneAndDelete({ _id: projectId, ownerId: req.user.id });
    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json({ message: "Project deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
