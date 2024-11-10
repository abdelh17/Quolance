# Quolance


## Description

This project presents a cutting-edge freelancing platform that connects freelancers and clients who need tech services. Freelancers can create profiles, submit proposals, and communicate with clients, while clients can post projects, review bids, and engage with freelancers. Machine learning models enhance the platform and user experience by improving freelancer profiles, evaluating proposal quality, and enforcing platform rules. An LLM-based chatbot offers more value to users who can find answers to frequently asked questions, as well as tips on how to improve their own journey through Quolance. With a focus on transparency, trust, and skill development, Quolance aims to set a new standard in the Canadian freelancing industry.

## Team members

| Name                      | Student ID | GitHub ID        | Email                          |
|---------------------------|------------|------------------|-------------------------------|
| **Abdelkader Habel**           | **40209153**   | **abdelh17**         | **abdelhabel@gmail.com**         |
| Adel Bouchatta             | 40175598   | Itek01           | adelbouchatta@gmail.com        |
| Anes Khadiri               | 40159080   | KA-devl          | anes1999@live.ca    |
| Chems-Eddine Saidi         | 40192094   | ChemsCode        | saidiceb@gmail.com             |
| Francesco Ferrato          | 26642152   | franf91          | francescoferrato937@gmail.com  |
| Ismail Feham               | 40213442   | FehamIsmail      | ismail.feham64@gmail.com       |
| Abdelmalek Anes            | 40229242   | NotMalek         | malekanes213@gmail.com         |
| Oussama Cherifi            | 40212275   | OussamaCherifi   | oussama.cherifi7@gmail.com     |
| Sathurthikan Saththyvel    | 40213455   | SSathu           | sathuow@gmail.com              |
| Zakaria El Manar El Bouanani| 40190432   | Zakaria0907      | zakaria.elmanar@gmail.com      |


## Developer Guide

**To get started, follow these steps:**

1. Clone the repository:
   ```sh
   git clone https://github.com/abdelh17/Quolance.git
   ```

---

### Frontend Setup

1. Navigate to the UI directory:
   ```sh
   cd quolance-ui
   ```

2. Install dependencies:
   ```sh
   npm install
   ```
3. Add `.env.local` file under the `quolance-ui` directory.
   It should contain the following:
   ```plaintext
   NEXT_PUBLIC_BASE_URL=http://localhost:8080
   ```
4. Run the frontend:
   ```sh
   npm run dev
   ```

---

### Backend Setup

To ease local development, services and dependencies—such as the PostgreSQL database and SMTP server for email—are containerized and automatically set up using the `quolance` script. You just need docker to be installed and ready!

#### Prerequisites

Before running the script, ensure the following:

1. **Docker**  
   Install Docker and ensure it’s running. [Download Docker here](https://www.docker.com/get-started).

2. **.env File**  
   Obtain the latest `.env` file from a teammate and place it in the root of the project at `Quolance/.env`.  
   Alternatively, you can create your own `.env` file with the following template (replace the values as needed):

   ```plaintext
   DB_DDL_AUTO=create-drop
   MAILPIT_SMTP_PORT=1025
   MAILPIT_UI_PORT=8025
   POSTGRES_DB=quolance-postgres-db
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_HOST_PORT=5434
   DATASOURCE_URL=jdbc:postgresql://localhost:5434/quolance-postgres-db
   POSTGRES_CONTAINER_PORT=5432
   POSTGRES_USER=postgres
   MAILPIT_USER=mailpit
   MAILPIT_PASSWORD=mailpit

   GITHUB_CLIENT_ID=github_id
   GITHUB_CLIENT_SECRET=github_secret
   GOOGLE_CLIENT_ID=google_id
   GOOGLE_CLIENT_SECRET=google_secret
   ```

---

### Running the Backend Setup Script

To set up the backend environment, run the following command from the root directory:

- **Windows**:
  ```bash
  ./scripts/quolance.sh
  ```
- **Mac/Linux**:
  ```bash
  sh ./scripts/quolance.sh
  ```

#### Script Options

Once you run the script, you’ll see a menu with the following options:
![image](https://github.com/user-attachments/assets/71957d87-6433-4bb6-bf33-81b7b13c8233)



1. **Create and Start Containers**  
   Choose option `1` and press Enter to start the containers. After starting, you should see your containers running...

   **In the Docker Desktop app:**
   ![image](https://github.com/user-attachments/assets/dc4bc539-60b8-4cf3-844d-47565dc96060)

   **Or by running `docker ps` in your terminal:**
   ![image](https://github.com/user-attachments/assets/6553c1bd-1a23-4f8b-9533-0c87abdc6393)

3. **Stop Containers**  
   Use option `2` to stop the containers without removing them (ideal if you want to keep your database).

4. **Destroy Containers**  
   Select option `3` to completely stop and remove the containers, resetting everything.

5. **Exit**  
   Option `4` exits the script.

---

### Building and Running the Application

Once the containers are running, on your terminal navigate to the `quolance-api` directory to build and run the backend:

```bash
cd quolance-api
./mvnw clean install
./mvnw spring-boot:run
```

---

## Wikis table of contents
- [Meeting minutes](https://github.com/abdelh17/Quolance/wiki/Meeting-Minutes)
- [Risks](https://github.com/abdelh17/Quolance/wiki/Risks)
- [Legal and Ethical Issues](https://github.com/abdelh17/Quolance/wiki/Legal-and-Ethical-Issues)
- [Economic](https://github.com/abdelh17/Quolance/wiki/Economic)
- [Personas](https://github.com/abdelh17/Quolance/wiki/Personas)
- [Diversity Statement](https://github.com/abdelh17/Quolance/wiki/Diversity-Statement)
- [Overall Architecture and Class Diagrams](https://github.com/abdelh17/Quolance/wiki/Overall-Architecture-and-Class-Diagrams)
- [Infrastructure and tools](https://github.com/abdelh17/Quolance/wiki/Infrastructure-and-tools)
- [Name Conventions](https://github.com/abdelh17/Quolance/wiki/Name-Conventions)
- [Testing Plan and Continuous Integration](https://github.com/abdelh17/Quolance/wiki/Testing-Plan-and-Continuous-Integration)
- [Performance](https://github.com/abdelh17/Quolance/wiki/Performance)
- [Security](https://github.com/abdelh17/Quolance/wiki/Security)
- [Deployment Plan and Infrastructure ](https://github.com/abdelh17/Quolance/wiki/Deployment-Plan-and-Infrastructure)
