from python:3.11.1-buster

WORKDIR /

RUN pip install runpod
RUN pip install numpy bertopic

ADD test_input.json .
ADD src ./src

CMD [ "python", "-u", "/src/handler.py" ]
