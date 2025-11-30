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
- Implementing authentication and authorization
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

- **JWT_SECRET**: A strong, random secret key for signing JSON Web Tokens (JWT).  
  _Example:_ `your_super_secret_key`

- **JWT_REFRESH_SECRET**: A strong, random secret key for signing JSON Web Tokens (JWT).  
  _Example:_ `your_super_secret_key`

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

- **GCS_BUCKET_NAME**: Bucket name for GCS claud storage.  
  _Example:_ `your_bucket_name`

### Steps to Set Up `.env`:

1. Create a file named `.env` in the root directory.
2. Add the required environment variables in the following format:

    ```sh
    CLOUD_DB_URL=<your-cloud-database-url>
    JWT_SECRET=<your-jwt-secret>
    JWT_REFRESH_SECRET=<your-jwt-secret>
    POSTGRES_USER=<your-username-for-login-to-postgre-database>
    POSTGRES_PASSWORD=<your-password-for-login-to-postgre-database>
    POSTGRES_DB=<your-database-name>
    PG_HOST=<your-database-host>
    PG_PORT=<your-database-port>
    GCS_BUCKET_NAME=<your_bucket_name>
    ```

3. Save the file.

## 3. Start the FORUM API Server

⚠️ **Note:** Run the following command to start the server:

```sh
npm start
```

If everything is set up correctly, you should see output similar to:

```
Server running on http://localhost:3000
Successfully connected to PostgreSQL database!
Successfully connected to MongoDB database!
```

## 4. Use Documentation

```
After server is on, go to http://localhost:3000/api/docs
```
