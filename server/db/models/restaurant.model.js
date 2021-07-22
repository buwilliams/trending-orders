const { DataTypes } = require('sequelize');

function define(connection) {
    connection.define('restaurant', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
}

const data = [
    { name: "Chipotle" },
    { name: "McDonald's" },
    { name: "Starbucks" },
    { name: "Chick-fil-a" },
    { name: "Arby's" },
    { name: "Wendy's" },
    { name: "Star Provisions" },
    { name: "Thai Kitchen" },
    { name: "Hogwarts" },
    { name: "Penang" },
    { name: "Taco Bell" },
    { name: "Top Golf" },
    { name: "Slim & Husky's" },
    { name: "Maggiano's Little Italy" },
    { name: "Bacchanalia" }
]

module.exports = { define, data };