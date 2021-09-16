
Sentinel-1 and Sentinel-2 time series
collated for each site (2015 - 2020).

Indices created from the imagery:
• NDVI - vegetation productivity
• NDWI - surface water
• NDMI - vegetation water content
• RVI - vegetation structure
• RVIv - vegetation structure

Partners provide habitat maps for each site (EUNIS, Phase 1, Priority Habitat Inventory).
Index statistics (e.g. mean, median) generated for each habitat polygon.

The app highlights polygons if their index value deviates significantly from the mean index
value of all other polygons of that habitat at that site.

-----
S2 grid: https://mappingsupport.com/p2/gissurfer.php?center=14SQH05239974&zoom=4&basemap=USA_basemap

-----

App code: "J:\GISprojects\EOMonitoringApplications\CUU_WP6_Projects\ChangeDetection\App"

App\CUUChangeDetection\config.yaml

statistics .txt file that holds the information used in the current app. The folder where everything for the Dark Peak example site is here:
"J:\GISprojects\EOMonitoringApplications\CUU_WP6_Projects\ChangeDetection\Statistics\DarkPeak_PHI"

In the “ZonalStats” folder there is the .txt file summarising all satellite imagery dates, for all polygons within the Dark Peak site (extracted from index layers). - "J:\GISprojects\EOMonitoringApplications\CUU_WP6_Projects\ChangeDetection\Statistics\DarkPeak_PHI\ZonalStats\DarkPeak_zonal_stats.txt"

From this file there is a function that summarises according to month/season to produce these files: "J:\GISprojects\EOMonitoringApplications\CUU_WP6_Projects\ChangeDetection\Statistics\DarkPeak_PHI\Monthly_statistics\DarkPeak_NDMI_monthly_stats.txt"

These are then used to visualise trends in the app. 

