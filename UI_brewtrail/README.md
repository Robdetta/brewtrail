write 2 unit tests

fix headers and add navigation

fix some UI changes
-within the friends list, and friend request
-breweryid page
-explore page search, and flat list view as well
-the profile page could use more attention as well,
maybe a report feature, most review breweries, top rated or something like
that to meet the project requirements
-the write review button

look into the color scheme as well

update documentation

To Do change the Header names to be dynamic

Setup Instructions for Local Development Environment

1. Set up your local development environment with Node.js, npm, and React Native CLI.
2. Git clone project  
   a. https://gitlab.com/wgu-gitlab-environment/student-repos/rhem1/d424-software-engineering-capstone
   b. **\*\***IMPORTANT**\*** open the brewtrail folder in a separate IDE because Expo is a universal app and has android configurations, the IDE will start indexing unnecessary dependencies.
   c. Like Cloud deploy, we’ll need the same 3 environment variables
   we’ll change the FRONTEND_URL to the localhost the Frontend is hosted on is the only real difference, and if you wanted to run a local Docker Postgres then we’d change the DATABASE_URL as well.
   d. Once those configurations are loaded the project is ready to run.
3. Put the application into a container to be used by docker-compose pull
   a. Make sure Docker Desktop is running
   b. Build the application.
   c. Here is the Dockerfile

d. docker build -t robdetta/brewtrail .
e. docker push robdetta/brewtrail:latest
f. any time new changes need to be made and deployed we need to run those commands then on the Droplet VPS we need to shutdown docker with
i. docker-compose down
ii. docker-compose up -d 4. Expo app
a. The project can be opened from the root directory with no issues
b. Cd into UI_brewtrail
c. Npm install
d. Npm run web
e. We will need to change the environment variable for
i. EXPO_PUBLIC_BASE_URL – to localhost:8080 or whichever port the Spring Boot application is using
