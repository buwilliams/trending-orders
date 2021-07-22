const dbo = require("../dbo");
const { QueryTypes } = require('sequelize');
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

const NUMBER_OF_DAYS_FOR_TREND = 2;

module.exports = {
    async getTrending(pageNumber, pageSize) {
        let offset = pageNumber === 1 ? 0 : (pageNumber * pageSize) - pageSize;

        const sql = `
        select *, count(*) OVER() AS total
        from (
            with inventory_stats as (
                select
                    inventory_id,
                    avg(inventory_count) mean,
                    coalesce(stddev(inventory_count), 0) standard_deviation
                from (
                    select
                        "inventoryId" inventory_id,
                        date("createdAt") created_at,
                        count("inventoryId") inventory_count
                    from order_items oi
                    where "createdAt" >= NOW() - INTERVAL '${NUMBER_OF_DAYS_FOR_TREND} DAYS'
                    group by "inventoryId", date("createdAt")
                    order by "inventoryId"
                ) as daily_counts
                group by inventory_id
                order by standard_deviation
            )
            select row_num,
                summed_inventory.restaurant_name,
                summed_inventory.inventory_id,
                summed_inventory.inventory_name, 
                summed_inventory.number_orders, 
                summed_inventory.most_recent_order,
                current_timestamp created_at,
                case inventory_stats.standard_deviation
                    when 0 then 0
                    else (summed_inventory.number_orders - inventory_stats.mean) / inventory_stats.standard_deviation
                end z_score
            from (
                select
                    ROW_NUMBER () OVER (ORDER BY max("createdAt")) row_num,
                    restaurant_name,
                    "inventoryId" inventory_id,
                    inventory_name,
                    count("inventoryId") number_orders,
                    max("createdAt") most_recent_order
                from order_items
                where "createdAt" >= NOW() - INTERVAL '${NUMBER_OF_DAYS_FOR_TREND} DAYS'
                group by "inventoryId", inventory_name, restaurant_name, date("createdAt")
                order by max("createdAt")
            ) summed_inventory
            join inventory_stats
            on summed_inventory.inventory_id = inventory_stats.inventory_id
            order by most_recent_order desc, z_score desc
        ) paginated
        limit ${pageSize} 
        offset ${offset}
        ;
        `;

        const records = await dbo.query(sql, { type: QueryTypes.SELECT });

        let total = 0;

        for (let row of records) {
            row.time_ago = timeAgo.format(row.most_recent_order);
            row.number_orders = parseInt(row.number_orders);
            row.z_score = parseFloat(row.z_score);
            if(total === 0) total = parseInt(row.total);
            delete(row.total)
        }

        return {
            total,
            records
        };
    }
}