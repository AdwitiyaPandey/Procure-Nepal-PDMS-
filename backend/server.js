const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db');


const authRoutes = require('./routes/authRoutes');

const supplierRoutes = require('./routes/supplierRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api', supplierRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;


sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('🐘 PostgreSQL Connected ');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));