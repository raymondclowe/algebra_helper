# Google Sheets Integration v2.0 - Testing Guide

## Testing the Enhanced Features

This guide helps you verify that the enhanced Google Sheets integration (v2.0) works correctly.

### Test Setup

1. **Install the Updated Script**
   - Open a new Google Sheet
   - Go to Extensions → Apps Script
   - Copy the entire contents of `google-sheets-import.gs`
   - Save and close
   - Refresh the Google Sheet

2. **Verify Menu Appears**
   - You should see "Algebra Helper" in the menu bar
   - Menu should contain:
     - Import CSV Sessions
     - Import JSON Data
     - Clear Summary Sheet

### Test Case 1: CSV Import with Duplicate Detection

**Sample CSV Data** (copy this for testing):
```csv
Date,Student Name,Duration (min),Questions Total,Questions Correct,Score %,Topics Practiced
12/18/2024,"Alice Smith",5,8,7,87,"Arithmetic(5); Basic Algebra(3)"
12/18/2024,"Alice Smith",12,20,16,80,"Quadratics(8); Functions(7); Trigonometry(5)"
12/18/2024,"Bob Johnson",6,10,9,90,"Arithmetic(4); Fractions(6)"
```

**Steps:**
1. Click "Algebra Helper" → "Import CSV Sessions"
2. Paste the sample CSV data above
3. Click OK

**Expected Results:**
- Should create "Algebra Helper Sessions" sheet
- Should import 3 sessions
- Columns should include: Date, Student Name, Duration (min), Questions Total, Questions Correct, Score %, Topics Practiced, Review Notes, Self-Assessment
- Success message: "Imported 3 new session(s) successfully!"

**Test Duplicate Detection:**
1. Click "Algebra Helper" → "Import CSV Sessions" again
2. Paste the same CSV data
3. Click OK

**Expected Results:**
- Success message should show: "All 3 session(s) already exist in the sheet. No new data imported."
- No duplicate rows should be added

**Test Partial Duplicate:**
1. Add a new session to the CSV:
```csv
Date,Student Name,Duration (min),Questions Total,Questions Correct,Score %,Topics Practiced
12/18/2024,"Alice Smith",5,8,7,87,"Arithmetic(5); Basic Algebra(3)"
12/18/2024,"Alice Smith",12,20,16,80,"Quadratics(8); Functions(7); Trigonometry(5)"
12/18/2024,"Bob Johnson",6,10,9,90,"Arithmetic(4); Fractions(6)"
12/18/2024,"Carol Davis",8,15,13,87,"Linear Equations(8); Inequalities(7)"
```
2. Import this data

**Expected Results:**
- Success message: "Imported 1 new session(s) successfully! 3 duplicate(s) were skipped."
- Only the Carol Davis session should be added

### Test Case 2: JSON Import with Enhanced Topic Display

**Sample JSON Data** (simplified for testing):
```json
{
  "questions": [
    {
      "question": "What is 2 + 2?",
      "correctAnswer": "4",
      "chosenAnswer": "4",
      "allAnswers": ["3", "4", "5", "6"],
      "isCorrect": true,
      "isDontKnow": false,
      "timeSpent": 5,
      "datetime": 1734528000000,
      "topic": "Arithmetic",
      "level": 1,
      "hintsUsed": 0
    },
    {
      "question": "What is 3 + 3?",
      "correctAnswer": "6",
      "chosenAnswer": "6",
      "allAnswers": ["5", "6", "7", "8"],
      "isCorrect": true,
      "isDontKnow": false,
      "timeSpent": 5,
      "datetime": 1734528180000,
      "topic": "Arithmetic",
      "level": 1,
      "hintsUsed": 0
    },
    {
      "question": "Solve: 2x + 3 = 7",
      "correctAnswer": "2",
      "chosenAnswer": "2",
      "allAnswers": ["1", "2", "3", "4"],
      "isCorrect": true,
      "isDontKnow": false,
      "timeSpent": 8,
      "datetime": 1734528240000,
      "topic": "Linear Equations",
      "level": 5,
      "hintsUsed": 0
    },
    {
      "question": "Solve: x^2 - 5x + 6 = 0",
      "correctAnswer": "x = 2 or x = 3",
      "chosenAnswer": "x = 2 or x = 3",
      "allAnswers": ["x = 1 or x = 6", "x = 2 or x = 3", "x = -2 or x = -3", "x = 1 or x = 5"],
      "isCorrect": true,
      "isDontKnow": false,
      "timeSpent": 12,
      "datetime": 1734528360000,
      "topic": "Quadratics",
      "level": 10,
      "hintsUsed": 0
    },
    {
      "question": "What is sin(30°)?",
      "correctAnswer": "1/2",
      "chosenAnswer": "1/2",
      "allAnswers": ["1/2", "√3/2", "1", "0"],
      "isCorrect": true,
      "isDontKnow": false,
      "timeSpent": 6,
      "datetime": 1734528420000,
      "topic": "Trigonometry",
      "level": 15,
      "hintsUsed": 0
    }
  ]
}
```

**Steps:**
1. Click "Algebra Helper" → "Import JSON Data"
2. Paste the sample JSON data above
3. Click OK

**Expected Results:**
- Should create "Algebra Helper Summary" sheet
- Should have 1 session (all questions within 30 minutes)
- Column headers should be: Date, Time, Topics Covered, What Was Practiced, Minutes Spent, Questions Answered, Questions Correct, Success Rate %, Notes/Areas to Review, Checked ✓
- Topics Covered should show top topics like: "Arithmetic (2); Linear Equations (1); Quadratics (1); +1 more" (or similar based on counts)
- What Was Practiced should be descriptive, e.g., "Practiced Arithmetic, Linear Equations, and Quadratics (5 questions)"
- Success Rate % should be formatted as percentage (100.00%)
- Notes should say "Perfect! All correct ⭐" since all answers were correct

### Test Case 3: Verify Homework-Friendly Features

**Check Column Names:**
- CSV import should have: Date, Student Name, Duration (min), Questions Total, Questions Correct, Score %, Topics Practiced, Review Notes, Self-Assessment
- JSON import should have: Date, Time, Topics Covered, What Was Practiced, Minutes Spent, Questions Answered, Questions Correct, Success Rate %, Notes/Areas to Review, Checked ✓

**Check Topic Display:**
- Multiple topics should show top 2-3 prominently
- Format should be: "Topic1 (count); Topic2 (count); Topic3 (count)"
- If more than 3 topics, should show: "Topic1 (count); Topic2 (count); Topic3 (count); +X more"

**Check Session Descriptions:**
- "What Was Practiced" should list topics naturally: "Practiced Arithmetic and Algebra (8 questions)"
- Notes should indicate quality: "Perfect! All correct ⭐" or "X incorrect - Review needed"

### Verification Checklist

After importing test data, verify:

- [ ] Duplicate detection works (no duplicate sessions imported)
- [ ] Top 2-3 topics are shown prominently
- [ ] Column names are homework-friendly
- [ ] Date and Time are in separate columns (JSON import)
- [ ] Success Rate % is formatted as percentage
- [ ] Session descriptions are clear and descriptive
- [ ] Notes indicate areas for review when applicable
- [ ] "Checked ✓" column is available for marking reviewed sessions
- [ ] Alternating row colors for readability
- [ ] Auto-resized columns for easy reading

### Troubleshooting

**If import fails:**
1. Verify you copied the ENTIRE content (including opening/closing braces for JSON)
2. Check for syntax errors in JSON (use a JSON validator)
3. For CSV, ensure header row is included
4. Make sure the Apps Script was saved and sheet was refreshed

**If duplicate detection doesn't work:**
- Verify the sessions have identical Date, Student Name, Duration, and Topics
- Even small differences will treat them as separate sessions

**If topics don't display correctly:**
- Check that the source data includes topic information
- Verify the topic field is populated in the questions

### Success Criteria

✅ The enhanced integration is working correctly if:
1. Duplicate sessions are detected and skipped
2. Top topics are displayed prominently (not buried in mixed lists)
3. Column names make sense for homework tracking
4. Session descriptions clearly show what was practiced
5. Notes automatically indicate perfect scores or areas needing review
6. The spreadsheet looks professional and homework-friendly

---

## Reporting Issues

If you find any issues with the enhanced integration, please report:
1. What you were trying to do
2. What happened vs. what you expected
3. Sample data (if possible)
4. Screenshot of the error or unexpected behavior
