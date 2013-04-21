import codecs, json

infile = "data/tzauds00g.asc"
outfile= "json/geoJSON.json"

geojson = {}
features = []

curFile = codecs.open(infile, "r", "utf-8")
content = curFile.read().split('\r\n')
curFile.close()

cellsize = float(content[4].split(" ")[-1])
xllcorner = float(content[2].split(" ")[-1])
yllcorner = float(content[3].split(" ")[-1]) + (1300 * cellsize)
nodata = content[5].split(" ")[-1]

idy = 0;
#for line in content[6:]:
for line in content[1300:]:
    idx = 0;
    for val in line.split(" "):
        if not val == nodata and not val == "":
            feature = {}
            geometry = {}
            geometry["coordinates"] = [xllcorner + (cellsize * idx), yllcorner + (cellsize * idy)]
            geometry["type"] = "Point"
            feature["type"] = "Feature"
            feature["geometry"] = geometry
            feature["properties"] = {"value": val}
            features.append(feature)
        idx += 1
    idy += 1

geojson["type"] = "FeatureCollection"
geojson["features"] = features


file = open(outfile, "w")
file.write(json.dumps(geojson, indent=2) )
file.close()