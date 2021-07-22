const { DataTypes } = require('sequelize');

function define(connection) {
    connection.define('inventory', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {});
}

const data = [
    { name: "Coke", price: 1.99 },
    { name: "French fries", price: 2.99 },
    { name: "Latte", price: 3.25 },
    { name: "Scone", price: 1.25 },
    { name: "Turkey sandwich", price: 4.99 },
    { name: "Rice bowl", price: 5.89 },
    { name: "Ramen soup", price: 3.15 },
    { name: "Noodle bowl", price: 5.99 },
    { name: "Alfredo", price: 17.99 },
    { name: "Red Curry Chicken", price: 12.99 }
]

module.exports = { define, data };