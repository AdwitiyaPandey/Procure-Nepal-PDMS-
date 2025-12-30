const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db');




const app = express();
app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 5000;


sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('🐘 PostgreSQL Connected ');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));