<div align="center">

  <img src="assets/graphql.png" alt="graphql-logo" width="200" height="auto" />
  <h1>GAIT - GraphQL API Interactive Tool</h1>
  
  <p>
   A project developed for the WADe subject, part of the Software Engineering Master program, which aims to develop a web-based tool that enables users to interact with GraphQL APIs using natural language constructs (text or voice).
  </p>
  
  
<p>
  <a href="https://github.com/delia1205/-WADe-Project/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/delia1205/-WADe-Project" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/delia1205/-WADe-Project" alt="last update" />
  </a>
  <a href="https://github.com/delia1205/-WADe-Project/network/members">
    <img src="https://img.shields.io/github/forks/delia1205/-WADe-Project" alt="forks" />
  </a>
  <a href="https://github.com/delia1205/-WADe-Project/stargazers">
    <img src="https://img.shields.io/github/stars/delia1205/-WADe-Project" alt="stars" />
  </a>
  <a href="https://github.com/delia1205/-WADe-Project/issues/">
    <img src="https://img.shields.io/github/issues/delia1205/-WADe-Project" alt="open issues" />
  </a>
  <a href="https://github.com/delia1205/-WADe-Project/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/delia1205/-WADe-Project.svg" alt="license" />
  </a>
</p>
   
<h4>
    <a href="demo/video-demo.mp4">View Demo</a>
  <span> · </span>
    <a href="documentation/tehnical-report.html">Documentation</a>
  <span> · </span>
    <a href="https://github.com/delia1205/-WADe-Project/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/delia1205/-WADe-Project/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Screenshots](#camera-screenshots)
  * [Tech Stack](#space_invader-tech-stack)
  * [Features](#dart-features)
  * [Color Reference](#art-color-reference)
  * [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Installation](#gear-installation)
  * [Running Tests](#test_tube-running-tests)
  * [Run Locally](#running-run-locally)
  * [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

  

<!-- About the Project -->
## :star2: About the Project


<!-- Screenshots -->
### :camera: Screenshots

<div align="center"> 
  <img src="screenshots/home-ss.png" alt="screenshot" />
  <img src="screenshots/signing-ss.png" alt="screenshot" />
  <img src="screenshots/query-ss.png" alt="screenshot" />
  <img src="screenshots/profile-ss-1.png" alt="screenshot" />
</div>


<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a></li>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://reactrouter.com/">React Router</a></li>
    <li><a href="https://axios-http.com/docs/intro">Axios</a></li>
    <li><a href="https://react-icons.github.io/react-icons/">React Icons</a></li>
    <li><a href="https://jwt.io/introduction">JSON Web Tokens</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.python.org/">Python</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://nodejs.org/en">Node.js</a></li>
    <li><a href="https://graphql.org/">GraphQL</a></li>
    <li><a href="https://cloud.google.com/speech-to-text?hl=en">Google Speech-to-Text</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
    <li><a href="https://firebase.google.com/docs/storage">Firebase Storage</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
  </ul>
</details>

<!-- Features -->
### :dart: Features

- **User Authentication**: Secure login functionality using credentials verified by an authentication API and a user profile database.
- **Voice Query Input**: Allows users to input queries via voice, leveraging Google’s Speech-to-Text API for conversion to text.
- **Language Translation**: Supports automatic translation of user queries and query results through Google Translate API, making the system accessible to multilingual users.
- **Dynamic Query Generation**: Translates user queries into dynamic GraphQL queries via a Query Generator API, which is then sent to public GraphQL APIs for data retrieval.
- **Query History and Bookmarking**: Users can save and bookmark queries or results, which are stored in the Query History Database. They can also download results for offline access.
- **Real-time Data Retrieval**: Integrates with various public GraphQL APIs to fetch and display relevant data based on user queries.
- **Intuitive User Interface**: Front-end interface built with React, offering a seamless and responsive experience for interacting with the system.

<!-- Color Reference -->
### :art: Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Background Colors | <img src="assets/bg1.png" alt="bg-color" width="15" height="15" /> #23004B <img src="assets/bg2.png" alt="bg-color" width="15" height="15" /> #3C50BE <img src="assets/bg3.png" alt="bg-color" width="15" height="15" /> #3084D2 <img src="assets/bg4.png" alt="bg-color" width="15" height="15" /> #5500AA |
| Primary Color | <img src="assets/primary.png" alt="primary-color" width="15" height="15" /> #164694 |
| Accent Color | <img src="assets/accent.png" alt="accent-color" width="15" height="15" /> #9333ea |
| Text Color | <img src="assets/text.png" alt="text-color" width="15" height="15" /> #FFFFFF |
| Button Color | <img src="assets/button.png" alt="button-color" width="15" height="15" /> #2a1b7e |


<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY`

`ANOTHER_API_KEY`

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses Yarn as package manager

```bash
 npm install --global yarn
```

<!-- Installation -->
### :gear: Installation

Install my-project with npm

```bash
  yarn install my-project
  cd my-project
```
   
<!-- Running Tests -->
### :test_tube: Running Tests

To run tests, run the following command

```bash
  yarn test test
```

<!-- Run Locally -->
### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/Louis3797/awesome-readme-template.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```


<!-- Deployment -->
### :triangular_flag_on_post: Deployment

To deploy this project run

```bash
  yarn deploy
```


<!-- Usage -->
## :eyes: Usage

Use this space to tell a little more about your project and how it can be used. Show additional screenshots, code samples, demos or link to other resources.


```javascript
import Component from 'my-project'

function App() {
  return <Component />
}
```

<!-- Roadmap -->
## :compass: Roadmap

* [x] Todo 1
* [ ] Todo 2


<!-- License -->
## :warning: License

Distributed under the no License. See LICENSE.txt for more information.


<!-- Contact -->
## :handshake: Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/Louis3797/awesome-readme-template](https://github.com/Louis3797/awesome-readme-template)


<!-- Acknowledgments -->
## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

 - [Shields.io](https://shields.io/)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
 - [Readme Template](https://github.com/othneildrew/Best-README-Template)
