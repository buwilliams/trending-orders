require("dotenv").config({ path: "./config.test.env" });
const dbo = require('../dbo');
const models = dbo.models;
const trendingQuery = require('./trending.query')

beforeAll(async () => {
    await dbo.sync({ force: true });

    const user = await models.user.create({ name: 'Test User', email: 'test@test.com '});
    const restaurant = await models.restaurant.create({ name: 'Food truck' });
    const inventory = await models.inventory.create({ name: "Taco", price: 1.99, restaurantId: restaurant.id });
    const order = await models.order.create({ userId: user.id, restaurantId: restaurant.id });
    const orderItem = await models.order_item.create({
        restaurantId: restaurant.id,
        orderId: order.id,
        inventoryId: inventory.id,
        restaurant_name: restaurant.name,
        inventory_name: inventory.name,
        inventory_price: inventory.price,
        quantity: 1
    });
});

afterAll(async () => {
    await models.order_item.drop();
    await models.order.drop();
    await models.inventory.drop();
    await models.restaurant.drop();
    await models.user.drop();

    dbo.close();
});

test('returns 1 record', async () => {
    const results = await trendingQuery.getTrending(1, 20);

    expect(results.total).toBe(1);
    expect(results.records.length).toBe(1);
    expect(results.records[0].time_ago).toBe('just now');
    expect(results.records[0].number_orders).toBe(1);
    expect(results.records[0].z_score).toBe(0);
});