FROM openjdk:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the jar file into the container
COPY ./build/libs/brewtrail-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

# Run the jar file on container startup
ENTRYPOINT ["java", "-jar", "/app/app.jar"]