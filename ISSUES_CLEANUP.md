# Cleaned Up GitHub Issues

This document contains the cleaned-up versions of issues #78-87 that were created via voice typing and contain formatting, grammar, and spelling errors.

## Issue #87: Mobile Layout Is Too Cramped

**Original Title:** Lay out on mobile is too cramped

**Cleaned Title:** Mobile layout is too cramped

**Original Body:**
> Button to the bottom are cramped together.Sometimes the bottom button is partially off the edge of the screen , but there is wasted white space blank space in the middle question area that could be trimmed in order to make it less cramped for the questions

**Cleaned Body:**
Buttons at the bottom are cramped together. Sometimes the bottom button is partially off the edge of the screen, but there is wasted white space in the middle question area that could be trimmed to make it less cramped for the questions.

---

## Issue #86: Long Text in Buttons Is Not Wrapping to Two Lines

**Original Title:** Long text in buttons is not wrapping two lines

**Cleaned Title:** Long text in buttons is not wrapping to two lines

**Original Body:** (empty)

**Cleaned Body:**
Button text that is too long should wrap to two lines instead of being truncated or causing layout issues.

---

## Issue #85: Bug - Multiple Answers Are the Same

**Original Title:** Bug fix multiple answers at the same

**Cleaned Title:** Bug: Multiple answers are the same

**Original Body:**
> Sometimes all of the answers are the same.The buttons each have the same content , but only one of them is considered correct

**Cleaned Body:**
Sometimes all of the answer choices are the same. The buttons each have the same content, but only one of them is considered correct. This should be prevented - all answer choices should be unique.

---

## Issue #84: Google Sheets Integration

**Original Title:** Google sheets integration

**Cleaned Title:** Google Sheets integration for homework tracking

**Original Body:**
> Inte.
> Grate with the student's existing homework.Practice logging sheet to add new rows whenever more than a couple of minutes is spent using the program provided that they actually did real questions and higher than  fifty percent school
> 
> To avoid complexity may need to have this application. Just output the daily or session data into a csv file or similar which is then saved in some temporary locations, such as a paste hint, a paste, bin or gist or other temporary storage area that just needs a simple key to access.  And then in google sheets have a macro that polls that location

**Cleaned Body:**
Integrate with the student's existing homework practice logging sheet to add new rows whenever more than a couple of minutes is spent using the program, provided that they actually did real questions and scored higher than 50%.

To avoid complexity, this application could output the daily or session data into a CSV file or similar format, which is then saved in a temporary location such as Pastebin, GitHub Gist, or another temporary storage area that just needs a simple key to access. Then in Google Sheets, have a macro that polls that location to retrieve the data.

**Implementation Approach:**
1. Export session data to CSV format
2. Upload to temporary storage with unique key
3. Provide Google Sheets macro to import data using the key

---

## Issue #83: Expose Time Spent on Questions Today and Yesterday

**Original Title:** Expose time dispense on questions today and time spent yesterday

**Cleaned Title:** Display time spent on questions today and yesterday

**Original Body:**
> have numbers but presented in a positive way and word to go with it like keep it app and on track and let's do some more nothing negative but they do want a number because the student will want to log the question types and the time spent on. Them, so the detail page should have question types and time spent on each question type.  So hate this behind, not the high dishes, but have a clock icon somewhere that you can click on.That shows this view and try to keep historical records.So you want a day-by-day and end and outpawed would like to be able to show a graph that shows that the time spent per day is consistent.It's going up , it's coming down and so

**Cleaned Body:**
Display time tracking numbers in a positive way with encouraging words like "Keep it up!", "On track!", and "Let's do some more!" - nothing negative. Students need to see numbers because they want to log the question types and time spent on them.

**Features:**
- Detail page should show question types and time spent on each question type
- Add a clock icon that can be clicked to show this view
- Keep historical records with day-by-day tracking
- Display a graph showing time spent per day trends (consistent, increasing, or decreasing)
- Hide detailed stats behind the clock icon, not on the main view
- Show total time spent today and yesterday in prominent locations

---

## Issue #82: Reduce Font Sizes on Mobile Devices

**Original Title:** Reduce all font sizes on mobile devices.Particularly the top left and top right messages of the topic and the encouragement , which are far too big and round and overlap things , give them spacing and they make a smaller

**Cleaned Title:** Reduce font sizes on mobile devices

**Original Body:** (empty)

**Cleaned Body:**
Reduce all font sizes on mobile devices, particularly the top-left and top-right messages showing the topic and encouragement text. These are currently too large and overlap other elements. Improve spacing and make them smaller for better mobile layout.

**Specific Areas to Address:**
- Topic name (top-left)
- Encouragement messages (top-right)
- Ensure proper spacing between elements
- Prevent text overlap

---

## Issue #81: Ask for User's Name

**Original Title:** Ask the name

**Cleaned Title:** Ask for user's name during setup

**Original Body:**
> During setup phase during the calibration or before or just when the field is not present, we should ask the user to give them their name just first name. Please tell me your name so the names will be Raymond or Willie or child or Edwards or Christopher.  It should be a text field, but with the example given of Gerald as the prompt text. No, that's wrong. That news chair will use John as the pump text and then once the user's name is captured, then we should in somewhere in the second place, there should be an option to to correctly if you've got a timely mistake and then obviously  I'm, we can use this in emerging messages.Well, I'm Gerald, good work, Gerald.That's great, John trying to John, not too much.Not everywhere, not every single possible prompt should have a name.But it should occur occasionally so that the student feels more attentive to the work.Personally their work

**Cleaned Body:**
During the setup phase, calibration, or when the name field is not present, ask the user for their first name.

**Implementation:**
- Add a text input field with placeholder text "John" as an example
- Prompt: "Please tell me your name"
- Once captured, provide an option to correct it if there's a mistake
- Use the name occasionally in encouragement messages (e.g., "Good work, John!", "That's great, Sarah!")
- Don't overuse the name - it should appear occasionally, not in every prompt
- The goal is to make the student feel more personally engaged with their work

---

## Issue #80: Create "Fixing Habits" Topic Category

**Original Title:** Fixing habits

**Cleaned Title:** Create "Fixing Habits" topic category

**Original Body:**
> Create another syllabus topic called fixing habits. And then at the moment, the category could be empty and it's not one of the numbered ones it's separate from all the others internally made you call it a category, 0 orcas, 99 or something like that, you don't show that on the user interface and in state, we manually.  Develop question types that fit into this category. And then it's is not ordinary, it doesn't fit in with the other sequences. It's just something that is inserted occasionally into the Christian stream more or less, according to the student's success rate at that question time. So example is that the student does a problem with square roots and forgets to write down the plus 1 is simple that indicates there's both a positive and negative root on that.  So this is the problem , and that we create several question types in the different both structures where they basically are reminded by kicking on the correct button that they should have plus minuses

**Cleaned Body:**
Create a new syllabus topic called "Fixing Habits" (or use a more positive name like "Habit Improvement").

**Implementation:**
- Use an internal category ID like 0 or 99 (not displayed to users)
- Keep the category separate from the numbered syllabus topics
- Manually develop question types that fit into this category
- Insert these questions occasionally into the question stream based on the student's success rate
- Use spaced repetition algorithm to determine when to show these questions

**Example Use Case:**
When a student does problems with square roots and forgets to write ± (plus-minus symbol) to indicate both positive and negative roots, create question types that remind them by requiring them to click the correct button that includes the ± symbol.

**Purpose:**
Address common mistakes and bad habits through targeted practice questions that reinforce correct methods.

---

## Issue #79: Connect to Paper Homework

**Original Title:** Connect to homework

**Cleaned Title:** Connect to paper homework for personalized practice

**Original Body:**
> The student is doing paper homework. We need a mechanism by which the results from that, what topic they're working on, what questions they're doing, what questions they're getting right and wrong mistakes. They're making particularly mistakes, that holler being made frequently, we need a mechanism to feed those into the system in some format, so that the system can be developed and enhanced to be aware of the students.  Areas for improvement, but basically focusing on the things where a student already knows the answer, but through development of bad habit often gives the incorrect answer. So we want some practice and drilling of always giving the correct answer to these. So this is probably a more complicated architecture where there is a another mode and input mode where the  Questions, all answers and problems are fitting to the system they're analyzed, and this is definitely going to need hooking up to an AI, so it's not something that we can do in the short-term. This is a medium term plan that analyzed and then they are used to either create new question types. Or maybe there's a separate category outside the syllabus of fixing bad habits, you guys should call it habit improvement or find some positive words to express the hat that's basically what we're doing is we're fixing bad habits.  So just like any other topic or intermittent appear in the strange due to the space repetition

**Cleaned Body:**
Create a mechanism to feed results from students' paper homework into the system to personalize practice.

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
4. Create questions in a separate "Habit Improvement" category (outside the main syllabus)
5. Use spaced repetition to show these personalized questions intermittently

**Note:** This is a medium-term plan requiring AI integration, not a short-term implementation.

---

## Issue #78: Convert Stats Page to Educational Focus

**Original Title:** Convert stats page

**Cleaned Title:** Convert stats page to educational and encouraging format

**Original Body:**
> Convert the stats page from such a numerical focus to something that is more educationally, correct and encouraging. So take away the percentage schools which we know will always be around 7080%. Because that's the software design, the only numerical schools that we should store, which is exposed, is the minutes spent today.  And he street recent questions, but the main part of it should be a list of topics following the syllabus names of each one, the current status such as doing great mastered it perfect, want to all the positive things down to still working on it or the challenge or progressing.  And anything that is not been touched or where the school is less than 50% or on that topic, then just don't mention it because they haven't got to that topic, they haven't really worked on it. So this means you need another data structure where per topic you maintain their average score number. Of questions answered correctly no questions, outed incorrectly. And maybe last question or most recent question or most recent, 5 or most recent 5 questions with correct or incorrect. So  You can how calculate recently figures cause we don't really want to know about the
> 
> Clean up this pro to make it ten times better and focus on programming and focus on educational pedagogy techniques that all compatible with learning

**Cleaned Body:**
Convert the stats page from a numerical focus to something more educationally sound and encouraging.

**Changes:**
1. Remove percentage scores (which will always be around 70-80% by design)
2. Keep only these numerical stats:
   - Minutes spent today
   - Recent questions attempted

**Main Display:**
Show a list of topics following the syllabus structure with status for each:
- Positive statuses: "Doing great!", "Mastered it!", "Perfect!", "Excellent work!"
- Neutral/working statuses: "Still working on it", "Progressing", "Challenging"
- Hide topics that haven't been touched or have scores below 50%

**Data Structure Needed:**
Per topic, maintain:
- Average score
- Number of questions answered correctly
- Number of questions answered incorrectly
- Last question status (or last 5 questions with correct/incorrect)
- Ability to calculate recent performance

**Educational Pedagogy:**
Focus on encouraging language and positive reinforcement. Show progress and mastery rather than raw percentages. Don't display topics the student hasn't reached yet to avoid overwhelming them.

---

## Summary

All issues #78-87 have been cleaned up with:
- Corrected spelling and grammar
- Improved formatting and punctuation
- Clearer titles
- Better organization of content
- More complete descriptions where body was empty or unclear
- Proper sentence structure and paragraph breaks
