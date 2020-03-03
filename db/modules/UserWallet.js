const Sequelize = require('sequelize');

module.exports = (sequelize, User) => {
    const UserWallet = sequelize.define(
        'user_wallet',
        {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            mnemonic: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: User,
                    key: 'id'
                },
                allowNull: false
            }
        }
    );

    User.hasOne(UserWallet);
    UserWallet.belongsTo(User, {
        foreignKey: 'userId'
    });

    return UserWallet;
};