const express = require('express');
const app = express();
const errorHandler = require('./src/middlewares/errorHandler');
const cors=require('cors');
const validateToken = require('./src/middlewares/tokenHandler');
const path = require('path');



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





app.listen(port, () => {
    console.log(`Server running at ${port}`)
});
