#!/bin/bash
echo "building dev:dev"

docker build --no-cache -t harttruffle:dev .
TR=$?
echo exitcode=${TR}
if [ ${TR} -eq 0 ]; then
    echo "build passed!"
else
    echo "build failed!"
    exit 1
fi

echo "testing the codes on harttruffle:dev container using docker compose "
docker-compose -f docker-compose-test.yml up --build --abort-on-container-exit &>> test.log
TR=$?
echo exitcode=${TR}

echo "removing harttruffle:dev container "
docker-compose -f docker-compose-test.yml rm -f
docker rmi harttruffle:dev
docker rmi trufflesuite/ganache-cli:v6.1.0

cat test.log

if [ ${TR} -eq 0 ]; then
    echo "tests passed!"
    exit 0
else
    echo "tests failed!"
    exit 1
fi
