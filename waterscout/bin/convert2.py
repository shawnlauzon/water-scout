import codecs, json

infile = "data/tzauds00g.asc"
outfile= "data/geoJSON.json"

geojson = {}
features = []

curFile = codecs.open(infile, "r", "utf-8")
content = curFile.read().split('\r\n')
curFile.close()

cellsize = float(content[4].split(" ")[-1])
xllcorner = float(content[2].split(" ")[-1])
yllcorner = float(content[3].split(" ")[-1]) + (900 * cellsize)
nodata = content[5].split(" ")[-1]

idy = 0;

for line in content[906:]:
    idx = 0;
    lastval = nodata;
    lastXllCorner = xllcorner
    lastYllCorner = yllcorner

    for val in line.strip().split(" "):
        if not val == "" and not (abs(float(val) - float(lastval)) < 1):
#        if not val == nodata and not val == "" and not (abs(float(val) - float(lastval)) < 1) and not idx == 0:
            feature = {}
            geometry = {}
            coord1 = [lastXllCorner, lastYllCorner]
            coord2 = [xllcorner + (cellsize * idx), yllcorner + (cellsize * (idy + 1))]
            geometry["coordinates"] = [coord1, coord2]
            geometry["type"] = "LineString"
            feature["type"] = "Feature"
            feature["geometry"] = geometry
            feature["properties"] = {"value": val}
            features.append(feature)
            lastXllCorner = xllcorner + (cellsize * idx)
            lastYllCorner = yllcorner + (cellsize * idy)
        lastval = val
        idx += 1
    idy += 1

geojson["type"] = "FeatureCollection"
geojson["features"] = features


file = open(outfile, "w")
file.write(json.dumps(geojson, indent=2) )
file.close()