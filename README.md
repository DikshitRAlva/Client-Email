## Backend Setup and API Flow Documentation

This document provides an overview of the backend setup, API flow, and configuration instructions to run this project. You can either run it directly on your local machine or via Docker.

Local Setup

## Step 1: Clone the Repository

bash
Copy code
git clone https://github.com/your-repo/project-name.git
cd project-name

## Step 2: Install Dependencies

For a Node.js environment, run:

bash
Copy code
npm install

## Step 3: Configure .env File

Create a .env file in the project root directory and add the following configuration:

env
Copy code

# OAuth Credentials for Outlook

CLIENT_ID=OUTLOOK_CLIENT_ID,
CLIENT_SECRET=OUTLOOK_CLIENT_SECRET,
TENANT_ID=common,
BASE_URL=BASE_URL,
ELASTICSEARCH_NODE=ELASTICSEARCH_NODE,
Replace OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET, and other placeholders with your own credentials and server information.

## Step 4: Install and Configure Elasticsearch

Make sure you have Elasticsearch installed and running on your machine. You can install it from here.

After installation, ensure that Elasticsearch is running on the configured ELASTICSEARCH_NODE URL (usually http://localhost:9200).

## Step 5: Run the Application

To run the app directly locally:

bash
Copy code
npm start
To run the app with Docker, ensure that you have Docker installed and configured. Build and run the Docker container with the following commands:

bash
Copy code
docker build -t project-name .
docker run -p 3000:3000 --env-file .env project-name
Docker Setup
If you prefer to run the app using Docker, the steps are simple.

Make sure you have Docker installed.

Build the Docker image:

bash
Copy code
docker build -t project-name .
Run the Docker container:

bash
Copy code
docker run -p 3000:3000 --env-file .env project-name
This will start the backend server on http://localhost:3000.
Swagger URL http://localhost:3000/api-docs/

Conclusion
By following these steps, you can set up the backend for authenticating with Outlook, synchronizing email data, and retrieving recent emails. Make sure Elasticsearch is installed and running to store and query emails.

=================================================================================================================================================================================

Prerequisites
Docker (for running the app as a container)
Node.js (for direct local setup)
Elasticsearch (local installation required for the app to function correctly)
OAuth Credentials for Outlook (you need to create an Azure App for this)
API Flow Overview
The backend interacts with Microsoft's Outlook API using OAuth for authentication, synchronizes email data, and stores it in a local Elasticsearch database. Below is a detailed API flow:

## Step 1: Get Authentication URL

To start the authentication process, use the following endpoint:

GET /api/auth/outlook
This API will return the authentication URL needed to authorize the user.

Response:
json
Copy code
{
"authUrl": "https://outlook.live.com/oauth/authorize?client_id=xyz&redirect_uri=abc"
}

## Step 2: Obtain User Information and Auth Token

After the user visits the URL returned from the previous step and grants permissions, they will be redirected to your specified callback URL. This will contain a code parameter.

Use the code received to get the authentication token and user details:

GET /api/auth/callback
Pass the code parameter from the OAuth redirection.

Request:

http
Copy code
GET /api/auth/callback?code=CODE_FROM_REDIRECT
Response:

json
Copy code
{
"userId": "local_user_id",
"authToken": "user_auth_token",
"expiryTime": "expiry_time"
}

## Step 3: Synchronize Data

Now that you have the userId and authToken, you can synchronize data with the local database by making the following API call:

POST /api/sync
Pass the userId and authToken to synchronize the data.

Request Body:

json
Copy code
{
"accessToken": "user_auth_token",
"userId": "local_user_id"
}
Response:

json
Copy code
{
"message": "Synchronization completed successfully."
}

## Step 4: Fetch Recent Emails

Once synchronization is complete, you can fetch the most recent emails synchronized in the local database:

GET /api/emails/{userId}
Replace {userId} with the userId obtained in Step 2.

Response:
json
Copy code
{
"emails": [
{
"subject": "Email Subject",
"from": "sender@example.com",
"receivedAt": "2024-12-23T12:34:56",
"body": "Email body content here"
},
// ... More email objects
]
}
