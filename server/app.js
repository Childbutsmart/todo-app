import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.MONGO_URI;

const client = new MongoClient(url);

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static("dist"));

async function connectToMongo() {
    try {
      await client.connect();
      console.log("Connect to MongoDB");
    } catch (err) {
      console.error(err);
    }
  }

app.get("/api/tasks", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks");
      const tasks = await collection.find({}).toArray(); 
      res.json(tasks); 
    } catch (err) {
      res.status(500).json({ error: err.message }); 
    }
  });
  
  
  app.post("/api/tasks", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks");
      const task = req.body;
      await collection.insertOne(task);
      res.status(201).json(task); 
    } catch (err) {
      res.status(500).json({ error: err.message }); 
    }
  });
  
  
  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks"); 
      const { id } = req.params; 
      const task = req.body; 
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: task });
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
 
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const collection = client.db("todo_DB").collection("tasks"); 
      const { id } = req.params;
      await collection.deleteOne({ _id: new ObjectId(id) });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message }); 
    }
  });

  
  app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}\nvia http://localhost:8080`);
    connectToMongo();
  });
