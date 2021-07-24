-- last 48 hours
-- count of the items order
-- time tag, order 3 minutes ago

--to_char(current_timestamp - max("createdAt"), 'dd "days" ago, hh24 "hours" ago, mi "minutes" ago') as most_recent_order_readable

select
	row_num,
	inventory_id,
	trending_orders.inventory_name, 
	number_orders, 
	most_recent_order,
	current_timestamp 
from (
	select ROW_NUMBER () OVER (ORDER BY max("createdAt")) row_num, 
		"inventoryId" inventory_id,
		inventory_name,
		count("inventoryId") number_orders,
		max("createdAt") most_recent_order
	from order_items
	where "createdAt" >= NOW() - INTERVAL '2 DAYS'
	group by "inventoryId", inventory_name
	order by max("createdAt")
) as trending_orders
limit 200
offset 0
;

select "inventoryId", inventory_name, "createdAt" from order_items limit 1;





select
            row_num,
            inventory_id,
            trending_orders.inventory_name, 
            number_orders, 
            most_recent_order,
            current_timestamp 
        from (
            select ROW_NUMBER () OVER (ORDER BY max("createdAt")) row_num,
                "inventoryId" inventory_id,
                inventory_name,
                count("inventoryId") number_orders,
                max("createdAt") most_recent_order
            from order_items
            where "createdAt" >= NOW() - INTERVAL '2 DAYS'
            group by "inventoryId", inventory_name
            order by max("createdAt")
        ) as trending_orders
        limit 100 
        offset 0
        ;

select current_timestamp;


with z_score as (
  select inventory_id,
  	"createdAt"
  	count("inventoryId")
     ([Debit Amount] - avg([Debit Amount]) OVER ()) / stddev([Debit Amount]) OVER () as z_score
  from order_items
  group by inventory_id, "createdAt" 
)
select * from z_score


select "inventoryId",
  	"createdAt",
  	count("inventoryId") cnt,
  	(count("inventoryId") - avg(count("inventoryId")) OVER ()) / stddev(count("inventoryId")) OVER () as z_score
  from order_items
  group by "inventoryId", "createdAt"
 order by cnt desc;


avg(count("inventoryId")) over () average,
stddev(count("inventoryId")) over () standard_deviation

select
inventory_id,
sum(inventory_count) / count(inventory_count) average
from (
	select "inventoryId" inventory_id,
	date("createdAt") created_at,
	count("inventoryId") inventory_count
	from order_items oi
	where "createdAt" >= NOW() - INTERVAL '2 DAYS'
	group by "inventoryId", date("createdAt")
	order by "inventoryId"
) as daily_counts
group by inventory_id
;

avg(inventory_count) average,
stddev(inventory_count) standard_deviation,
(inventory_count - avg(inventory_count) OVER ()) / stddev(inventory_count) OVER () z_score
order by z_score desc



select *, count(*) OVER() AS total
from (
	with inventory_stats as (
		select
			inventory_id,
			avg(inventory_count) mean,
			stddev(inventory_count) standard_deviation
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


select
	sd."inventoryId",
	avg(sd.cnt),
	stddev(sd.cnt)
from (
	select
		"inventoryId",
		date("createdAt"),
		count(*) cnt
	from order_items
	where "inventoryId" = 106
	and "createdAt" >= NOW() - INTERVAL '2 DAYS'
	group by "inventoryId", date("createdAt")
) as sd
group by sd."inventoryId"
;