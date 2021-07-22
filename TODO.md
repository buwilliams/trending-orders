# Project

## Notes

- `initdb --locale=C -E UTF-8 /home/linuxbrew/.linuxbrew/var/postgres`
- `pg_ctl -D /home/linuxbrew/.linuxbrew/var/postgres start`
- `pg_ctl -D /home/linuxbrew/.linuxbrew/var/postgres stop`

## Models

- User (id, name, email)
- Restaurants (id, name)
- Inventory (id, restaurants_id, name, price)
- Order (id, user_id, resturant_id)
- OrderItems (id, order_id, inventory_id, inventory_name, inventory_price, quantity, timestamp)

## TODO

- No todos left. All done.

## Done

- `npx create-react-app my-app --template redux-typescript`
- `mkdir server` and setup express.js + Sequelize
- create postgres db `trendingproducts`
- write models
- genearte data script: user, resturants, inventory, orders, and order_items
- inventory ordered in the last 48 hours (make configurable)
- recent purchase tag, ex. 5 purchased recently
- time tag, ex. order 3 minutes ago
- add restaurant name to trends query
- infinite scrolling list of trends
- update readme: createdb trendingproducts, npm run db:scaffold, npm run dev, npm run start
- search for heuristic for trending products
- read up on z-score
- implement z-score in sql
- move z-score into trending.query.js