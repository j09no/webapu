
const express = require('express');
const path = require('path');
const fs = require('fs');

// Simple storage implementation for Vercel
class VercelStorage {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
  }

  async readData(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  async writeData(filename, data) {
    try {
      const filePath = path.join(this.dataPath, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  async getSubjects() {
    return this.readData('subjects.json');
  }

  async getChapters() {
    return this.readData('chapters.json');
  }

  async getChaptersBySubject(subjectId) {
    const chapters = await this.readData('chapters.json');
    return chapters.filter(c => c.subjectId === subjectId);
  }

  async getQuestionsByChapter(chapterId) {
    const questions = await this.readData('questions.json');
    return questions.filter(q => q.chapterId === chapterId);
  }

  async getMessages() {
    return this.readData('messages.json');
  }

  async getFiles() {
    return this.readData('files.json');
  }

  async getFolders() {
    return this.readData('folders.json');
  }

  async getUserStats() {
    const stats = await this.readData('quizStats.json');
    return { quizStats: stats };
  }

  // Add other methods as needed
  async createChapter(data) {
    const chapters = await this.readData('chapters.json');
    const newChapter = { id: Date.now(), ...data };
    chapters.push(newChapter);
    await this.writeData('chapters.json', chapters);
    return newChapter;
  }

  async createQuestion(data) {
    const questions = await this.readData('questions.json');
    const newQuestion = { id: Date.now(), ...data };
    questions.push(newQuestion);
    await this.writeData('questions.json', questions);
    return newQuestion;
  }

  async createBulkQuestions(questionsData) {
    const questions = await this.readData('questions.json');
    const newQuestions = questionsData.map(q => ({ id: Date.now() + Math.random(), ...q }));
    questions.push(...newQuestions);
    await this.writeData('questions.json', questions);
    return newQuestions;
  }
}

const storage = new VercelStorage();

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

app.get("/api/chapters", async (req, res) => {
  try {
    const chapters = await storage.getChapters();
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
});

app.get("/api/chapters/subject/:subjectId", async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId);
    const chapters = await storage.getChaptersBySubject(subjectId);
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chapters" });
  }
});

app.get("/api/questions/chapter/:chapterId", async (req, res) => {
  try {
    const chapterId = parseInt(req.params.chapterId);
    const questions = await storage.getQuestionsByChapter(chapterId);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const messages = await storage.getMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/api/files", async (req, res) => {
  try {
    const files = await storage.getFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

app.get("/api/folders", async (req, res) => {
  try {
    const folders = await storage.getFolders();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

app.get("/api/quiz-stats", async (req, res) => {
  try {
    const stats = await storage.getUserStats();
    res.json(stats.quizStats || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to get quiz stats" });
  }
});

module.exports = app;
