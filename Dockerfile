FROM juwitaw/truffle-base-image:0.0.3
MAINTAINER Juwita Winadwiastuti <juwita.winadwiastuti@dattabot.io>
RUN mkdir /code && apk --update add python py-pip git make g++
WORKDIR /code
ADD . /code/
RUN npm install