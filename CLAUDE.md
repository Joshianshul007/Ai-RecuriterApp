# 🚀 AI Recruitment Platform — Dashboard Implementation Plan

---

# 🎯 Overview

The dashboard is the core experience of the platform. It is divided into two main parts:

1. 👤 Candidate Dashboard — Profile building with AI assistance  
2. 🧑‍💼 Recruiter Dashboard — Candidate evaluation and comparison  

The goal is to create an **AI-driven, intuitive, and efficient user experience**.

---

# 👤 Candidate Dashboard

## 🎯 Objective

Enable users to:
- Build their profile using AI
- Track progress
- Improve their profile quality

---

## 🧭 Layout Structure

- Sidebar (Navigation)
- Topbar (User info + progress + save status)
- Main Content Area

---

## 📌 Sidebar Navigation

- Dashboard
- Build Profile
- My Profile
- Settings

---

## 🔝 Topbar

- User Name
- Profile Completion Progress (Progress Bar)
- Auto-save Status ("Saved just now")

---

## 🏠 Dashboard Home

### Components

### 1. Profile Completion Card
- Shows completion percentage (e.g., 70%)
- Displays missing sections:
  - Add Projects
  - Add Experience
- CTA: **Complete Profile**

---

### 2. AI Suggestions Card
- Suggested Skills
- Suggested Roles

Example:
- Backend Developer
- Machine Learning Engineer

---

### 3. Recent Activity
- Last updated section
- Last AI-generated content

---

### 4. Quick Actions
- Add Project
- Add Experience
- Generate Summary

---

# 🧠 AI Profile Builder (Core Feature)

## 🎯 Objective

Convert user input into structured professional data using AI

---

## 🧭 Layout

- Left: User Input Area
- Right: AI Output Preview

---

## 📝 Flow

### Step 1: User Input
User writes:
"I built a finance extractor using AI"

---

### Step 2: AI Processing
System generates:
- Structured bullet points
- Extracted skills

---

### Step 3: User Actions

- Accept
- Edit
- Regenerate

---

## 💡 Key UI Features

### Skill Chips
- Click to accept/remove skills

### Progress Tracker
- Projects ✔
- Experience ❌
- Skills ✔

---

# 📄 Profile Preview Page

## 🎯 Objective

Display final structured profile (resume-like)

---

## Sections

- Summary
- Skills
- Projects
- Experience

---

## Features

- Edit sections
- Download Resume (PDF)
- Share Profile Link

---

# 🧑‍💼 Recruiter Dashboard

## 🎯 Objective

Help recruiters:
- Evaluate candidates quickly
- Compare candidates efficiently
- Shortlist best candidates

---

## 🧭 Layout

- Sidebar
- Candidate List
- Filters Panel

---

## 📋 Candidate List

Each candidate card shows:
- Name
- Role
- Top Skills
- Match Score
- Short Summary

---

## 🎯 Filters Panel

- Skills filter
- Experience level
- Match score %

---

# 📄 Candidate Profile View

## Sections

- Summary
- Skills
- Projects
- Experience

---

## 🔥 AI Insights Panel

Displays:
- Match Score (e.g., 85%)
- Strengths
- Missing Skills

---

## Actions

- Shortlist
- Reject
- Add Notes

---

# ⚖️ Compare Candidates Feature

## 🎯 Objective

Enable side-by-side comparison

---

## Layout

Candidate A | Candidate B

---

## Comparison Table

| Feature      | Candidate A | Candidate B |
|-------------|------------|------------|
| Skills      | ✔          | ✔          |
| Experience  | ✔          | ❌         |
| Match Score | 85%        | 72%        |

---

# ⭐ Shortlist Dashboard

## Features

- Saved candidates
- Notes
- Quick access cards

---

# ⚡ Key Features Summary

## Candidate Side

- AI-assisted profile building
- Skill suggestions
- Auto-save
- Progress tracking

---

## Recruiter Side

- Match score
- Filters
- Compare candidates
- Shortlist system

---

# 🧩 Component Breakdown

Reusable components:

- Sidebar.tsx
- Topbar.tsx
- ProgressBar.tsx
- CandidateCard.tsx
- SkillChip.tsx
- AIOutputCard.tsx
- CompareTable.tsx

---

# 📅 Implementation Timeline

## Day 1
- Dashboard layout (Sidebar + Topbar)

## Day 2
- Candidate dashboard home

## Day 3
- AI Profile Builder

## Day 4
- Recruiter dashboard

## Day 5
- Compare feature + UI polish

---

# 🏆 Conclusion

The dashboard is designed to:

- Replace resumes with structured profiles
- Use AI for intelligent data processing
- Improve recruiter efficiency
- Provide a smooth and guided user experience

This ensures:
- Better hiring decisions
- Better candidate representation
- Faster recruitment workflow

---