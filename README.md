
# **Geo-Web Application on Finding the Nearest Parking Space (ParkEasy)**

## **By Ruth Ekeh and Chimezie Azih (ENGO 651 Group 5)**

In this project, we create a web application that addresses the critical issue of parking management in urban areas by allowing users to find the nearest on-street parking based on their live position and the API dataset on parking from Calgary's open data platform. To build this application, we deploy python's Django framework for the backend and React for the frontend. The app works with the MVT architecture for its backend and a modular design pattern for its frontend. By utilizing the user’s real-time location data, the application hopes to help reduce traffic congestion, parking search time, and associated environmental pollution. The user-friendly interface enables drivers to access real-time parking location information and make informed decisions while searching for parking zones. The web application is built with a simple interface to allow for easy use. We have used technologies and tools like the React framework, Django framework, as well as SQLite to create and manage the functionalities in the app. The primary data used for the app’s core functionality is sourced from Calgary’s Open Data API on on-street parking. Using the Haversine formular, the nearest parking lots to users are calculated and a suggestion based on this is made to the user.

## **The Tools Used**
For this project, we used Django framework for the backend and React (html, SCSS, javascript) for the frontend. The core API resources used for this project are the Calgary Open dataset API on on-street parking and the mapping API from Mapbox. You can find the full documentation of the On-street parkinh API [here](https://dev.socrata.com/foundry/data.calgary.ca/rhkg-vwwp).



## **Files in Project**
The project is split into two sections; a folder for the frontend and another for the backend. The Updated-backend folder contains the entire app, server, and database/models configurations enabled by the Django framework. It basically handles the core architecture of the webapp. There's a `requirements.txt` file which contains all the dependecies that is needed to be installed before running the project on your local machine. It has has a `manage.py` file that runs the local server. The other folder, `updated-parkeasy-frontend`, contains all the features of the user interface in separate component folders, which allow for easy manipulation of the frontend at a later time.


## **How to Run Project**
To run the project, you first need to ensure you have node 18 and python 3.11 or higher installed on your machine. On your terminal, navigate to the Updated-backend directory and create a virtual environment (running `python -m venv venv`). Inside the environment, run `pip install -r requirements.txt` to install all the required dependencies for the Django framework. After I this installation, run `python manage.py runserver` to start the local server enabled by Django for the web app. You should see this page on your browser when you open the provided port address ![server](https://github.com/chimaze12/Final-Project-Parkeasy/blob/master/images-for-readme/Server1.png).
When you confirm that the server is running fine on your browser as shown in the image above, navigate to the updated-parkeasy-frontend folder on your terminal and run `npm install`, after Which, run  `npm start`. Following these processes will launch the app on your default browser showing you the login page as the initial landing page. The follwoing are images showing the webapp in working:
![Login](https://github.com/chimaze12/Final-Project-Parkeasy/blob/master/images-for-readme/Sample1.png)



Image of the registration page:

![Registration](https://github.com/chimaze12/Final-Project-Parkeasy/blob/master/images-for-readme/sample2.png)



Image of the homepage without the navigation:
![Homepage Without Navigation Route](https://github.com/chimaze12/Final-Project-Parkeasy/blob/master/images-for-readme/homepgage.png)

With the navigation route:
![Homepage With Navigation](https://github.com/chimaze12/Final-Project-Parkeasy/blob/master/images-for-readme/homepage%202.png)

