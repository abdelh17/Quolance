# Quolance

## Release Demos
[Release 1](https://drive.google.com/file/d/1nvuJNa7pkpi7503dfrbAA316UC9RhYdX/view?usp=sharing)  
[Release 2](https://drive.google.com/file/d/1G78NhfGW8ulzw6STDvDtgC3hTTn-31cE/view?usp=sharing)
[Release 3](https://drive.google.com/file/d/1dP6QqEVKaLZEugkveU--s3gBc1I5LI09/view?usp=share_link)

## Important files
| File                                                                                                                                                                                                                              | Purpose                                                                                                                 |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [quolance-ui/src/api/auth-api.ts](https://github.com/abdelh17/Quolance/blob/main/quolance-ui/src/api/auth-api.ts) | This code provides an authentication guard that manages user login status, redirects, and handles login/logout actions. |
| [quolance-api/src/main/java/com/quolance/quolance_api/services/entity_services/impl/UserServiceImpl.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/services/entity_services/impl/UserServiceImpl.java) | Handles user creation, update, deletion, as well as resetting a forgotten password and verifying an email.              |
| [quolance-api/src/main/java/com/quolance/quolance_api/services/ai_models/GeminiService.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/services/ai_models/GeminiService.java) | Handles interactions between our codebase and the Gemini service.                                                       |
| [quolance-api/src/main/.../services/business_workflow/impl/FreelancerWorkflowServiceImpl.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/services/business_workflow/impl/FreelancerWorkflowServiceImpl.java) | Contains the core logic of the application from the freelancer POV.                                                     |
| [quolance-api/src/main/java/com/quolance/quolance_api/services/chat/impl/ChatServiceImpl.java](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/main/java/com/quolance/quolance_api/services/chat/impl/ChatServiceImpl.java)| This code allows users to use a chat system and communicate in-app.                                                     |

## Important tests
|Test|Purpose|
|----|-------|
|[getAllProjectsReturnsVisibleProjects()](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/integration/FreelancerControllerIntegrationTest.java)|Ensures only visible projects are returned, even closed ones.|
|[deleteFile_Success()](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/unit/services/entity_services/FileServiceUnitTest.java)|Ensures that once a file is deleted, it's information is not kept in database or cloud.|
|[create_Success()](https://github.com/abdelh17/Quolance/blob/main/quolance-api/src/test/java/com/quolance/quolance_api/unit/services/entity_services/UserServiceUnitTest.java)|Makes sure new users are able to create a new account, considering all requirements are met |
|[Error Create Project Flow](https://github.com/abdelh17/Quolance/blob/main/quolance-ui/cypress/e2e/client.cy.ts)|Tests to see if certain error messages are shown when creating project by client.|
|[Submitting an Application For Project](https://github.com/abdelh17/Quolance/blob/main/quolance-ui/cypress/e2e/freelancer.cy.ts)|Shows that an application to a project by a freelancer was submitted successfully. |


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
   # Database Configuration
   POSTGRES_DB=YOUR_DB_NAME
   POSTGRES_HOST_PORT=YOUR_HOST_PORT
   POSTGRES_CONTAINER_PORT=YOUR_DB_PORT
   LOCAL_DATASOURCE_URL=YOUR_JDBC_URL
   
   # Mail Configuration
   MAILPIT_SMTP_PORT=YOUR_SMTP_PORT
   MAILPIT_UI_PORT=YOUR_SMTP_UI_PORT
   MAILPIT_USER=YOUR_SMTP_USERNAME
   MAILPIT_PASSWORD=YOUR_SMTP_PASSWORD
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
   CLOUDINARY_API_ENV_VAR=YOUR_CLOUDINARY_URL
   
   # OAuth2 Configuration
   GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
   GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
   
   # AI variables
   MODEL_NAME=YOUR_PREFERRED_GEMINI_MODEL
   EMBEDDING_MODEL_NAME=YOUR_PREFERRED_GEMINI_EMBEDDING_MODEL
   GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
   
   # Admin Configuration
   ADMIN_EMAIL=CHOOSE_AN_ADMIN_EMAIL
   ADMIN_PASSWORD=CHOOSE_AN_ADMIN_PASSWORD
   
   # Logging Configuration
   LOG_FILE=YOUR_LOG_FILE_PATH
   
   # JPA Configuration
   DB_DDL_AUTO=YOUR_DB_DDL_AUTO
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
./mvnw spring-boot:run -D"spring-boot.run.profiles"=local
```

### Using profile to create a default admin user while building the springboot App

#### Admin credentials
You can add a profile at your springboot configuration to create an admin user with these credentials
   ```
      ADMIN_EMAIL=admin@quolance.com
      ADMIN_PASSWORD=admin
   ```
#### Running with the Profile

- Option 1: Running the backend with this command ```./mvnw spring-boot:run -Dspring-boot.run.profiles=local```
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
