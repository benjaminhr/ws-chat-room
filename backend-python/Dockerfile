FROM python:3.7-slim

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y git
RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 443
EXPOSE 8000
# ENV NAME World

CMD ["./start.sh"]
