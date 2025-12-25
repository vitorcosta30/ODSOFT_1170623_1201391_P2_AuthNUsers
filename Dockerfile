FROM openjdk:26-ea-slim-bookworm
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY target/*.jar /app/app.jar


ENTRYPOINT ["java", "-jar", "/app/app.jar"]
