import { ScanItem, UserStats } from '../types';

export const INITIAL_STATS: UserStats = {
  totalAnalyzed: 0,
  avgAtsScore: 0,
  aiRewritesUsed: 0,
};

export const INITIAL_SCANS: ScanItem[] = [];

export const SAMPLE_RESUME_TEXT = `ALEX M.
Software Engineer | San Francisco, CA | alex.m@cse.edu | github.com/alexm-cse

PROFESSIONAL SUMMARY
Results-driven Software Engineer with 3+ years of experience building modern web applications using React, TypeScript, and Node.js. Passionate about user interface performance, RESTful microservices, and clean system architecture.

WORK EXPERIENCE
Software Engineer | TechCorp Inc., San Francisco, CA | 2021 - Present
- Worked on building user interfaces using React and Javascript for the client web app.
- Helped write backend database queries and REST APIs for backend service.
- Was responsible for fixing bug tickets and updating codebase documentation.
- Participated in daily Agile standups and bi-weekly sprint planning meetings.

Web Developer Intern | WebInnovations Studio | 2020 - 2021
- Created landing pages using HTML, CSS, JavaScript, and Bootstrap.
- Assisted senior engineers with testing frontend bug fixes across Safari and Chrome.

TECHNICAL SKILLS
- Languages & Frameworks: JavaScript (ES6+), TypeScript, React, Next.js, Node.js, Express, HTML5, CSS3/Tailwind
- Databases & Tools: PostgreSQL, MongoDB, Git, Docker, REST APIs, Jest, Vite
- Methodologies: Agile / Scrum, CI/CD, Code Reviews, Performance Optimization`;

export const SAMPLE_JOB_DESCRIPTION = `We are seeking a Full Stack Software Engineer to join our fast-paced Engineering team.

Responsibilities:
- Architect and develop high-performance web applications using React, TypeScript, and Node.js.
- Design, build, and optimize RESTful APIs and PostgreSQL database schemas.
- Collaborate with product designers and backend engineers to implement intuitive UI features.
- Spearhead performance improvements, code quality standards, and CI/CD automation.

Requirements:
- 2+ years of professional experience with React and modern JavaScript/TypeScript.
- Experience building RESTful APIs with Node.js and Express.
- Solid understanding of database design (SQL/PostgreSQL or NoSQL).
- Experience with Docker, GraphQL, AWS, and unit testing frameworks is a major plus.`;
