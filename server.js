const express = require('express');
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");  
const errorHandler = require('./src/middlewares/errorHandler');
const cors=require('cors');
const validateToken = require('./src/middlewares/tokenHandler');
const path = require('path');
const Clone=require('./src/models/cloneSchema');
const Content=require('./src/models/contentSchema')

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

io.on('connection', (socket) => {
  // console.log('User connected');

  // Join a room to synchronize changes
  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    console.log(roomId)

    try {
      // Fetch the document content from the database
      const document = await Clone.findById(roomId);
      console.log(roomId)
      if (document && document.content) {
        socket.emit('documentContent', document.content.ops);
        
      }
    } catch (err) {
      console.error('Error fetching document content:', err);
    }
});

  // Handle document updates
  socket.on('updateDocument',async (data) => {
    
    const { roomId, content } = data;
   
    const updatedObject = await Clone.findByIdAndUpdate(roomId, { content }, { upsert: true });

    
    socket.to(roomId).emit('documentUpdated', content);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // console.log('User disconnected');
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
app.use("/clone", require("./src/routes/cloneRoutes"));
app.use("/subscribe", require("./src/routes/subscribeRoutes"));
app.use("/merge", require("./src/routes/mergeEditRoutes"));
app.use("/invite", require("./src/routes/editorRoutes"));
app.use("/search", require("./src/routes/searchRoutes"));

app.use(errorHandler);              //defined last to catch errors

//search
async function performTextSearch(searchQuery) {
  try {
    const results = await Content.find({ $text: { $search: searchQuery } });
    return results;
  } catch (err) {
    console.error('Error performing text search:', err);
    throw err;
  }
}

// Example usage
const searchTerm = '';
performTextSearch(searchTerm)
  .then((results) => {
    console.log('Search results:', results);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
//



httpServer.listen(port, () => {
    console.log(`Server running at ${port}`)
});
