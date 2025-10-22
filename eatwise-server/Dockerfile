FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app
COPY . .
RUN mvn clean install -DskipTests=true

FROM openjdk:17-jdk-alpine
COPY --from=build /app/.env ./deploy/.env
COPY --from=build /app/target/eatwise-server-0.0.1-SNAPSHOT.jar ./deploy/eatwise-server-0.0.1-SNAPSHOT.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "./deploy/eatwise-server-0.0.1-SNAPSHOT.jar"]
