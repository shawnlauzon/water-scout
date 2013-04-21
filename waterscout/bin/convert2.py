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
yllcorner = float(content[3].split(" ")[-1])
numrows = float(content[1].split(" ")[-1]);
nodata = content[5].split(" ")[-1]

idy = numrows - 1;
maxValue = 0;
for line in content[6:]:
    idx = 0;
    lastval = -9999;
    lastXllCorner = xllcorner
    lastYllCorner = yllcorner + (cellsize * idy)

    for val in line.strip().split(" "):
        if not val == "" and not (abs(float(val) - float(lastval)) < 1):
            maxValue = max(float(maxValue), float(val))
            feature = {}
            geometry = {}
            coord1 = [lastXllCorner, lastYllCorner]
            coord2 = [xllcorner + (cellsize * idx), yllcorner + (cellsize * (idy + 1))]
            geometry["coordinates"] = [coord1, coord2]
            geometry["type"] = "LineString"
            feature["type"] = "Feature"
            feature["geometry"] = geometry
            feature["properties"] = {"value": float(lastval)}
            features.append(feature)
            lastXllCorner = xllcorner + (cellsize * idx)
            lastYllCorner = yllcorner + (cellsize * idy)
            lastval = val
        idx += 1

    feature = {}
    geometry = {}
    coord1 = [lastXllCorner, lastYllCorner]
    coord2 = [xllcorner + (cellsize * idx), yllcorner + (cellsize * (idy + 1))]
    geometry["coordinates"] = [coord1, coord2]
    geometry["type"] = "LineString"
    feature["type"] = "Feature"
    feature["geometry"] = geometry
    feature["properties"] = {"value": float(lastval)}
    features.append(feature)
    idy -= 1


geojson["type"] = "FeatureCollection"
geojson["features"] = features
print(maxValue)


file = open(outfile, "w")
file.write(json.dumps(geojson, indent=2) )
file.close()