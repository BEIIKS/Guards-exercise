# Guards Exercise

This project is a full-stack application consisting of a NestJS backend (monorepo) and a React frontend. It demonstrates a microservices architecture using Kafka for messaging and MongoDB for data storage.

## Project Structure

- **backend**: NestJS monorepo containing:
  - `apps/url-fetcher`: Microservice responsible for fetching URL content.
  - `apps/urls-api-gateway`: API Gateway for handling user requests.
  - `libs`: Shared libraries for configuration, database, messaging, and schemas.
- **frontend**: React application built with Vite.

## Getting Started

### 1. External Services
Start the required infrastructure (MongoDB, Kafka, Kafka UI) using Docker Compose:

```bash
docker-compose up -d
```

- **Kafka UI**: http://localhost:8080
- **MongoDB**: localhost:27017
- **Kafka**: localhost:9092

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure Environment Variables:
Create a `.env` file in the `backend` directory based on `.env.sample`.
Example `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/guards
KAFKA_BROKERS=localhost:9092
PORT=3000
URL_FETCHER_CONSUMER_GROUP=url-fetcher-consumer
```

#### Running the Backend

**Development Mode (Watch Mode):**
You need to run both applications in separate terminals:

*Terminal 1 - API Gateway:*
```bash
npm run start:dev urls-api-gateway
```

*Terminal 2 - Url-Fetcher Microservice:*
```bash
npm run start:dev url-fetcher
```

**Debug Mode:**
```bash
npm run start:debug urls-api-gateway
npm run start:debug url-fetcher
```
This will start the application with the `--debug` flag, allowing you to attach a debugger (default port 9229).

**Production Mode:**
```bash
npm run build urls-api-gateway
npm run build url-fetcher
npm run start:prod urls-api-gateway
npm run start:prod url-fetcher
```

#### Running Tests

**Unit Tests:**
```bash
npm test urls-api-gateway
npm test url-fetcher
- or -
npm test # in order to run tests for all applications
```

### 3. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure Environment Variables:
Create a `.env` file in the `frontend` directory (or `.env.development`).
Example `.env`:
```env
VITE_URL_GATEWAY_URL=http://localhost:3000/url
```

#### Running the Frontend

**Development Mode:**
```bash
npm run dev
```
The application will be available at http://localhost:5173 (or the port shown in the terminal).

**Build for Production:**
```bash
npm run build
npm run preview
```

## Debugging

- **Backend**: Run `npm run start:debug`. In VS Code, use the "Attach to Node.js" configuration to attach to the running process.
- **Frontend**: Use browser developer tools or configure a launch.json for Chrome/Edge debugging in VS Code.




## Notes & Future Improvements

For this assignment, I chose an approach where once the client submits a URL, the content and status do not change unless the client explicitly requests an update.
The client can submit the same URL again, which will trigger an update and refresh the last_updated timestamp.

In addition, here are several improvements I would have implemented if I had more time.
Please note there are obviously more but I choose to focus on the most important ones imo:

1. Content type detection – Identify whether the response content is plain text that can be displayed directly, or HTML returned from a web page.
If the content is HTML, I would add an IFrame component on the frontend that would be displayed when the user wants to view the content.

2. Storing complex content in S3 – For more complex content such as HTML, I would store the content in S3. In that case, the database would store only a URL pointing to the object in S3.

3. Availability over consistency – I chose to prioritize availability over consistency.
Once the URL-fetcher finishes preparing the message and triggers the URL handling function, it does not wait for the process to complete and immediately proceeds to the next message in the topic.
This is, of course, a product decision, but to handle cases where a message might fail because the process did not complete, I would implement a cron job that periodically scans the database (every X interval) and retries processing for any record whose status is still pending.

4. Proper Logging – Implement a structured logging system (e.g., Winston or Pino) to ensure better observability and debugging capabilities in production.

5. Database Abstraction – Abstract the database layer further (repository pattern) to decouple the business logic from the specific database implementation, allowing for easier switching between databases (e.g., from MongoDB to PostgreSQL) as I do in the messaging - kafka libs.