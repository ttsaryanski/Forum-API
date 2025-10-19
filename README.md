# FORUM API - ⚠️Under development

- use /api/docs
- use /api/news

## ℹ️ About the Project

    This REST API was developed for educational purposes, as an exercise in working with TypeScript. The main goal is to practice type safety, apply best practices in code structure, and build server-side logic using Express and TypeScript.
    Note: This project is not intended for production use.

## 🛠️ Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (with Mongoose)
- PostgreSQL
- RESTful architecture
- Middleware and error handling
- Validation and modular routing

## 🎯 Learning Goals

- Practicing TypeScript in a backend environment
- Structuring a scalable REST API
- Applying type-safe request/response handling
- Implementing authentication and authorization (if present)
- Working with async/await and error management
- Using environment variables and configuration

# SETUP GUIDE

## 1. Install Dependencies

⚠️ **Note:** To install the necessary dependencies for the FORUM API server, open a terminal and run:

```sh
cd FORUM API
npm install
```

## 2. Environment Variables Configuration

⚠️ **Note:** To run this server, create a `.env` file in the root directory and configure the following environment variables:

### Required Variables:

- **CLOUD_DB_URL**: The connection string for a cloud database (e.g., MongoDB Atlas).  
  _Example:_ `mongodb+srv://username:password@cluster0.mongodb.net/dbname`
- **POSTGRES_USER**: The username for PostgreSQL database.  
  _Example:_ `user_name`
- **POSTGRES_PASSWORD**: The password for PostgreSQL database.  
  _Example:_ `password`
- **POSTGRES_DB**: The postgre database name.  
  _Example:_ `example_db`
- **PG_HOST**: The connection host for PostgreSQL database.
  _Example:_ `lochalhost`
- **PG_PORT**: The connection port for PostgreSQL database.  
  _Example:_ `5432`

### Steps to Set Up `.env`:

1. Create a file named `.env` in the root directory.
2. Add the required environment variables in the following format:

    ```sh
    CLOUD_DB_URL=<your-cloud-database-url>
    POSTGRES_USER=<your-username-for-login-to-postgre-database>
    POSTGRES_PASSWORD=<your-password-for-login-to-postgre-database>
    COSTGRES_DB=<your-database-name>
    PG_HOST=<your-database-host>
    PG_PORT=<your-database-port>
    ```

3. Save the file.

## 3. Start the FORUM API Server

⚠️ **Note:** Run the following command to start the server:

```sh
npm start
```

If everything is set up correctly, you should see output similar to:

```
Successfully connected to PostgreSQL database!
Successfully connected to the cloud DB!
Server running on http://localhost:3000
```

## 4. Use Documentation

```
After server is on, go to http://localhost:3000/api/docs
```
