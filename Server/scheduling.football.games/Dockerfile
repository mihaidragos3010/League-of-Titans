FROM maven:3.9.5-eclipse-temurin-17

WORKDIR /app

COPY pom.xml .
COPY src ./src

ENTRYPOINT ["mvn", "spring-boot:run", "-DskipTests"]
