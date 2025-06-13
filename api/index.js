
const express = require('express');
const path = require('path');
const fs = require('fs');

// Simple storage implementation for Vercel
class VercelStorage {
  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        fs.mkdirSync(this.dataPath, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating data directory:', error);
    }
  }

  async readData(filename) {
    try {
      const filePath = path.join(this.dataPath, filename);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  async writeData(filename, data) {
    try {
      this.ensureDataDirectory();
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

  async addMessage(messageData) {
    const messages = await this.getMessages();
    const newMessage = {
      id: Date.now(),
      ...messageData,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    await this.writeData('messages.json', messages);
    return newMessage;
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

  async getScheduleEvents() {
    return this.readData('scheduleEvents.json');
  }

  async createScheduleEvent(eventData) {
    const events = await this.getScheduleEvents();
    const newEvent = {
      id: Date.now(),
      ...eventData,
      createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    await this.writeData('scheduleEvents.json', events);
    return newEvent;
  }
}

const storage = new VercelStorage();

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Routes
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

app.get('/api/chapters', async (req, res) => {
  try {
    const { subjectId } = req.query;
    let chapters;
    
    if (subjectId) {
      chapters = await storage.getChaptersBySubject(parseInt(subjectId));
    } else {
      chapters = await storage.getChapters();
    }
    
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

app.get('/api/chapters/:id/questions', async (req, res) => {
  try {
    const chapterId = parseInt(req.params.id);
    const questions = await storage.getQuestionsByChapter(chapterId);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await storage.getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = await storage.addMessage(req.body);
    res.json(message);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

app.get('/api/files', async (req, res) => {
  try {
    const files = await storage.getFiles();
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

app.get('/api/folders', async (req, res) => {
  try {
    const folders = await storage.getFolders();
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

app.get('/api/quiz-stats', async (req, res) => {
  try {
    const stats = await storage.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({ error: 'Failed to fetch quiz stats' });
  }
});

app.get('/api/schedule', async (req, res) => {
  try {
    const events = await storage.getScheduleEvents();
    res.json(events);
  } catch (error) {
    console.error('Error fetching schedule events:', error);
    res.status(500).json({ error: 'Failed to fetch schedule events' });
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const event = await storage.createScheduleEvent(req.body);
    res.json(event);
  } catch (error) {
    console.error('Error creating schedule event:', error);
    res.status(500).json({ error: 'Failed to create schedule event' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vercel serverless function handler
module.exports = (req, res) => {
  return app(req, res);
};
