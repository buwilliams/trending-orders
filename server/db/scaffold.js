require("dotenv").config({ path: "./config.env" });
const dbo = require("./dbo");

const users = require("./models/user.model");
const restaurants = require("./models/restaurant.model");
const inventories = require("./models/inventory.model");

const NUMBER_ORDERS = 5000;
const NUMBER_DAYS = 3;
const PRINT_INTERVAL = 100;

function random(limit) {
    return Math.floor(Math.random() * limit);
}

(async () => {
    let userIds = [];
    let restaurantCache = [];
    let inventoryCache = {};

    await dbo.sync({ force: true });
    let models = dbo.models;

    for (const u of users.data) {
        const user = models.user.build(u);
        await user.save()
        userIds.push(user.id);
    }

    for (const r of restaurants.data) {
        const restaurant = models.restaurant.build(r);
        await restaurant.save()
        restaurantCache.push(restaurant);

        for(const i of inventories.data) {
            const inventory = models.inventory.build(i);
            inventory.restaurantId = restaurant.id;
            await inventory.save()

            if (inventoryCache[restaurant.id]) {
                inventoryCache[restaurant.id].push(inventory);
            } else {
                inventoryCache[restaurant.id] = [inventory];
            }
        }
    }

    let incrementalCount = 0;
    let totalCount = NUMBER_DAYS * NUMBER_ORDERS;
    for(let days=(NUMBER_DAYS - 1); days>=0; days--) {
        for(let n=0; n<NUMBER_ORDERS; n++) {

            let userId = userIds[random(userIds.length)];

            let restaurant = restaurantCache[random(restaurantCache.length)];
            let restaurantId = restaurant.id;
            let restaurantName = restaurant.name;

            let timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - days);

            const order = models.order.build({
                userId: userId,
                restaurantId: restaurantId,
                createdAt: timestamp,
            });
            await order.save();

            let inventories = inventoryCache[restaurantId];

            const numberOfItems = random(10);

            let orderItems = [];
            for(let items=0; items<numberOfItems; items++) {
                let inventory = inventories[random(inventories.length)] 
                let quantity = random(5);

                orderItems.push({
                    restaurantId: restaurantId,
                    orderId: order.id,
                    inventoryId: inventory.id,
                    restaurant_name: restaurantName,
                    inventory_name: inventory.name,
                    inventory_price: inventory.price,
                    quantity: quantity,
                    createdAt: timestamp,
                });
            }

            await models.order_item.bulkCreate(orderItems);

            if(n % PRINT_INTERVAL === 0) {
                incrementalCount += PRINT_INTERVAL;
                let percentComplete = Math.floor(incrementalCount / totalCount * 100);
                console.log(percentComplete+'% complete', '(', 'inserted', incrementalCount, 'of', totalCount, 'records', ')');
            }
        }
    }

    await dbo.close()
})();

