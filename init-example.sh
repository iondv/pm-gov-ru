node bin/import --src ./applications/pm-gov-ru --ns pm-gov-ru
node bin/setup pm-gov-ru --reset
node bin/setup viewlib
node bin/acl.js --d ./applications/pm-gov-ru/acl
node bin/adduser --name demo --pwd ion-demo
node bin/acl --u demo@local --role admin --p full
node bin/adduser --name operator --pwd ion-demo
node bin/acl --u operator@local --role Operators
node bin/acl --u operator@local --role Users
node bin/import-data --src ./applications/pm-gov-ru/data --ns pm-gov-ru

cp ./applications/pm-gov-ru/geo/data/regions/* ./modules/geomap/data/regions/*


export WORKER_COUNT=2
node bin/cluster
