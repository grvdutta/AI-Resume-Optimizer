# AI Resume Optimizer (MVP)

A simple web application that analyzes a resume against a job description and suggests improvements.

This project was built as a learning project to understand **full-stack development and AI-assisted tools**.

## Features

* Upload a **PDF resume**
* Paste a **job description**
* Extract text from the resume
* Generate:

  * **Keyword match score**
  * **Missing keywords**
  * **Resume improvement suggestions**
* Simple and clean web interface

## Tech Stack

Frontend:

* HTML
* CSS
* Vanilla JavaScript

Backend:

* Node.js
* Express.js

Libraries:

* Multer (file uploads)
* pdf-parse (resume text extraction)
* dotenv (environment variables)

AI:

* Currently uses **mock AI analysis**
* Designed to support **OpenAI-compatible APIs** later

## Project Structure

```
ai-resume-optimizer
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads/            # Temporary uploaded resumes
│
├── server.js           # Express backend
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## How to Run Locally

1. Clone the repository

```
git clone https://github.com/yourusername/ai-resume-optimizer.git
```

2. Go into the project folder

```
cd ai-resume-optimizer
```

3. Install dependencies

```
npm install
```

4. Create a `.env` file

```
OPENAI_API_KEY=your_api_key_here
PORT=3000
```

5. Start the server

```
npm start
```

6. Open in browser

```
http://localhost:3000
```

## Current Limitations

* Uses **mock keyword matching** instead of real AI analysis
* Keyword detection is rule-based
* Resume parsing depends on PDF formatting

## Future Improvements

* Integrate **OpenAI API for intelligent resume analysis**
* Improve **keyword extraction**
* Add **React frontend**
* Implement **resume scoring visualization**
* Deploy using **Vercel / Netlify**

## Learning Goals

This project focuses on learning:

* Full-stack application structure
* File uploads in Node.js
* Basic resume parsing
* API-based AI integration
* Git and GitHub workflow

## Author

Computer Science Engineering (AI & ML) student exploring AI-assisted development tools and building practical full-stack projects.
