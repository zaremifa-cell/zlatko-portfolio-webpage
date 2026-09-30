# Zlatko Anastasov — Design & Frontend Portfolio

A personal portfolio presenting interface design and frontend implementation through two working case studies: **AbletonR** for the web and **Pardon** for iPhone.

**[Visit the portfolio](https://zlatko-anastasov-portfolio.vercel.app)** · [Selected work](https://zlatko-anastasov-portfolio.vercel.app/works.html) · [About & résumé](https://zlatko-anastasov-portfolio.vercel.app/information.html)

## Overview

Designed and built by Zlatko Anastasov. The site combines a monochrome visual system, typographic project pages, original canvas interactions and responsive navigation. It is implemented with HTML, CSS and vanilla JavaScript, without a frontend framework or build step.

The homepage's animated canvas is one part of the portfolio; the site also includes selected work, detailed case studies and professional information.

## Explore the work

| Project | Focus | Try it | Source |
| --- | --- | --- | --- |
| AbletonR | Independent Ableton redesign concept; UI/UX and Next.js frontend | [Live website](https://ableton-r.vercel.app) · [Case study](https://zlatko-anastasov-portfolio.vercel.app/abletonr.html) | [Repository](https://github.com/zaremifa-cell/AbletonR) |
| Pardon | Local-first SwiftUI chat interface for iPhone | [TestFlight beta](https://testflight.apple.com/join/bPwm7dY2) · [Case study](https://zlatko-anastasov-portfolio.vercel.app/pardon.html) | [Repository](https://github.com/zaremifa-cell/Pardon) |

AbletonR is an independent portfolio concept, not an official Ableton product. Pardon is a native beta; installation and AI features depend on device, OS and TestFlight availability. See each project's README for its scope and requirements.

## Run locally

Requirements: **Python 3** and a modern browser. No package installation, API keys or environment variables are required.

```sh
git clone https://github.com/zaremifa-cell/zlatko-portfolio-webpage.git
cd zlatko-portfolio-webpage
python3 -m http.server 5173
```

Open [localhost:5173](http://localhost:5173). If Node.js and npm are installed, `npm run start` is an equivalent shortcut to the same Python server.

## Project structure

```text
index.html / index.js             Canvas homepage and interaction
works.html / works.css / works.js Selected projects and previews
information.html / .css / .js     Background, contact links and résumé
abletonr.html / pardon.html       Individual project case studies
project.css / project.js          Shared case-study styles and behavior
shared-ui.css                    Shared interface styles
assets/                          Screenshots, graphics and résumé PDF
```

## Review and testing

There is no automated test suite configured; the existing `npm test` command is a placeholder and exits with an error. To review the site locally:

1. Open the homepage and try dragging the `zadesign` canvas wordmark.
2. Open and close the menu, then navigate to Work and Information.
3. Open both case studies and check their image galleries and external project links.
4. Check the résumé PDF from Information.
5. Repeat navigation at a narrow/mobile viewport and with a keyboard; inspect the browser console for errors.

The deployed site is hosted on Vercel. This repository is a static website, with no application backend, authentication or contact-form service.

## Development notes

[AGENTS.md](AGENTS.md) and the [interface design system](Geometric%20and%20Perceptual%20System%20for%20Text-Based%20Interfaces.md) record the project's design constraints. Screenshots and case-study assets are presentation material; they are not evidence of an automated test run.
