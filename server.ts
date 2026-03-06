import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("university_store.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('student', 'admin')) DEFAULT 'student',
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    price REAL,
    type TEXT, -- PDF, eBook, Software, etc.
    course_code TEXT,
    department TEXT,
    instructor TEXT,
    file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    material_id INTEGER,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(material_id) REFERENCES materials(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run(
    "admin@university.edu",
    "admin123",
    "admin",
    "IT Admin"
  );
  db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run(
    "student@university.edu",
    "student123",
    "student",
    "John Doe"
  );

  const materials = [
    { title: "Advanced Algorithms PDF", price: 29.99, type: "PDF", course: "CS301", dept: "Computer Science", instructor: "Dr. Smith" },
    { title: "Introduction to Psychology eBook", price: 45.00, type: "eBook", course: "PSY101", dept: "Psychology", instructor: "Prof. Jones" },
    { title: "Matlab Student License", price: 15.00, type: "Software", course: "ENG202", dept: "Engineering", instructor: "Dr. Brown" },
    { title: "Organic Chemistry Lecture Notes", price: 10.00, type: "Notes", course: "CHM201", dept: "Chemistry", instructor: "Dr. White" },
  ];

  const insertMaterial = db.prepare("INSERT INTO materials (title, price, type, course_code, department, instructor) VALUES (?, ?, ?, ?, ?, ?)");
  materials.forEach(m => insertMaterial.run(m.title, m.price, m.type, m.course, m.dept, m.instructor));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/materials", (req, res) => {
    const list = db.prepare("SELECT * FROM materials").all();
    res.json(list);
  });

  app.get("/api/materials/:id", (req, res) => {
    const item = db.prepare("SELECT * FROM materials WHERE id = ?").get(req.params.id);
    res.json(item);
  });

  app.post("/api/materials", (req, res) => {
    const { title, description, price, type, course_code, department, instructor } = req.body;
    const result = db.prepare(`
      INSERT INTO materials (title, description, price, type, course_code, department, instructor)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, price, type, course_code, department, instructor);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/purchase", (req, res) => {
    const { userId, materialId } = req.body;
    db.prepare("INSERT INTO purchases (user_id, material_id) VALUES (?, ?)").run(userId, materialId);
    res.json({ success: true });
  });

  app.get("/api/library/:userId", (req, res) => {
    const library = db.prepare(`
      SELECT m.* FROM materials m
      JOIN purchases p ON m.id = p.material_id
      WHERE p.user_id = ?
    `).all(req.params.userId);
    res.json(library);
  });

  app.get("/api/admin/stats", (req, res) => {
    const totalSales = db.prepare("SELECT SUM(m.price) as total FROM purchases p JOIN materials m ON p.material_id = m.id").get() as any;
    const totalPurchases = db.prepare("SELECT COUNT(*) as count FROM purchases").get() as any;
    const topMaterials = db.prepare(`
      SELECT m.title, COUNT(p.id) as sales
      FROM materials m
      LEFT JOIN purchases p ON m.id = p.material_id
      GROUP BY m.id
      ORDER BY sales DESC
      LIMIT 5
    `).all();
    res.json({
      revenue: totalSales.total || 0,
      salesCount: totalPurchases.count || 0,
      topMaterials
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
