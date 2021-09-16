
Loading all Yorkshire rows into local Postgres.

~ 20 GB
~ 200 million rows

    -- size of table
    select pg_size_pretty (pg_relation_size('zonal_stats'));
    
    -- estimate total row count
    SELECT n_live_tup
    FROM pg_stat_all_tables
    WHERE relname = 'zonal_stats';

I loaded the Yorkshire spatial framework into Postgres:

    # this is no good for pg 13!
    sudo apt install postgresql postgresql-contrib
    sudo apt-get install postgis --no-install-recommends
    # use this instead
    https://pgdash.io/blog/postgres-13-getting-started.html 

    # test connection
    psql "user=postgres password=aaaaaaaaaaaaaaaaaaaa host=localhost port=5432 dbname=habmon" -c "SELECT version();"
    # PostgreSQL 13.1, compiled by Visual C++ build 1914, 64-bit

    # test can connect to container running kartoza/postgis on port 5430
    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -c "SELECT version();"
    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -c "SELECT postgis_version()"


    Create ~/.pgpass https://stackoverflow.com/a/2893979 
    pg_dump -Fc --data-only -W -t zonal_stats > /c/postgis-docker-disk/zonalstats.dump

    pg_dump -Fc --data-only -h localhost -p 5432 -U postgres -W -d habmon -t zonal_stats > /c/postgis-docker-disk/zonalstats.dump
    pg_restore --data-only -h localhost -p 5430 -U docker -W -d gis -t zonal_stats /c/postgis-docker-disk/zonalstats.dump


    psql "user=docker password=docker host=localhost port=5430 dbname=gis" -f /c/postgis-docker-disk/liveng-0-dump.sql



select *
from zonal_stats
where framework='liveng-0'
 and indexname='NDVI'
 and date='2020-04-14'
 and polyid in (368442, 368484, 368487, 368489, 368564, 368830, 368832, 368873, 369030, 369031, 369034, 369040, 369041, 369042, 369178, 369179, 369181, 369182, 369253, 369260, 369262, 485273, 485277, 485278, 485445, 485446, 485478, 485485, 485829, 485831, 485832, 485833, 485845, 485846, 485847, 485848, 485849, 485850, 485851, 485852, 485855, 485856, 485857, 485884, 485887, 485888, 485889, 485890, 485891, 485892, 485893, 485894, 485895, 485896, 485897, 485898, 485899, 485900, 485901, 485902, 485911, 485912, 485913, 485914, 485915, 485916, 485917, 486085, 486728, 486729, 486740, 486742, 486758, 486759, 486760, 486761, 486770, 486771, 486772, 489586, 489588, 489764, 489765, 489766, 489767, 489768, 489770, 489771, 489791, 489792, 489793, 489794, 489795, 489796, 489797, 489798, 489799, 489800, 489801, 489802, 490138, 490139, 490140, 490141, 490142, 490143, 490144, 490156, 490157, 490158, 490165, 490166, 490167, 490168, 490169, 490170, 490171, 490172, 490173, 490174, 490175, 490176, 490177, 490178, 490179, 490180, 490181, 490182, 490185, 490186, 490196, 490197, 490198, 490199, 490201, 490202, 490203, 490547, 490554, 490986, 490988, 490990, 491678, 491680, 491707, 491712, 491720, 491721, 491733, 491744, 491755, 491772, 491773, 491775, 491776, 491777, 491778, 491779, 491780, 491785, 491786, 491787, 491788, 491789, 491790, 491797, 491798, 491799, 491800, 491801, 491802, 491830, 491831, 491832, 491833, 491834, 491841, 491859, 491873, 491874, 491875, 491876, 491898, 491899, 491900, 491901, 491907, 491908, 491909, 491910, 491911, 491912, 491913, 491914, 491915, 491916, 491917, 491918, 491928, 491929, 491940, 491941, 491942, 491943, 491944, 491945, 491946, 491947, 492523, 492524, 492525, 492529, 492531, 492532, 492546, 492547, 492548, 492549, 492551, 492552, 492553, 492555, 492558, 492561, 492562, 492568, 492577, 492589, 492591, 492937, 492938, 492939, 492940, 492941, 492942, 492945, 492946, 492947, 492948, 492949, 492950, 492956, 492957, 492958, 492959, 492960, 492961, 492962, 492963, 492964, 492965, 492966, 492967, 492968, 492969, 492970, 492975, 492978, 492979, 492980, 492982, 492983, 492984, 492985, 493666, 493667, 493668, 493674, 493675, 493685, 493686, 493687, 493688, 493689, 493690, 493691, 493692, 493693, 493694, 493695, 493704, 493705, 493706, 493708, 493709, 493710, 493734, 493735, 493738, 493739, 493740, 493742, 493753, 493754, 493756, 493757, 493758, 493759, 493760, 493761, 493762, 493763, 493777, 493792, 493793, 493794, 493795, 493801, 493802, 493803, 493804, 493805, 493806, 493808, 493826, 493830, 360122, 363001, 363345, 363371, 363421, 363627, 363628, 363648, 363649, 363650, 363651, 363652, 363654, 363656, 363661, 363683, 363686, 363693, 363762, 363783, 364009, 364010, 364011, 364051, 364052, 364053, 364087, 364089, 364090, 364117, 364118, 364119, 364120, 364126, 364140, 364141, 364142, 364143, 364151, 364155, 364159, 364192, 364197, 364198, 364199, 364200, 364201, 364202, 364229, 364230, 364275, 364284, 364356, 364360, 364374, 364375, 364376, 364379, 364397, 364399, 364400, 364402, 364405, 364439, 364440, 364441, 364457, 364458, 364459, 364460, 364461, 364463, 364483, 364484, 364485, 364486, 364488, 364490, 364491, 364494, 364523, 364524, 364525, 364526, 364527, 364528, 364529, 364560, 364561, 364562, 364563, 364564, 364565, 364566, 364567, 364568, 364569, 364570, 364572, 364575, 364579, 364621, 364622, 364623, 364624, 364625, 364626, 364627, 364628, 364629, 364630, 364631, 364632, 364633, 364634, 364636, 364645, 364648, 364661, 364662, 364663, 364665, 364669, 364672, 364718, 364719, 364720, 364721, 364742, 364743, 364744, 364745, 364746, 364747, 364748, 364749, 364750, 364751, 364752, 364753, 364754, 364756, 364767, 364768, 364769, 364770, 364771, 364772, 364773, 364775, 364776, 364777, 364778, 364779, 364780, 364802, 364803, 364804, 364806, 364820, 364821, 364822, 364833, 364834, 364835, 364836, 364837, 364839, 364840, 364841, 364843, 364844, 364845, 364870, 364871, 364872, 364873, 364874, 364876, 364879, 364882, 364924, 364925, 364926, 364927, 364928, 364929, 364930, 364933, 364934, 364936, 364971, 364972, 364973, 364974, 364975, 364976, 364977, 364978, 364979, 364980, 364982, 364983, 364984, 364986, 364987, 364989, 364993, 364994, 365002, 365003, 365006, 365008, 365074, 365075, 365076, 365077, 365078, 365079, 365101, 365102, 365103, 365104, 365105, 365122, 365123, 365124, 365125, 365126, 365127, 365128, 365129, 365131, 365132, 365133, 365158, 365159, 365160, 365161, 365162, 365163, 365164, 365165, 365166, 365167, 365168, 365169, 365170, 365183, 365184, 365185, 365186, 365187, 365188, 365205, 365206, 365207, 365208, 365209, 365211, 365212, 365213, 365214, 365215, 365216, 365239, 365240, 365241, 365242, 365243, 365244, 365245, 365246, 365247, 365248, 365249, 365250, 365275, 365276, 365277, 365278, 365279, 365280, 365281, 365282, 365283, 365284, 365285, 365287, 365288, 365289, 365290, 365291, 365292, 365318, 365319, 365320, 365321, 365322, 365323, 365324, 365325, 365327, 365329, 365330, 365332, 365333, 365334, 365336, 365337, 365338, 365339, 365340, 365341, 365342, 365343, 365346, 365347, 365348, 365349, 365350, 365351, 365353, 365354, 365355, 365356, 365358, 365412, 365413, 365414, 365415, 365416, 365417, 365418, 365419, 365428, 365429, 365430, 365431, 365432, 365433, 365434, 365435, 365436, 365450, 365451, 365452, 365453, 365454, 365455, 365456, 365457, 365458, 365479, 365480, 365481, 365482, 365496, 365497, 365498, 365499, 365500, 365501, 365502, 365503, 365505, 365507, 365524, 365525, 365526, 365527, 365529, 365530, 365531, 365532, 365533, 365534, 365535, 365577, 365578, 365579, 365580, 365581, 365582, 365583, 365584, 365585, 365586, 365587, 365593, 365606, 365607, 365608, 365609, 365610, 365611, 365612, 365613, 365614, 365615, 365616, 365617, 365618, 365619, 365622, 365626, 365648, 365649, 365650, 365651, 365652, 365653, 365654, 365655, 365656, 365657, 365658, 365659, 365660, 365661, 365662, 365663, 365665, 365666, 365668, 365669, 365670, 365671, 365672, 365673, 365674, 365675, 365676, 365677, 365679, 365680, 365681, 365682, 365683, 365684, 365685, 365686, 365688, 365689, 365739, 365740, 365741, 365742, 365743, 365744, 365745, 365746, 365748, 365753, 365761, 365762, 365763, 365764, 365765, 365766, 365767, 365768, 365769, 365770, 365771, 365772, 365773, 365774, 365775, 365790, 365791, 365792, 365793, 365794, 365795, 365796, 365797, 365798, 365799, 365800, 365801, 365802, 365803, 365804, 365805, 365806, 365807, 365808, 365809, 365810, 365811, 365812, 365813, 365814, 365815, 365816, 365817, 365818, 365819, 365820, 365821, 365822, 365823, 365824, 365825, 365834, 365836, 365837, 365852, 365853, 365854, 365855, 365856, 365857, 365858, 365859, 365860, 365862, 365863, 365879, 365880, 365881, 365882, 365883, 365901, 365902, 365903, 365904, 365905, 365906, 365907, 365908, 365909, 365910, 365911, 365912, 365913, 365914, 365915, 365916, 365917, 365919, 365920, 365921)




CREATE materialized VIEW habitat_stats_by_month AS
select
    framework,
    habitat,
    indexname,
    cast(date_part('year', date) as integer) as year,
    cast(date_part('month', date) as integer) as month,
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
from zonal_stats p
group by p.framework, p.habitat, date_part('year', p.date), date_part('month', p.date), p.indexname
;

CREATE INDEX habitat_stats_by_month_index
  ON habitat_stats_by_month (method, framework, habitat, indexname)	;

-- todo some of these stats are wrong - eg sd is null when only one row
CREATE materialized VIEW polygon_stats_by_month AS
select p.framework, p.polyid, p.indexname, date_part('year', p.date) as year, date_part('month', p.date) as month,
    count(*) as polygon_count, -- useful
    habitat,
    cast(avg(p.mean) as real) as mean,
--    cast(stddev(p.mean) as real) as mean_sd,
    cast(avg(p.median) as real) as median,
--     cast(stddev(p.median) as real) as median_sd,
    cast(min(p.min) as real) as min,
--     cast(stddev(p.min) as real) as min_sd,
    cast(max(p.max) as real) as max,
--     cast(stddev(p.max) as real) as max_sd,
    cast(avg(p.q1) as real) as q1,
--     cast(stddev(p.q1) as real) as q1_sd,
    cast(avg(p.q3) as real) as q3
--     cast(stddev(p.q3) as real) as q3_sd
from zonal_stats p
group by p.framework, p.polyid, p.indexname, date_part('year', p.date), date_part('month', p.date), habitat

--> SELECT 74402688
--> Query returned successfully in 26 min 14 secs.

CREATE INDEX polygon_stats_by_month_index
  ON polygon_stats_by_month (framework, polyid, indexname, year, month)	;

-- TODO when we have `frame` column
-- save the frames in a groupby
string_agg(p.frame, ',')


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
inner join habitat_stats_by_month h on p.framework = h.framework and p.habitat = h.habitat and p.indexname = h.indexname and p.year = h.year and p.month = h.month
;



Dynamo,
Say, UK is 10x Yorkshire, so 2 billion rows in UK (and 1/2 billion ongoing)
So 4 billion write requests (2 per 1KB row)
$1.4846 per million write request, ie $1.4846 × 10^-6 per write request. 
=> $6000 to load.
