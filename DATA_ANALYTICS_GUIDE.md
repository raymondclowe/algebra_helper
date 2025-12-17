# Data Export, Import, and Analytics Guide

This document explains how to use the data export/import features and analytics tools in Algebra Helper.

## Table of Contents

1. [Data Export](#data-export)
2. [Data Import](#data-import)
3. [Google Sheets Analytics](#google-sheets-analytics)
4. [Python Analytics Tool](#python-analytics-tool)
5. [Data Structure](#data-structure)

---

## Data Export

### How to Export Your Data

1. Open Algebra Helper in your browser
2. Click the **Stats** button (📊) in the top navigation
3. In the stats modal, click the **📥 Export Data** button
4. A JSON file will be automatically downloaded with a filename like:
   `algebra-helper-data-2024-12-17T14-30-00.json`

### What Gets Exported

The export includes:
- **All question/answer events** from IndexedDB with complete details:
  - Full question text
  - All answer options (correct answer + distractors)
  - Student's chosen answer
  - Whether the answer was correct
  - Time spent on the question
  - Topic/category
  - Timestamp
  - Unique event hash ID
  - Hints used (future feature)
  
- **All localStorage data** including:
  - Cumulative statistics
  - Daily time tracking
  - Other app settings

### Export File Format

The exported JSON file has this structure:

```json
{
  "version": "1.0",
  "exportDate": "2024-12-17T14:30:00.000Z",
  "dbVersion": 2,
  "questions": [
    {
      "id": 1,
      "question": "What is 2 + 2?",
      "allAnswers": ["4", "5", "3", "6", "I don't know"],
      "chosenAnswer": "4",
      "correctAnswer": "4",
      "isCorrect": true,
      "isDontKnow": false,
      "timeSpent": 3,
      "datetime": 1702821000000,
      "topic": "Basic Arithmetic",
      "level": 1,
      "hintsUsed": 0,
      "eventHash": "evt_abc123_1702821000000",
      "advice": ""
    }
  ],
  "stats": {
    "totalActiveTime": 1200,
    "totalQuestions": 50,
    "correctAnswers": 45,
    "wrongAnswers": 5,
    "dontKnowAnswers": 2
  },
  "dailyStats": {
    "date": "Tue Dec 17 2024",
    "minutesSpent": 20
  },
  "localStorage": {
    "algebraHelperStats": { ... },
    "algebraHelperDailyStats": { ... }
  }
}
```

---

## Data Import

### How to Import Data

1. Open Algebra Helper in your browser
2. Click the **Stats** button (📊)
3. Click the **📤 Import Data** button
4. Select a previously exported JSON file
5. The data will be added to your current database

**Note:** Import adds data without deleting existing records. If you want to replace all data, use "Clear All Data" first, then import.

### Use Cases for Import

- **Restore backup**: Recover your data after clearing the browser cache
- **Migrate data**: Move your progress to a different device or browser
- **Combine data**: Merge data from multiple sessions
- **Share with teacher/parent**: Import a student's data to review their progress

---

## Google Sheets Analytics

### Setup Instructions

1. **Create a new Google Sheet** or open an existing one
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy the entire contents of `google-sheets-import.gs` 
5. Paste into the Apps Script editor
6. Click **Save** (disk icon) and name your project (e.g., "Algebra Helper Import")
7. Close the Apps Script tab
8. **Refresh your Google Sheet**
9. You should now see a new menu: **Algebra Helper**

### Importing Data

1. Export your data from Algebra Helper (see above)
2. Open the exported JSON file in a text editor
3. Select all and copy (Ctrl+A, Ctrl+C)
4. In Google Sheets, click **Algebra Helper > Import Data**
5. Paste the JSON data when prompted
6. Click **OK**

The script will create a new sheet called **"Algebra Helper Summary"** with your sessions.

### Understanding the Summary Sheet

The summary sheet groups your questions into **sessions** (questions within 30 minutes of each other) with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Date | Session date | 04/12/2025 |
| Topic | Primary topic practiced | Quadratics |
| What was done | Brief description | 15 questions practiced (2 skipped) |
| How long did it take (min) | Session duration | 30 |
| Correct Questions | Number correct | 12 |
| Total Questions | Total answered (excluding "I don't know") | 13 |
| If not right | Summary of errors | 1 incorrect, 2 skipped |
| Checked by AI (link) (optional) | For manual entry | |
| Checked by human (mandatory) | For manual entry | mama |
| Percentage correct | Accuracy percentage | 0.92 |
| Notes | Additional context | |

**Example row:**
```
04/12/2025 | Quadratics | 15 questions practiced | 30 | 12 | 13 | 1 incorrect, 2 skipped | | mama | 0.92 | 
```

### Session Grouping Logic

Questions are grouped into sessions with these rules:
- Questions within 30 minutes of each other = same session
- Gap > 30 minutes = new session
- Each session shows:
  - Date of session start
  - Total duration (first question to last question)
  - Dominant topic (or "Mixed" if multiple topics)
  - Accuracy (excluding "I don't know" responses)

This allows you to see: *"I spent 15 minutes yesterday morning using Algebra Helper and did 10 questions of which 8 were right"*

---

## Python Analytics Tool

### Installation

1. Install Python 3.7 or higher
2. Install required package:
   ```bash
   pip install python-dateutil
   ```

### Basic Usage

Analyze all your data:
```bash
python analyze_algebra_data.py algebra-helper-data-2024-12-17.json
```

Analyze only the last 7 days:
```bash
python analyze_algebra_data.py algebra-helper-data-2024-12-17.json 7
```

### What the Tool Analyzes

The Python tool provides:

1. **Overall Performance**
   - Total questions answered
   - Accuracy rate
   - Questions skipped with "I don't know"

2. **Performance by Topic**
   - Accuracy for each topic
   - Average time spent per topic
   - Number of questions per topic

3. **Time vs Accuracy Analysis**
   - Compares accuracy for different time ranges:
     - Very fast (< 10 seconds)
     - Fast (10-30 seconds)
     - Normal (30-60 seconds)
     - Slow (> 60 seconds)

4. **Recent Mistakes Report**
   - Lists up to 10 most recent mistakes
   - Shows question, correct answer, student's answer
   - Includes time spent and advice

5. **Learning Insights** (constructive feedback)
   - Identifies patterns like:
     - "Student would benefit from taking more time..."
     - "Student needs more practice with inverse functions..."
     - "Great progress! Recent performance shows improvement..."
   - All feedback uses positive "even better if" structure

### Example Output

```
================================================================================
ALGEBRA HELPER - STUDENT ANALYTICS REPORT
================================================================================

Analysis period: Last 7 days
Total questions analyzed: 45

--------------------------------------------------------------------------------
OVERALL PERFORMANCE
--------------------------------------------------------------------------------
Questions answered: 42
Correct: 35 (83.3%)
Incorrect: 7
Skipped (I don't know): 3

--------------------------------------------------------------------------------
PERFORMANCE BY TOPIC
--------------------------------------------------------------------------------

Quadratic Equations:
  Questions: 20
  Accuracy: 85.0% (17/20)
  Average time: 28.5 seconds

Exponentials & Logarithms:
  Questions: 15
  Accuracy: 73.3% (11/15)
  Average time: 35.2 seconds
  Skipped: 3

--------------------------------------------------------------------------------
TIME SPENT vs ACCURACY
--------------------------------------------------------------------------------
< 10 seconds: 60.0% accuracy (3/5 questions)
10-30 seconds: 85.7% accuracy (18/21 questions)
30-60 seconds: 87.5% accuracy (14/16 questions)

--------------------------------------------------------------------------------
LEARNING INSIGHTS & RECOMMENDATIONS
--------------------------------------------------------------------------------

💡 Student would benefit from taking more time on questions. Questions 
answered in under 10 seconds show 60% accuracy, while those taking 30-60 
seconds show 88% accuracy.

📚 Student would benefit from additional practice in Exponentials & Logarithms. 
Current accuracy: 73% (11/15 questions)

🌟 Great progress! Recent performance (83%) shows improvement compared to 
overall average (78%).
```

---

## Data Structure

### Enhanced IndexedDB Schema (Version 2)

Each question event now includes:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Auto-generated unique ID |
| eventHash | string | Unique hash for this event |
| question | string | Full question text (LaTeX) |
| allAnswers | array | All answer options shown |
| chosenAnswer | string | Student's selected answer |
| correctAnswer | string | The correct answer |
| isCorrect | boolean | Whether answer was correct |
| isDontKnow | boolean | Whether "I don't know" was clicked |
| timeSpent | number | Seconds spent on question |
| datetime | number | Unix timestamp (milliseconds) |
| topic | string | Human-readable topic name |
| level | number | Difficulty level |
| hintsUsed | number | Number of hints used (future) |
| advice | string | Explanation shown on wrong answer |

### Data Migration

When upgrading from version 1 to version 2:
- Existing records are automatically migrated
- Missing fields are filled with defaults:
  - `allAnswers`: `[correctAnswer]`
  - `chosenAnswer`: `"unknown"` or `correctAnswer` if correct
  - `hintsUsed`: `0`
  - `eventHash`: Generated from available data

---

## Privacy & Data Security

- **All data stays local**: Your data is stored in your browser's IndexedDB
- **No automatic uploads**: Data is only exported when you click Export
- **You control sharing**: Only share exported files with people you trust
- **No tracking**: The app doesn't send any data to external servers

---

## Troubleshooting

### Export Issues

**Q: Export button doesn't work**
- Check browser console for errors (F12)
- Try a different browser
- Ensure you have questions in your history

**Q: File isn't downloading**
- Check if your browser blocked the download
- Look in your Downloads folder
- Try disabling popup blockers

### Import Issues

**Q: Import fails with "Invalid data format"**
- Ensure you're importing a file exported from Algebra Helper
- Check the JSON is valid (paste into jsonlint.com)
- Make sure you copied the entire file content

**Q: Data isn't showing after import**
- Refresh the stats page
- Check the browser console for errors
- Try clearing and re-importing

### Google Sheets Issues

**Q: "Algebra Helper" menu doesn't appear**
- Refresh the Google Sheet after adding the script
- Check you saved the Apps Script
- Try closing and reopening the sheet

**Q: Import fails in Google Sheets**
- Ensure you copied the complete JSON
- Check for any syntax errors
- Try pasting in smaller chunks if very large

---

## Future Enhancements

Planned features:
- More detailed mistake categorization
- Automatic pattern detection with ML
- Integration with learning management systems
- Advanced visualizations in Google Sheets
- Hints tracking and analysis
- Real-time parent/teacher dashboard

---

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments in the source files
3. Open an issue on the GitHub repository
