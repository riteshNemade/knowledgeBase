const express = require('express');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");  
const errorHandler = require('./src/middlewares/errorHandler');
const cors=require('cors');
const validateToken = require('./src/middlewares/tokenHandler');
const path = require('path');
const Clone=require('./src/models/cloneSchema')


require('dotenv').config();
const port = process.env.PORT || 6000;

//middleware
app.use(cors({origin:'*'}));
app.use(express.json());
app.use(validateToken);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Knowledge Base." });
});
app.use(express.static(path.join(__dirname, 'src', 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket conntection established");
  console.log(socket.id);

  socket.on('content', (data) => {
    // Create a new Clone document with the received content and socket ID
    const newClone = new Clone({
      parentId: data.id, // Assuming data.id contains the parent ID received from the frontend
      content: data.content,
    });

    // Save the newClone document to the database
    newClone.save((err, savedClone) => {
      if (err) {
        console.error('Error saving Clone document:', err);
      } else {
        console.log('Clone document saved:', savedClone);
      }
    });
  });
});




app.use("/auth", require("./src/routes/authRoutes"));   
app.use("/main", require("./src/routes/mainCategory"));
app.use("/sub", require("./src/routes/subCategory"));
app.use("/article", require("./src/routes/articleRoutes"));
app.use("/sidebar", require("./src/routes/sideBarRoutes"));
app.use("/content", require("./src/routes/contentRoutes"));
app.use("/comment", require("./src/routes/commentRoutes"));
app.use("/feedback", require("./src/routes/feedbackRoutes"));
app.use("/reply", require("./src/routes/replyRoutes"));

app.use(errorHandler);              //defined last to catch errors





httpServer.listen(port, () => {
    console.log(`Server running at ${port}`)
});
