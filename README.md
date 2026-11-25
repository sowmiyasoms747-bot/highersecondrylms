# Learning Universe LMS – Higher Secondary (Classes 11–12)

Student app built from `Learning Universe LMS Journey Infographic.png`. React 18, TypeScript, Vite.

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # type-check and build to dist/

The app opens without a login, as one student with sample Class 12 Science progress. It starts on the Dashboard.
Change class or stream from the Dashboard menus, and exam goals in My Account, Preferences.
To start again, clear the site data in the browser.

## Screens

| No. | Screen | Address | File in `src/pages` |
| --- | --- | --- | --- |
| 04 | Dashboard | `/` | `Dashboard.tsx` |
| 05 | My Learning | `/learning` | `Learning.tsx` |
| 06 | Subject Syllabus / Chapters | `/subjects/physics` | `Learning.tsx` |
| 07 | Study Materials | `/materials` | `Materials.tsx` |
| 08 | Practice & Tests | `/practice` | `Practice.tsx` |
| 09 | Exam Preparation | `/exam` | `Exam.tsx` |
| 10 | Progress & Analytics | `/analytics` | `Analytics.tsx` |
| 11 | Study Planner | `/planner` | `Planner.tsx` |
| 12 | AI Study Buddy | `/buddy` | `Buddy.tsx` |
| 13 | Motivation Hub | `/motivation` | `Motivation.tsx` |
| 14 | Career & Colleges | `/career` | `Career.tsx` |
| 15 | My Account, Help | `/account`, `/help` | `Account.tsx` |

## Where things are

| Path | What it holds |
| --- | --- |
| `src/styles.css` | All styling; colours at the top, screen sizes at the end |
| `src/assets/icons` | Picture icons, made from `assert/dashboard` and `assert/study material` |
| `src/data/subjects.ts` | Streams, subjects, chapters and practice topics |
| `src/data/notes.ts` | Chapter notes (lectures, mind maps and sheets are made from these) |
| `src/data/questions.ts` | Question bank |
| `src/data/content.ts` | Exams, careers, colleges, quotes and FAQs |
| `src/state.tsx` | Student details, progress rules and saving |
| `src/buddy.ts` | AI Study Buddy answers |

## Content included

- Chapter lists: all subjects, both classes, all three streams.
- Notes: all 75 chapters of Class 12 Science. Other chapters show “Being prepared”; add them in `notes.ts`.
- Questions: 194. Class 12 Science has two per topic; other subjects have four each.

## Before going live

- **Data** is kept in the browser (`localStorage`). Connect `state.tsx` to your server. There is no login, so everyone on the same browser shares one record.
- **Tests** are marked in the browser, so answers can be seen by a technical user. Mark them on the server.
- **Video lectures** are slide lessons with an optional voice. Use your recordings in `Lecture` in `Materials.tsx`.
- **Previous year papers** link to the official exam sites.
- **AI Study Buddy** answers from the notes and solves quadratics and arithmetic. Replace `askBuddy` with your AI service.
- **Ask a Mentor** saves questions on the device only; no mentor receives them yet.
