const { DataTypes } = require('sequelize');

function define(connection) {
    connection.define('order', {}, {});
}

const data = []

module.exports = { define, data };