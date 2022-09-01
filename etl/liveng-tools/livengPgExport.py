import cgi
from cmath import inf
from sqlite3 import paramstyle
import psycopg2
import csv
import os
import logging
from configparser import ConfigParser
from psycopg2.extras import RealDictCursor

log = logging.getLogger()
logging.basicConfig(level=logging.INFO)

parser = ConfigParser()

def exportTable(connection, tableName):
    csvfile = f"{tableName}.csv"

    csvPath = os.path.join(parser.get('general', 'workingFolder'), csvfile)

    cur = connection.cursor(cursor_factory=RealDictCursor)
    query = f"SELECT polyid, neighbour, zone FROM public.{tableName}"


    with open(csvPath, 'w', newline='\n') as file:
        log.info(f"Writing data from {tableName} to {csvPath}")
        writer = csv.writer(file)

        writer.writerow(["polyid", "neighbour", "zone"])

        cur.execute(query)
        i = 0
        for row in cur:
            writer.writerow([row["polyid"], row["neighbour"], row["zone"]])
            i = i + 1
               
    log.info(f"Wrote {i} lines from {tableName} to {csvPath}")
    
    cur.close()

def main():
    # read in config
    parser.read('livengPgExport.cfg')
    # read in list of tables matching pattern
    connectionString = f"dbname={parser.get('postgres', 'database')} user={parser.get('postgres', 'username')}"
    if parser.get('postgres', 'password') != "":
        connectionString = f"{connectionString} password={parser.get('postgres', 'password')}"

    conn = psycopg2.connect(connectionString)

    cur = conn.cursor(cursor_factory=RealDictCursor)

    log.info("Getting table names")

    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_name like '%_nearest50'")

    csvs = []

    log.info("Beginning export")
    for row in cur:
        # write out as csv
        csvPath = exportTable(conn, row["table_name"])
        csvs.append(csvPath)

    log.info("Export complete")

    cur.close()


if __name__ == "__main__":
    main()