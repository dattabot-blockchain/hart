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

echo "build artifatcs on harttruffle:dev container using docker compose "
docker-compose -f docker-compose-build.yml up --build --abort-on-container-exit
TR=$?
echo exitcode=${TR}

echo "removing harttruffle:dev container "
docker-compose -f docker-compose-test.yml rm -f
docker rmi harttruffle:dev

if [ ${TR} -eq 0 ]; then
    echo "tests passed!"
    exit 0
else
    echo "tests failed!"
    exit 1
fi
