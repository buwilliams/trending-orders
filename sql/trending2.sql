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
			where "createdAt" >= NOW() - INTERVAL '2 DAYS'
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
		end z_score,
		count(*) over () total
	from (
		select
			ROW_NUMBER () OVER (ORDER BY max("createdAt")) row_num,
			restaurant_name,
		    "inventoryId" inventory_id,
		    inventory_name,
		    count("inventoryId") number_orders,
		    max("createdAt") most_recent_order
		from order_items
		where "createdAt" >= NOW() - INTERVAL '2 DAYS'
		group by "inventoryId", inventory_name, restaurant_name, date("createdAt")
		order by max("createdAt")
	) summed_inventory
	join inventory_stats
	on summed_inventory.inventory_id = inventory_stats.inventory_id
	order by most_recent_order desc, z_score desc
) paginated
order by row_num asc
;