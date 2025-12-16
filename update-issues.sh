#!/bin/bash

# Script to update GitHub issues with cleaned-up content
# Requires: GitHub CLI (gh) to be installed and authenticated
# Usage: ./update-issues.sh

REPO="raymondclowe/algebra_helper"

echo "Updating GitHub issues with cleaned-up content..."

# Issue #87
gh issue edit 87 \
  --repo "$REPO" \
  --title "Mobile layout is too cramped" \
  --body "Buttons at the bottom are cramped together. Sometimes the bottom button is partially off the edge of the screen, but there is wasted white space in the middle question area that could be trimmed to make it less cramped for the questions."

echo "Updated issue #87"

# Issue #86
gh issue edit 86 \
  --repo "$REPO" \
  --title "Long text in buttons is not wrapping to two lines" \
  --body "Button text that is too long should wrap to two lines instead of being truncated or causing layout issues."

echo "Updated issue #86"

# Issue #85
gh issue edit 85 \
  --repo "$REPO" \
  --title "Bug: Multiple answers are the same" \
  --body "Sometimes all of the answer choices are the same. The buttons each have the same content, but only one of them is considered correct. This should be prevented - all answer choices should be unique."

echo "Updated issue #85"

# Issue #84
gh issue edit 84 \
  --repo "$REPO" \
  --title "Google Sheets integration for homework tracking" \
  --body "Integrate with the student's existing homework practice logging sheet to add new rows whenever more than a couple of minutes is spent using the program, provided that they actually did real questions and scored higher than 50%.

To avoid complexity, this application could output the daily or session data into a CSV file or similar format, which is then saved in a temporary location such as Pastebin, GitHub Gist, or another temporary storage area that just needs a simple key to access. Then in Google Sheets, have a macro that polls that location to retrieve the data.

**Implementation Approach:**
1. Export session data to CSV format
2. Upload to temporary storage with unique key
3. Provide Google Sheets macro to import data using the key"

echo "Updated issue #84"

# Issue #83
gh issue edit 83 \
  --repo "$REPO" \
  --title "Display time spent on questions today and yesterday" \
  --body "Display time tracking numbers in a positive way with encouraging words like \"Keep it up!\", \"On track!\", and \"Let's do some more!\" - nothing negative. Students need to see numbers because they want to log the question types and time spent on them.

**Features:**
- Detail page should show question types and time spent on each question type
- Add a clock icon that can be clicked to show this view
- Keep historical records with day-by-day tracking
- Display a graph showing time spent per day trends (consistent, increasing, or decreasing)
- Hide detailed stats behind the clock icon, not on the main view
- Show total time spent today and yesterday in prominent locations"

echo "Updated issue #83"

# Issue #82
gh issue edit 82 \
  --repo "$REPO" \
  --title "Reduce font sizes on mobile devices" \
  --body "Reduce all font sizes on mobile devices, particularly the top-left and top-right messages showing the topic and encouragement text. These are currently too large and overlap other elements. Improve spacing and make them smaller for better mobile layout.

**Specific Areas to Address:**
- Topic name (top-left)
- Encouragement messages (top-right)
- Ensure proper spacing between elements
- Prevent text overlap"

echo "Updated issue #82"

# Issue #81
gh issue edit 81 \
  --repo "$REPO" \
  --title "Ask for user's name during setup" \
  --body "During the setup phase, calibration, or when the name field is not present, ask the user for their first name.

**Implementation:**
- Add a text input field with placeholder text \"John\" as an example
- Prompt: \"Please tell me your name\"
- Once captured, provide an option to correct it if there's a mistake
- Use the name occasionally in encouragement messages (e.g., \"Good work, John!\", \"That's great, Sarah!\")
- Don't overuse the name - it should appear occasionally, not in every prompt
- The goal is to make the student feel more personally engaged with their work"

echo "Updated issue #81"

# Issue #80
gh issue edit 80 \
  --repo "$REPO" \
  --title "Create \"Fixing Habits\" topic category" \
  --body "Create a new syllabus topic called \"Fixing Habits\" (or use a more positive name like \"Habit Improvement\").

**Implementation:**
- Use an internal category ID like 0 or 99 (not displayed to users)
- Keep the category separate from the numbered syllabus topics
- Manually develop question types that fit into this category
- Insert these questions occasionally into the question stream based on the student's success rate
- Use spaced repetition algorithm to determine when to show these questions

**Example Use Case:**
When a student does problems with square roots and forgets to write ± (plus-minus symbol) to indicate both positive and negative roots, create question types that remind them by requiring them to click the correct button that includes the ± symbol.

**Purpose:**
Address common mistakes and bad habits through targeted practice questions that reinforce correct methods."

echo "Updated issue #80"

# Issue #79
gh issue edit 79 \
  --repo "$REPO" \
  --title "Connect to paper homework for personalized practice" \
  --body "Create a mechanism to feed results from students' paper homework into the system to personalize practice.

**Data to Capture:**
- Topics being worked on
- Questions being attempted
- Correct and incorrect answers
- Mistakes being made, particularly frequent mistakes

**Goal:**
Identify areas for improvement, especially focusing on problems where the student knows the answer but makes mistakes due to bad habits. Provide targeted practice and drilling to reinforce correct methods.

**Architecture (Medium-term):**
1. Add an input mode where questions, answers, and problems can be entered into the system
2. Use AI to analyze the input and identify patterns
3. Generate new question types based on identified weaknesses
4. Create questions in a separate \"Habit Improvement\" category (outside the main syllabus)
5. Use spaced repetition to show these personalized questions intermittently

**Note:** This is a medium-term plan requiring AI integration, not a short-term implementation."

echo "Updated issue #79"

# Issue #78
gh issue edit 78 \
  --repo "$REPO" \
  --title "Convert stats page to educational and encouraging format" \
  --body "Convert the stats page from a numerical focus to something more educationally sound and encouraging.

**Changes:**
1. Remove percentage scores (which will always be around 70-80% by design)
2. Keep only these numerical stats:
   - Minutes spent today
   - Recent questions attempted

**Main Display:**
Show a list of topics following the syllabus structure with status for each:
- Positive statuses: \"Doing great!\", \"Mastered it!\", \"Perfect!\", \"Excellent work!\"
- Neutral/working statuses: \"Still working on it\", \"Progressing\", \"Challenging\"
- Hide topics that haven't been touched or have scores below 50%

**Data Structure Needed:**
Per topic, maintain:
- Average score
- Number of questions answered correctly
- Number of questions answered incorrectly
- Last question status (or last 5 questions with correct/incorrect)
- Ability to calculate recent performance

**Educational Pedagogy:**
Focus on encouraging language and positive reinforcement. Show progress and mastery rather than raw percentages. Don't display topics the student hasn't reached yet to avoid overwhelming them."

echo "Updated issue #78"

echo ""
echo "All issues have been updated successfully!"
echo "Please review the issues on GitHub to confirm the changes."
