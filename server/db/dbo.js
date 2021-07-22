const { Sequelize } = require('sequelize');
const setupRelationships = require('./relationships');

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
	logging: false
})

const modelDefinitions = [
	require('./models/user.model'),
	require('./models/restaurant.model'),
	require('./models/inventory.model'),
	require('./models/order.model'),
	require('./models/order_item.model')
];

for (const model of modelDefinitions) {
	model.define(sequelize);
}

setupRelationships(sequelize);

module.exports = sequelize;
