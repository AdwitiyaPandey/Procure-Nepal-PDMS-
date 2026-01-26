// const express = require("express");
// const cors = require("cors");

// const authRoutes = require("./routes/auth.routes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// app.listen(5000, () => {
//   console.log("Backend running on port 5000");
// });

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/buyer", require("./routes/buyer.routes"));
app.use("/api/supplier", require("./routes/supplier.routes"));


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

console.log("After listen");

