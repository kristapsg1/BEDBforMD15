import express from "express";
const cors = require("cors");
import { connection } from "./db";
const app = express();
const port = 3001;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (req, res) => {
  res.json({ message: "Hello form server" });
});

app.get("/users", async (req, res) => {
  // Execute the query to get all users
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Send the users as a JSON response
    res.json({ users: results });
  });
});

app.get("/users/:id", async (req, res) => {
  // Execute the query to get all users
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Send the users as a JSON response
    res.json({ users: results });
  });
});

app.use(express.json())

app.post('/users', async (req, res) => {
  const { name, age, hobbies, job } = req.body;


  connection.query(
    'INSERT INTO users (name, age, hobbies, job) VALUES (?, ?, ?, ?)',
    [name, age, hobbies, job],
    () => {
      res.json({ message: 'Profile created successfully' });
    }
  );
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  // Execute the query to delete the user profile
  connection.query(
    'DELETE FROM users WHERE id=?',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Error deleting profile:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if the user with the given ID exists
      if (results && 'affectedRows' in results && results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Send a success message
      res.json({ message: 'Profile deleted successfully' });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
