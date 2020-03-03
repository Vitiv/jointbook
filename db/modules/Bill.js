const Sequelize = require('sequelize');

module.exports = (sequelize, User) => {
    const Bill = sequelize.define(
        'bill',
        {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: User,
                    key: 'id'
                },
                allowNull: false
            },
            amount: {
                type: Sequelize.REAL
            },
            billId: {
                type: Sequelize.TEXT,
            },
            link: {
                type: Sequelize.TEXT
            }
        }
    );

    User.hasMany(Bill);
    Bill.belongsTo(User, {
        foreignKey: 'userId'
    });

    return Bill;
};