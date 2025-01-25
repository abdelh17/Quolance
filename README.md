# Quolance

## Release Demos
[Release 1](https://drive.google.com/file/d/1nvuJNa7pkpi7503dfrbAA316UC9RhYdX/view?usp=sharing)

## Important files
| File                                                                                                                                                                                                                              | Purpose                                                                                                                                |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| [quolance-ui/src/api/auth-api.ts](https://github.com/abdelh17/Quolance/blob/main/quolance-ui/src/api/auth-api.ts)                                                                                                                 | This code provides an authentication guard that manages user login status, redirects, and handles login/logout actions.                |
| [quolance-ui/src/components/role-guard.ts](https://github.com/abdelh17/Quolance/blob/main/quolance-ui/src/components/role-guard.tsx)                                                                                              | This component provides a role-based access guard that renders child content only if the user's role matches one of the allowed roles. |
| [quolance-api/src/main/java/com/quolance/quolance_api/util/SecurityUtil.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/util/SecurityUtil.java)                         | This file is used to recover the authenticated user, in the controllers.                                                               |
| [quolance-api/src/main/java/com/quolance/quolance_api/services/auth/AuthServiceImpl.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/services/auth/AuthServiceImpl.java) | Provides session-based authentication.                                                                                                 |
| [quolance-api/src/main/java/com/quolance/quolance_api/services/impl/UserServiceImpl.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/services/impl/UserServiceImpl.java)                                                                                                                                       | User creation as well as password reset and core email sending on registration.                                                        |

## Important tests
|Test|Purpose|
|----|-------|
|[contextLoads](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/QuolanceApiApplicationTests.java)|Verifies that system correctly initializes|
|[testCreateProject](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/integration/controllers/ClientControllerIT.java)|Validates clients can create new projects|
|[testSubmitApplication](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/integration/controllers/FreelancerControllerIT.java)|Ensures freelancers can submit applications to projects|
|[testClientLogin](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/integration/controllers/ClientControllerIT.java)|Verifies client authentication and session works correctly|
|[testFreelancerLogin](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/integration/controllers/FreelancerControllerIT.java)|Verifies freelancer authentication and session works correctly|


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
| Oussama Cherifi            | 40212275   | OussamaCherifi   | oussamacherifi7@gmail.com     |
| Sathurthikan Saththyvel    | 40213455   | SSathu           | sathuow@gmail.com              |
| Zakaria El Manar El Bouanani| 40190432   | Zakaria0907      | zakaria.elmanar@gmail.com      |
| Fadi Nimer| 40183225   | Lukateki      | fadi_nimer@hotmail.com      |

## Diversity Statement
Quolance is designed to be inclusive and accessible to everyone, regardless of their background, race, gender, age or abilities. We firmly believe that diversity makes our platform stronger and helps us create better solutions for a wide range of users. By embracing and showing that different perspectives and experiences are encouraged, we can ensure that Quolance serves a variety of needs and remains fair to all individuals.

Our system will be user-friendly and accessible to everyone that might want to use the services of Quolance, aiming to break down barriers that might exclude certain groups.

Ultimately, our goal is to build a platform that promotes equality, respect, and positive impact while fostering a community where all users feel valued and supported.

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

   ADMIN_EMAIL=admin@quolance.com
   ADMIN_PASSWORD=admin

   CLOUDINARY_CLOUD_NAME=cloud_name
   CLOUDINARY_API_KEY=cloudinary_api_key
   CLOUDINARY_API_SECRET=cloudinary_api_secret
   CLOUDINARY_API_ENV_VAR=CLOUDINARY_URL=cloudinary_url

   LOG_FILE=./logs/quolance.log

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
  ./quolance-scripts/quolance.sh
  ```
- **Mac/Linux**:
  ```bash
  sh ./quolance-scripts/quolance.sh
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

### Using profile to create a default admin user while building the springboot App

#### Admin credentials
You can add a profile at your springboot configuration to create an admin user with these credentials
   ```
      ADMIN_EMAIL=admin@quolance.com
      ADMIN_PASSWORD=admin
   ```
#### Running with the Profile
- Option 1: Running the backend with this command ```mvn spring-boot:run -Dspring-boot.run.profiles=local```
- Option 2: Add the **local** profile to your intellij config ![image](https://github.com/user-attachments/assets/415e6a76-6381-4e36-b70b-a70bda18eb8d)

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
