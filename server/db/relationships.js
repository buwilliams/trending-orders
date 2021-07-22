function setupRelationships(sequelize) {
    const { user, restaurant, inventory, order, order_item } = sequelize.models;

    user.hasMany(order);

    inventory.belongsTo(restaurant);

    restaurant.hasMany(inventory);
    restaurant.hasMany(order);
    restaurant.hasMany(order_item);

    order.belongsTo(user);
    order.belongsTo(restaurant);

    order_item.belongsTo(order);
    order_item.belongsTo(inventory);
    order_item.belongsTo(restaurant);
}

module.exports = setupRelationships;