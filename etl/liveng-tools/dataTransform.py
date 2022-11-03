from asyncore import read
import csv

#appends the segment col to the liveng0 nearest neighbors dataset

sourcepath = "/home/felix/working/test/nearest50/liveng0/data.csv"
destpath = "/home/felix/working/test/nearest50/liveng0/liveng0_neighbors.csv"

def main():

    with open(sourcepath, 'r') as csvsource, open(destpath, 'w') as csvdest: 
        
        reader = csv.reader(csvsource, delimiter=',', quotechar='"')
        writer = csv.writer(csvdest, delimiter=',', quotechar='"')

        for index, row in enumerate(reader):
            if index == 0:
                row.append("segment")
            else:
                row.append("liveng0_0")

            writer.writerow(row)

if __name__ == "__main__":
    main()
