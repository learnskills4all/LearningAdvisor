# TestING

This is a project created to test testing-engineers on their knowledge of testing. This project was build for and in collaberation with ING.

## Technologies

These are the technologies used in the [Setup](#setup) part.

- Nginx
- Docker
- Docker-compose
- npm

## Setup

There are two different ways of setting up this application. The first is for development purposes and the other for deployment. The key difference is that for the development the front-end is deployed as a separate application. This enables the feature of hot reloading during development. When the application is deployed in a production environment, we deploy front- and back-end as one application. This saves us on effort and on routing issues.

To start the setup first set up your environment and then go to either [Development Deployment](#development-deployment) or [Production Deployment](#production-deployment).

### Setting up the Environment

First, make sure that all the tools listed in [Technologies](#technologies) are installed. Then navigate to the desired directory where the project is to be installed. Then run the following command:

```
$ git clone https://gitlab.utwente.nl/s1866982/TestING.git
$ cd TestING
```

This command clones all needed files and navigates into the new directory.

### Development deployment

To set up a development evironment, two applications need to be started, starting with the front-end. To do this run the following commands:

```
$ cd advisor-frontend
$ npm install
$ npm start
```

These commands do the following: The first command navigates into the frontend directory. Then we install all needed node packages. Lastly we run the application using a development server. The application can now be seen in [http://localhost:3000](http://localhost:3000).

Secondly, the backend needs to be started. To do this open a new terminal and navigate to the folder the project is installed. Then run the following command:

```
$ docker-compose up
```

This will start a version of the backend that can be visited on [http://localhost:5000](http://localhost:5000) and a pgAdmin instance to interact with the database on [http://localhost:5050](http://localhost:5050).

If this is the first time you run the application locally, you must setup the server as well from the pgAdmin. Here is how:
1. Visit http://localhost:5050 to access pgAdmin.
2. Set your master password if not already done so and log in.
3. Click 'Create Server'.
4. Under the 'General' tab add your server's name (arbitrary, can be anything).
5. Under the 'Connection' tab make sure:
  - Host name is 'postgres'
  - Port is '5432'
  - Maintenance database is 'postgres'
  - Username is 'abc'
  - Password is 'abc'
6. Save your server.

After the server is setup you can connect to it on the left under the 'Servers' section.

### Production deployment

The setup for production is a little different. The frontend now needs to be build to a static file folder instead of deployed on a development server. To do this run the following commands (Use the first block on linux and the second block on windows)

linux:

```
$ cd advisor-frontend
$ npm install
$ npm run build
$ cp -R build ../advisor-backend/
$ cd ..
```

windows:

```
$ cd advisor-frontend
$ npm install
$ npm run build
$ Xcopy /E /I build ../advisor-backend/
$ cd ..
```

After these commands the frontend is build and copied to the backend folder. Now to start the whole application we run the following command:

```
$ docker-compose up
```

If this is not the first time you build the application, consider putting the --build tag at the end of this command. This will rebuild the docker image to use the latest changes.

Now only one thing remains and that is to connect this application to the outside world using Nginx. To do this a Nginx config file should be created. How this is done on your operating system can be read here https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/. In this config file we need to create a reverse proxy to [http://localhost:5000](http://localhost:5000) as this is where our application is running. To do this use the following link: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/.

## Creating an admin account

Now that the application is running the last thing remaining to do is create an admin account. To do this we need to create a account and edit its data in the database. This is done this way to avoid giving users the ability to create an admin account.
First create a new account on the login screen of the application. Save the password that it returns, this will be the admin password.
Now go to your domain and add port 5050 to it, so https:domain:5050. Here you will find the pgadmin application. We need to first connect it to the database. Login in the application, using the default password or the password that you set at the backend launch. Now on the dashboard click "Add new server". This will open a popup. In the first field, name add your desired name. Now go to the connection tab. In the hostname field type "postgres", the name of the docker network. For port add "5432". Lastly username and password TODO: abc. Now save and you will see the server added to the bar on the left.
Expand the server in the left bar, expand its one entry and then expand databases. From the databases expand testadviser, schemas, public, tables. Now you should see all sixteen tables. Right click the User table, choose the option "View/Edit Data" and in the submenu choose "All Rows". Now in the main part of the screen you should see all rows and the account you created. Double click the username and change it to "admin". Now dubble click the role and change it to "ADMIN". Now press F6 to save your changes. Check on the login screen of the TestING tool if the admin login works.

## Using SMTP mail service to function reset password feature

The project currently entails a forgot / reset password feature which is in place to aid the user to reset his / her password incase the user has forgotten the previous password and unable to log in to the application. This is done by first collecting the username and, their email ID. On verifying the username, an email is automatically sent to the user's email address where the user will be provided with a reset password link with a 15 minute link expiry time. The user can reset password using this link and the changes will be updated in the database.
The working of this feature uses an SMTP mail service called SendInBlue which allows sending upto 300 free email per day under the free subscription plan. Currently for the project, this free plan is being used and its registed under a student's email account. This may be updated by creating an account by the company and using any plan the company requires, or the company can even use any other SMTP service.
Once the company has created an account and subscribed to any subscription in the SMTP service, the company will receive the following credentials which will be used for authentication purpose in the codebase to use this automated email feature: The SMTP server hostname, SMTP login email ID, The SMTP key value.
These three credentials then are to be updated in the codebase. The path where these values are to be updated is as follows: "TestING\advisor-backend\.env" under the "# Credentials for using the SMTP email service for the forgot/reset password feature". Once the values are updated and saved. The code can be run again and the new subscription would be in place.

Do check with the "TestING\advisor-backend\.env" file for the variable "APP_URL" while running the application. Make sure the right "APP_URL" variable is chosen depending on where the server is hosted (public OR local).
