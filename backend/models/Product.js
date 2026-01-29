module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        phoneNumber: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', 
                key: 'id'
            }
        }
    }, {
        timestamps: true, 
    });

    
    Product.associate = (models) => {
        Product.belongsTo(models.User, {
            foreignKey: 'sellerId',
            as: 'seller'
        });
    };

    return Product;
};