const express = require('express');
const app = express();
const errorHandler = require('./src/middlewares/errorHandler');
const cors=require('cors');
const validateToken = require('./src/middlewares/tokenHandler');

require('dotenv').config();
const port = process.env.PORT || 6000;

//middleware
app.use(cors({origin:'*'}));
app.use(express.json());
app.use(validateToken);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Knowledge Base." });
  });

app.use("/auth", require("./src/routes/authRoutes"));   //public routes require no authentication.
app.use("/main", require("./src/routes/mainCategory"));
app.use("/sub", require("./src/routes/subCategory"));
app.use("/article", require("./src/routes/articleRoutes"));
app.use("/sidebar", require("./src/routes/sideBarRoutes"));

app.use(errorHandler);              //defined last to catch errors




app.listen(port, () => {
    console.log(`Server running at ${port}`)
});
