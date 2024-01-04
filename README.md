# PIA-Program-Manager

A database portal for [Plant It Again](https://www.plantitagain.org/), a nonprofit committed to creating exciting careers for adults with developmental and intellectual disabilities while recycling drought tolerant plants back into local communities. This web app aims to help streamline business operations for PIA such as managing programs, keeping track of students, and generating billing reports. 

## Table of Contents

- [Setup](#setup)
    - [Tools](#tools)
    - [Frontend](#frontend)
    - [Backend](#backend)
- [Linting](#linting)

## Setup

### Tools
Before starting development, make sure you have these tools installed:

- [Node.js](https://nodejs.org/en) - this is our JS runtime
- [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - this is our package manager
- [Postman](https://www.postman.com/downloads/) - helpful for testing API routes
- [MongoDB Community](https://www.mongodb.com/docs/manual/administration/install-community/) - necessary if you want to run database locally

### Backend

1. Copy the backend `.env` file into the backend directory (see the google drive)
2. `cd backend`
3. Run `npm install` to install all dependencies
4. If running the database locally, make sure to [start mongod](https://www.mongodb.com/docs/manual/tutorial/manage-mongodb-processes/#start-mongod-processes)
5. `npm run dev` to start the backend

If this works properly you should see a message in the terminal saying `listening on port 4000`

### Frontend

1. Copy the frontend `.env` file into the frontend directory (see the google drive) 
2. `cd frontend`
3. Run `npm install` to install all dependencies
4. Run `npm run dev` to start development server
5. Server is started on port 3000. Follow this [url](http://localhost:3000) and you should see the development page.

## Linting
Run these commands in the `backend` or `frontend` directories for linting and formating. Be sure to run these commands before pushing to github.

- `npm run lint-fix` - fixes all auto-fixable lint errors and reformats code
- `npm run lint-check` - check all lint errors or code style issues without modifying any files

