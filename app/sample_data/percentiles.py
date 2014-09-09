#!/usr/bin/env python
""" Script to pull in the 10th and 90th percentiles of a set

of models and write them out to files. Requires the node_js server
to be running locally.

Limited to a single season, region and variable.

"""

import urllib
import simplejson
import numpy as np
import copy

models = ["ACCESS1-0", "ACCESS1-3", "CESM1-BGC", "CSIRO-Mk3-6-0",
          "CanESM2", "GFDL-ESM2G", "GISS-E2-H", "MPI-ESM-LR",
          "bcc-csm1-1"]

experiments = ["historical", "rcp45"]

url_base = "http://127.0.0.1:1250/?"

# Load in the data from the server.
jsons = {}
for experiment in experiments:
    jsons[experiment] = {}
    for model in models:
        this_dict = {"model": model,
                     "variable": "tas",
                     "experiment": experiment,
                     "season": "djf",
                     "region": "AUS"}
        
        this_string = urllib.urlencode(this_dict)
        print this_string
        req = urllib.urlopen(url_base + this_string)
        this_json = simplejson.load(req)
        jsons[experiment][model] = (this_json)

# Put the results into an array.
results = {}
for experiment in experiments:
    rows = jsons[experiment][models[0]]["table"]["rows"]
    num_rows = len(rows)
    num_models = len(models)
    new_array = np.zeros( (num_models, num_rows) )

    for j, model in enumerate(models):
        rows = jsons[experiment][model]["table"]["rows"]
        for i, row in enumerate(rows):
            new_array[j, i] = row[1]
    
    results[experiment] = {}
    results[experiment]["10pctl"] = np.percentile(new_array, 10, axis=0)
    results[experiment]["90pctl"] = np.percentile(new_array, 90, axis=0)
    results[experiment]["mean"] = np.mean(new_array, axis=0)

# Calculate the percentiles and write them out to a json.
for experiment in experiments:
    
    example = jsons[experiment][models[0]]

    outfile = experiment + '_annual_tas_AUS_ensemble.json'
    
    new_json10 = copy.deepcopy(example)
    rows = new_json10["table"]["rows"]
    for i, row in enumerate(rows):
        row[1] = results[experiment]["10pctl"][i]
    
    new_json90 = copy.deepcopy(example)
    rows = new_json90["table"]["rows"]
    for i, row in enumerate(rows):
        row[1] = results[experiment]["90pctl"][i]

    new_ens = copy.deepcopy(example)
    rows = new_ens["table"]["rows"]
    for i, row in enumerate(rows):
        row[1] = results[experiment]["mean"][i]

    outjson = {"pctl10": new_json10,
               "pctl90": new_json90,
               "mean": new_ens}

    f = open(outfile, 'w')
    f.write(simplejson.dumps(outjson, separators=(',',':')))
    f.close()
