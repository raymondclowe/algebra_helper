# Google Sheets Integration for Algebra Helper

## Quick Start

### For Learners

1. **Set Your Name** - Go to Settings and enter your name
2. **Practice** - Complete practice sessions (aim for >2 minutes with good accuracy)
3. **Export CSV** - Click Stats → "Export Sessions" button
4. **Share** - Send the downloaded CSV file to your mentor/advisor (email, Google Drive, etc.), or use it for self-analysis

### For Self-Analysis or Mentor/Advisor Review

**Option A: Manual Import (Easiest)**
1. Obtain the CSV file (your own export or from a learner)
2. Open Google Sheets
3. File → Import → Upload → Select CSV file
4. Choose "Append to current sheet" to add to existing data

**Option B: Apps Script (Advanced)**
1. Open Google Sheets
2. Extensions → Apps Script
3. Copy contents of `google-sheets-import.gs` from this repository
4. Save and close
5. Refresh sheet → Use new "Algebra Helper" menu

---

## How It Works

### Session Filtering

Only meaningful practice sessions are exported:
- Duration > 2 minutes
- Correct answer rate > 50% (excluding "I don't know" responses)

This ensures you only see genuine practice attempts, not quick trials or incomplete sessions.

### Session Grouping

Questions are automatically grouped into sessions based on timing:
- Questions within 30 minutes of each other = same session
- Gap > 30 minutes = new session starts

Example:
```
10:00 AM - Question 1
10:05 AM - Question 2
10:08 AM - Question 3
[Same session - 8 minutes total]

11:00 AM - Question 4  <- New session (52 minutes gap)
```

### CSV Format

The exported CSV includes these columns:

| Column | Description |
|--------|-------------|
| Date | Date of practice session |
| Learner Name | Name set in app settings |
| Duration (min) | How long the session lasted |
| Questions Total | Number of questions answered |
| Questions Correct | Number of correct answers |
| Score % | Percentage of correct answers |
| Topics Practiced | List of topics with question counts |

---

## Advanced Setup: Apps Script

### Installation

1. Open your Google Sheet
2. Extensions → Apps Script
3. Delete any default code
4. Copy the entire contents of `google-sheets-import.gs` from this repository
5. Save and close the Apps Script tab
6. Refresh your Google Sheet
7. You should see a new "Algebra Helper" menu

### Available Functions

**Import CSV Sessions**
- Use for pre-filtered CSV exports
- Automatically detects and skips duplicate sessions
- Shows top topics for each session
- Adds review notes and assessment columns

**Import JSON Data**
- For importing complete JSON exports with all question details
- Provides detailed session analysis
- Creates separate summary sheet

**Clear Summary Sheet**
- Removes all data from current sheet
- Use with caution

### Troubleshooting

**Menu doesn't appear**
- Refresh the Google Sheet
- Check that script was saved
- Try closing and reopening the sheet

**Import fails**
- Ensure you copied the entire CSV including header row
- Check for corrupted special characters
- Verify CSV format matches expected structure

---

## Advanced Use Cases

### Multiple Classes
Create separate sheets per class or a master sheet with combined data from all classes.

### Parent Reporting
Filter the sheet by student name, copy filtered rows, and share with parents during conferences.

### Progress Tracking
- Sort by date to see chronological progress
- Compare early vs. recent session scores
- Track topic distribution over time
- Use conditional formatting for visual indicators

### Participation Grades
Consider using practice data for effort-based grades, focusing on consistent practice rather than just performance scores.

---

## Privacy & Security

### Student Control
- CSV export is manual - students choose when to export
- No automatic cloud uploads or tracking
- Students can review CSV contents before sharing
- Name must be manually set in app

### Data Minimization
- CSV contains only session summaries, not individual questions or answers
- Only aggregated statistics are shared

### Recommendations for Sharing with Mentors/Advisors
- Use approved sharing methods
- Follow appropriate data retention policies
- Respect learner privacy in shared documents

---

## Technical Details

### CSV Format Specification

```csv
Date,Learner Name,Duration (min),Questions Total,Questions Correct,Score %,Topics Practiced
12/17/2024,"John Doe",5,8,7,87,"Arithmetic(5); Algebra(3)"
```

**Format Notes:**
- Header row is required
- Student name and topics are quoted (allows commas within fields)
- Date format: MM/DD/YYYY (locale-dependent)
- Numbers are unquoted integers/percentages

### Session Calculation Algorithm

```javascript
1. Sort all questions by datetime
2. Start first session with first question
3. For each subsequent question:
   - If time gap < 30 minutes → add to current session
   - If time gap ≥ 30 minutes → start new session
4. Calculate session metrics:
   - Duration = last question time - first question time
   - Filter: duration > 2 min AND correct% > 50%
5. Export filtered sessions only
```

### Google Apps Script Functions

```javascript
// Main functions
onOpen()                    // Adds menu to sheet
importCSVSessions()         // Imports CSV data
importAlgebraHelperData()   // Imports JSON data
clearSummarySheet()         // Clears data

// Helper functions
parseCSV(text)             // Parses CSV into array
formatHeaderRow(sheet)     // Formats header styling
groupIntoSessions(qs)      // Groups questions by time
```

---

## Comparison with Other Methods

**CSV Export (This Implementation)**
- Pros: No authentication, simple setup, student control, privacy-friendly
- Cons: Manual import, not real-time, requires file sharing

**Google Sheets API (NOT Used)**
- Pros: Automated, real-time updates
- Cons: Requires OAuth, Cloud Console setup, complex, potential privacy concerns

**Third-Party Services (NOT Used)**
- Pros: Pre-built integrations
- Cons: Additional costs, data privacy risks, external dependencies

---

## FAQ

**Q: Do students need Google accounts?**  
A: No. Students only need to use the web app and export a CSV file.

**Q: Can I import multiple student files at once?**  
A: Import them one at a time using the Apps Script or combine CSV files manually.

**Q: What if a student doesn't set their name?**  
A: The export will use "Anonymous". Remind students to set their name first.

**Q: Can I edit the imported data?**  
A: Yes. Feel free to add columns, notes, or modify as needed.

**Q: How often should students export?**  
A: Weekly is recommended, but adjust based on your needs.

**Q: What if no sessions meet the export criteria?**  
A: The export will show an error. Student needs to complete longer sessions with better accuracy.

**Q: Can I use this for grading?**  
A: Yes, but consider using practice data for effort/participation grades rather than performance grades.

**Q: Is this FERPA/COPPA compliant?**  
A: The tool itself doesn't collect data. Follow your school's policies for handling student data.

---

## Additional Resources

- **DATA_ANALYTICS_GUIDE.md** - Comprehensive data export and analytics guide
- **google-sheets-import.gs** - Apps Script code
- **sample-export.csv** - Example export file

---

*For more information, see the main README.md and DATA_ANALYTICS_GUIDE.md files.*
