const User = require('../models/User');


const getPendingSellers = async (req, res) => {
    try {
        const pendingSellers = await User.findAll({
            where: {
                role: 'seller',
                isApproved: false
            },
            attributes: { exclude: ['password'] } 
        });
        res.status(200).json(pendingSellers);
    } catch (error) {
        console.error("Error fetching pending sellers:", error);
        res.status(500).json({ message: "Server error while fetching sellers" });
    }
};

// Approve or Reject a seller
const handleSellerApproval = async (req, res) => {
    const { userId, action } = req.body; 

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (action === 'approve') {
            user.isApproved = true;
            user.role = 'seller'; 
            await user.save();
            return res.status(200).json({ message: "Seller approved successfully", user });
        } 
        
        if (action === 'reject') {
            user.role = 'buyer';
            user.isApproved = false;
            await user.save();
            return res.status(200).json({ message: "Seller application rejected", user });
        }

        res.status(400).json({ message: "Invalid action" });

    } catch (error) {
        console.error("Error handling approval:", error);
        res.status(500).json({ message: "Server error during approval process" });
    }
};

module.exports = {
    getPendingSellers,
    handleSellerApproval
};