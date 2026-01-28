const bcrypt = require('bcrypt');
const User = require('./models/User');
const sequelize = require('./config/db');

async function resetAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

  
    if (!User) {
      throw new Error("User model is undefined. Check your require path or export style.");
    }

    const plainPassword = 'Admin@gmail';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await sequelize.query(`DELETE FROM "Users" WHERE email = 'admin@gmail.com'`);

  
    await User.create({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isApproved: true
    });

    console.log("\n-----------------------------------------");
    console.log("SUCCESS: Admin account created!");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@gmail");
    console.log("-----------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
}

resetAdmin();