const express = require("express");
const dbo = require("../db/dbo");
const queryTrending = require("../db/queries/trending.query");

const trendingRoutes = express.Router();

trendingRoutes.route("/trending").get(async function (req, res) {
    let pageNumber = parseInt(req.query.page_number) || 1;
    let pageSize = parseInt(req.query.page_size) || 20;
    let results = await queryTrending.getTrending(pageNumber, pageSize);
    res.json({ 'success': true, 'total': results.total, 'results': results.records });
});

module.exports = trendingRoutes;