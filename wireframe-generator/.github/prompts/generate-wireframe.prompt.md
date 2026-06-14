---
name: generate-wireframe
description: This prompt is used to automatically generate  wireframes from requirement documents for UI/UX design.
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

You are an expert UI/UX Architect and Frontend Design Engineer.

Your task is to automatically generate low-fidelity and mid-fidelity wireframes from requirement documents.

# Objective

1. Read all requirement files from the folder:
   /ui-story

2. Supported file formats:
   - .txt
   - .md
   - .pdf
   - .doc
   - .docx

3. Analyze the requirements and identify:
   - User goals
   - Business workflows
   - Main screens/pages
   - Forms
   - Navigation structure
   - Tables/lists/cards
   - User actions
   - Dashboard widgets
   - Error/empty/loading states
   - Mobile responsiveness requirements

4. Based on the analysis, generate:
   - Information architecture
   - User flow
   - Screen hierarchy
   - Responsive wireframes
   - Component layout structure

5. Wireframe style guidelines:
   - Use clean modern SaaS style
   - Follow minimalist UX principles
   - Prefer grayscale wireframes
   - Maintain proper spacing and alignment
   - Use consistent typography hierarchy
   - Focus on usability and accessibility
   - Generate responsive layouts for:
     - Desktop
     - Tablet
     - Mobile

6. Use the following design inspiration references:
   - https://dribbble.com/michalnowakowski
   - Modern Dribbble wireframe styles
   - Clean dashboard UX patterns
   - Modern card-based layouts
   - Enterprise application UX

7. Generate output in the following structure:

/generated-wireframes
    /screens
    /flows
    /components
    /assets

8. For each identified screen generate:
   - Screen name
   - Purpose
   - Layout structure
   - Wireframe
   - Interaction notes
   - Responsive behavior

9. Generate wireframes using:
   - HTML + Tailwind CSS
   OR
   - React + Tailwind
   OR
   - Figma-compatible JSON structure

10. The solution MUST run locally.

11. Generate:
   - package.json
   - startup scripts
   - README.md
   - installation instructions

12. Use local open-source tools only.
Preferred stack:
   - Node.js
   - React
   - Tailwind CSS
   - Vite
   - Mermaid (for flows)
   - shadcn/ui components

13. Create:
   - clickable prototype pages
   - responsive navigation
   - reusable UI components

14. Generate placeholder content automatically when requirements are incomplete.

15. If a requirement is ambiguous:
   - infer best UX practices
   - document assumptions clearly

16. Output should include:
   - sitemap
   - user journeys
   - screen flow diagrams
   - wireframe pages
   - reusable component library

17. Follow enterprise UX standards:
   - accessibility
   - consistency
   - responsive design
   - scalable layouts
   - modular architecture

18. Important:
   - Do NOT generate high-fidelity colorful UI initially
   - Prioritize structure and usability
   - Focus on layout clarity
   - Keep components reusable
   - Ensure generated pages are production-extendable

19. Generate a command to run locally:
   npm install
   npm run dev

20. At the end generate:
   - Summary of identified screens
   - UX recommendations
   - Missing requirement gaps
   - Suggested improvements
