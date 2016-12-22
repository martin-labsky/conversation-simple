** Raw HOWTO build RnR service from documentation
by Jan Curin <jan_curin@cz.ibm.com>

In the folder with documentation such as developer-cloud\public-site-src\documents\doc\conversation\ run:
> perl Extract_rnr.pl

* Production

curin@IBM384-R90G2XPN /cygdrive/c/data/Workspaces/WEA/developer-cloud/public-site-src/documents/doc/conversation

curl -X POST -u "7e83c21e-d9cf-4366-b3ba-0fd9a0ddf741":"B7WfEORAEZqL" "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters" -d ""

{"solr_cluster_id":"sc37b37ace_752a_4180_a581_a8c2d2189087","cluster_name":"","cluster_size":"","solr_cluster_status":"NOT_AVAILABLE"}

curl -u "7e83c21e-d9cf-4366-b3ba-0fd9a0ddf741":"B7WfEORAEZqL" "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc37b37ace_752a_4180_a581_a8c2d2189087"

curl -X POST -H "Content-Type: application/zip" -u "7e83c21e-d9cf-4366-b3ba-0fd9a0ddf741":"B7WfEORAEZqL" "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc37b37ace_752a_4180_a581_a8c2d2189087/config/coco_config" --data-binary @cranfield-solr-config.zip

curl -X POST -u "7e83c21e-d9cf-4366-b3ba-0fd9a0ddf741":"B7WfEORAEZqL" "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc37b37ace_752a_4180_a581_a8c2d2189087/solr/admin/collections" -d "action=CREATE&name=coco_collection&collection.configName=coco_config"

<?xml version="1.0" encoding="UTF-8"?>
<response>
<lst name="responseHeader"><int name="status">0</int><int name="QTime">12287</int></lst><lst name="success"><lst name="10.176.232.69:5866_solr"><lst name="responseHeader"><int name="status">0</int><int name="QTime">2636</int></lst><str name="core">coco_collection_shard1_replica1</str></lst><lst name="10.176.39.3:5268_solr"><lst name="responseHeader"><int name="status">0</int><int name="QTime">2995</int></lst><str name="core">coco_collection_shard1_replica2</str></lst></lst>
</response>

curl -X POST -H "Content-Type: application/json" -u "7e83c21e-d9cf-4366-b3ba-0fd9a0ddf741":"B7WfEORAEZqL" "https://gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc37b37ace_752a_4180_a581_a8c2d2189087/solr/coco_collection/update" --data-binary @coco-data.json

{"responseHeader":{"status":0,"QTime":320}}

https://7e83c21e-d9cf-4366-b3ba-0fd9a0ddf741:B7WfEORAEZqL@gateway.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc37b37ace_752a_4180_a581_a8c2d2189087/solr/coco_collection/select?q=expression&wt=json&fl=id,title,author


* Staging

{
  "url": "https://gateway-s.watsonplatform.net/retrieve-and-rank/api",
  "password": "RPJoQfSg8bqn",
  "username": "db8733d0-400e-44f1-abb3-e6b9378cfca8"
}

curl -X POST -u "db8733d0-400e-44f1-abb3-e6b9378cfca8":"RPJoQfSg8bqn" "https://gateway-s.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters" -d ""

curl -u "db8733d0-400e-44f1-abb3-e6b9378cfca8":"RPJoQfSg8bqn" "https://gateway-s.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc9b17e21c_9f26_4a0b_9a44_2aed26397f2e"

{"solr_cluster_id":"sc9b17e21c_9f26_4a0b_9a44_2aed26397f2e","cluster_name":"","cluster_size":"","solr_cluster_status":"READY"}

curl -X POST -H "Content-Type: application/zip" -u "db8733d0-400e-44f1-abb3-e6b9378cfca8":"RPJoQfSg8bqn" "https://gateway-s.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc9b17e21c_9f26_4a0b_9a44_2aed26397f2e/config/coco_config" --data-binary @cranfield-solr-config.zip

curl -X POST -u "db8733d0-400e-44f1-abb3-e6b9378cfca8":"RPJoQfSg8bqn" "https://gateway-s.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc9b17e21c_9f26_4a0b_9a44_2aed26397f2e/solr/admin/collections" -d "action=CREATE&name=coco_collection&collection.configName=coco_config"

<?xml version="1.0" encoding="UTF-8"?>
<response>
<lst name="responseHeader"><int name="status">0</int><int name="QTime">12600</in  t></lst><lst name="success"><lst name="10.176.145.14:5907_solr"><lst name="respo  nseHeader"><int name="status">0</int><int name="QTime">2846</int></lst><str name  ="core">coco_collection_shard1_replica2</str></lst><lst name="10.176.144.9:6912_  solr"><lst name="responseHeader"><int name="status">0</int><int name="QTime">317  1</int></lst><str name="core">coco_collection_shard1_replica1</str></lst></lst>
</response>


curl -X POST -H "Content-Type: application/json" -u "db8733d0-400e-44f1-abb3-e6b9378cfca8":"RPJoQfSg8bqn" "https://gateway-s.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc9b17e21c_9f26_4a0b_9a44_2aed26397f2e/solr/coco_collection/update" --data-binary @coco-data.json

https://db8733d0-400e-44f1-abb3-e6b9378cfca8:RPJoQfSg8bqn@gateway-s.watsonplatform.net/retrieve-and-rank/api/v1/solr_clusters/sc9b17e21c_9f26_4a0b_9a44_2aed26397f2e/solr/coco_collection/select?q=expression&wt=json&fl=id,title,author
