import express from "express";
import cors from "cors";
const app = express();
const port = 8080;

// TODO: Enable CORS middleware - week 7
// middleware- api can understand json
app.use(express.json());

app.use(
  cors({
    // Allow all origins
    origin: ["https://www.wikipedia.org"],
  })
);

// Enable swagger documentation router
import docsRouter from "./middleware/swagger-doc.js";
app.use(docsRouter);

// Import and use controllers
import readingController from "./controllers/reading.js";
app.use(readingController);
import userController from "./controllers/users.js";
app.use(userController);

app.listen(port, () => {
  console.log("Express started on http://localhost:" + port);
});
