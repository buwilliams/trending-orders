# Trending Orders

This is a take-home coding assignment for an interview. I have anonymized the company and removed the commit history to protect the coding challenge for the original company.

## The Challenge

Assume the customers order 5000 orders a day from 50 local restaurants. Each order contains one or multiple products. For eg, `2 burritos, a soda, and a side of chips`.

1. Design a full stack application which returns an infinite-scrolling list of trending products to the user.
2. A product can be qualified as trending if it is purchased at least once in last 48 hours
3. Each product should be tagged with two tags:
    * a recent purchase tag: `5 purchased recently`
    * a time tag `ordered 3 min ago`
4. **Use a heuristic to determine which trending products gets returned higher. Base heuristic on both recency and number of recent purchases.**

## Requirements
1. Implement a Full-Stack solution including web server, backend persistence and associated code.
2. You can use pseudocode for parts of web application. For instance, you could replace a function body with "assume this service has the following API."
3. Please use best practices for writing code and publish to this repo.

## Solution

**Problem #1 - Getting a list of recently ordered items**

I first realized that this is a relationship-based problem. Relational databases 
are well-suited to help solve these kinds of problems. So, my first step was creating 
a relational database and seeding it with data. This took a bit longer than I would 
have liked since I spent time learning a bit about Sequalize.js.

After I had a schema and seeded database, I was able to quickly write a query in to 
return the desired result.

Seeding the data does take a minute so I included a percent complete for anxious minds.

**Problem #2 - Recent purchased count**

This was easily solved with the SQL function `count()`.

**Problem #3 - Time ago**

I used the SQL function `max()` to get the most recently ordered item.

While there are ways to achieve the *time ago* formatting in SQL I found the 
additional complexity wasn't worth it. So, I used a library to convert a 
timestamp into the *time ago* format once we received the data from the database.

**Problem #4 - Infinite scrolling**

On the backend, I used SQL to paginate the results so that the API would accept
a `page_number` and `page_size` to reduce data sent to the frontend as well as give
it control over what it was receiving.

On the frontend, I used a plugin to handle the details
of infinite scrolling. I kept the state simple since I didn't really need
to use Redux.

**Problem #5 - Trending heuristic**

It's good to start with leveraging the work of others. I started by googling 
around to find an algorithm that fits the need. The algorithm I found, 
[z-score aka. standard score](https://en.wikipedia.org/wiki/Standard_score), 
seemed well-suited since it shows the number of standard deviations from the
average. That in turns gives us a good idea if a product is suddenly being
purchased a lot more than the historical average.

Since, we may be dealing with large datasets, it makes the most sense to do
this work on the database. Therefore, I implemented a version of z-score in SQL using CTEs.

Currently, all z-scores are the same. This is because the granularity is set to 
day and the number of days for a trend is two. An improvement would be to shrink 
the granularity to give more meaningful z-scores. But you can see the algorithm 
implemented and working which I think is sufficient for the coding exercise.

Read more:
- [Compute trending topics or tags](https://stackoverflow.com/questions/787496/what-is-the-best-way-to-compute-trending-topics-or-tags)
- [SQL Z-Score](https://stackoverflow.com/questions/52766346/how-to-add-new-column-containing-zscore-in-sql)
- [Standard score](https://en.wikipedia.org/wiki/Standard_score)
- [Standard Deviation](https://www.mathsisfun.com/data/standard-deviation-calculator.html)
- [Calculate z-score](http://www.silota.com/docs/recipes/sql-z-score.html)

## Getting Started

This project is divided into the *client* and *server*. The client is written in typescript and react. The server is written in node.js and express.js. In order to get a sizable amount of data, we create the database, migrate it, and seed the database with data. So we start with the backend server first.

**Prerequisites**

- postgres server running on your machine
- node.js installed

**Server**

1. `cd server`
1. `npm install`
1. `createdb trendingproducts` to create postgres database, you may change the database name if you wish by updating ./server/config.env
1. `npm run db:scaffold` migrates and seeds the database, this is a destructive action and it will take a minute to complete
1. `npm run dev` to start express.js backend server

**Client**

After backend is up and running, it's time to start the frontend client.

1. `cd client`
1. `npm install`
1. `npm run start`

**Running Tests**

1. `createdb trendingproducts_test`
1. `cd server`
1. `npm run test`

## Technical stack

- node.js
- express.js
- Sequelize.js (ORM for node)
- React
- TypeScript
