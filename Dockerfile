# default python image
FROM python:alpine

# install dependencies
RUN pip install flask

# add files
ADD ./app /app

# default command
CMD flask --app /app run --host 0.0.0.0 --port 8000

