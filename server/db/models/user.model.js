const { DataTypes } = require('sequelize');

function define(connection) {
    connection.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});
}

const data = [
    {
        name: "Buddy Williams",
        email: "buddy@buddy.com"
    },
    {
        name: "Elijah Williams",
        email: "elijah@elijah.com"
    },
    {
        name: "Casey Heffernan",
        email: "casey@casey.com"
    },
    {
        name: "Suzanne Whitted",
        email: "suzanne@suzanne.com"
    }
]

module.exports = { define, data };