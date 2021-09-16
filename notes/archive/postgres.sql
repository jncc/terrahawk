
-- drop all the views --
DROP VIEW
    habitat_stats_by_month,
    polygon_info_by_month
;

---------------------------
-- habitat_stats_by_month--
---------------------------
CREATE OR REPLACE VIEW habitat_stats_by_month AS
select
    framework,
    habitat,
    index,
    year,
    month,
    'sametype' as method,
    count(*) as polygon_count, -- useful
    cast(avg(p.mean) as real) as mean,
    cast(stddev(p.mean) as real) as mean_sd,
    cast(avg(p.median) as real) as median,
    cast(stddev(p.median) as real) as median_sd,
    cast(avg(p.min) as real) as min,
    cast(stddev(p.min) as real) as min_sd,
    cast(avg(p.max) as real) as max,
    cast(stddev(p.max) as real) as max_sd,
    cast(avg(p.q1) as real) as q1,
    cast(stddev(p.q1) as real) as q1_sd,
    cast(avg(p.q3) as real) as q3,
    cast(stddev(p.q3) as real) as q3_sd
from polygon_stats_by_month p
group by p.framework, p.habitat, p.year, p.month, p.index --, method
;

select 'habitat_stats_by_month' as View, count(*)
from habitat_stats_by_month
;

--------------
-- get_diff --
--------------
-- Function to calculate the "change" / "diff score" for a polygon.
-- Pass in eg mean for a polygon, mean for the previous year's polygon, and SD for the previous year's polygon.
CREATE OR REPLACE FUNCTION get_diff(this_stat real, other_stat real, other_stat_sd real) RETURNS integer AS $$
    BEGIN
		case
			when this_stat < (other_stat - (other_stat_sd * 2)) or this_stat > (other_stat + (other_stat_sd * 2)) then return 2;
			when this_stat < (other_stat - other_stat_sd) or this_stat > (other_stat + other_stat_sd) then return 1;
			else return 0;
		end case;
    END;
$$ LANGUAGE plpgsql
;

---------------------------
-- polygon_info_by_month --
---------------------------
-- The view that is actually used by the app.
CREATE OR REPLACE VIEW polygon_info_by_month AS
select
    p.*,
    h.method,
    get_diff(p.mean, h.mean, h.mean_sd) as mean_diff,
    get_diff(p.median, h.median, h.median_sd) as median_diff,
    get_diff(p.min, h.min, h.min_sd) as min_diff,
    get_diff(p.max, h.max, h.max_sd) as max_diff,
    get_diff(p.q1, h.q1, h.q1_sd) as q1_diff,
    get_diff(p.q3, h.q3, h.q3_sd) as q3_diff
from polygon_stats_by_month p
left join habitat_stats_by_month h on p.framework = h.framework and p.habitat = h.habitat and p.index = h.index and p.year = h.year and p.month = h.month
;

-----------------------------------
-- Index to make things feasible --
-----------------------------------
CREATE INDEX natural_index
ON polygon_stats_by_month(polyid, framework, index, year, month)
;
