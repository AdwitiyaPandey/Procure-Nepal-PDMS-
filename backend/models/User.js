const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: { isEmail: true } 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false
  }, 
  phone: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  role: { 
    type: DataTypes.STRING, 
    defaultValue: 'buyer' 
  },

  companyName: { type: DataTypes.STRING },
  pan: { type: DataTypes.STRING },
  vat: { type: DataTypes.STRING },
  turnover: { type: DataTypes.STRING },
  established: { type: DataTypes.DATEONLY },
  citizenshipImage: { type: DataTypes.STRING },
  profilePhoto: { type: DataTypes.STRING },
  isApproved: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
}, {
  timestamps: true 
});

module.exports = User;