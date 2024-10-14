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


## Developer guide

## Getting Started

To get started, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/Quolance.git
   ```

2. Navigate to the project directory (In this case, we use the front-end directory as an example):
   ```sh
   cd quolance-ui
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

### Commit Structure

We use conventional commit messages to automate versioning and changelog generation. Each commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `ci`: Changes to our CI configuration files and scripts
- `vercel`: Changes related to Vercel deployment

#### Example

```
feat: add new button component

This new button component includes hover and focus states.

Closes #123
```

### Contributing

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Run tests and ensure linting passes
4. Commit your changes using the conventional commit format
5. Push your branch and create a pull request
For developers working on the Quolance UI project, please refer to the quolance-ui README for detailed setup and development instructions.
