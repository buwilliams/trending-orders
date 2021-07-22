const { DataTypes } = require('sequelize');

function define(connection) {
    connection.define('order_item', {
        restaurant_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inventory_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        inventory_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {});
}

const data = []

module.exports = { define, data };