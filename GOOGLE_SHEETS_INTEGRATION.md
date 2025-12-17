# Google Sheets Integration for Algebra Helper

## Overview

This integration allows students or mentors to track student practice sessions in Google Sheets **without requiring Google Cloud API authentication or OAuth setup**. Students export their practice data as CSV files, which students or mentors can then import into Google Sheets.

## Key Features

✅ **No Cloud Authentication Required** - No Google API keys, OAuth, or Cloud Console setup needed  
✅ **Privacy-Friendly** - Students control when and what they share  
✅ **Pre-Filtered Data** - Only meaningful practice sessions (>2 minutes, >50% correct) are exported  
✅ **Easy Setup** - Simple CSV import or one-time Apps Script installation  
✅ **Student or mentor-Friendly** - Includes columns for comments and review status  

---

## Quick Start Guide

### For Students

1. **Practice in Algebra Helper** - Complete practice sessions (aim for >2 minutes with good accuracy)
2. **Set Your Name** - Go to Settings and enter your name (so student or mentor knows who exported the data)
3. **Export CSV** - Click Stats (📈) → "📊 Export for Student or mentor" button
4. **Share with Student or mentor** - Send the downloaded CSV file to your student or mentor (email, Google Drive, etc.)

### For Self-Analysis

**Option A: Manual Import (Easiest)**
1. Receive student's CSV file
2. Open Google Sheets
3. File → Import → Upload → Select CSV file
4. Choose "Append to current sheet" to add to existing data

**Option B: Apps Script (One-Time Setup)**
1. Open Google Sheets
2. Extensions → Apps Script
3. Copy contents of `google-sheets-import.gs` from this repository
4. Save and close
5. Refresh sheet → Use new "Algebra Helper" menu

---

## What Gets Exported?

### Session Filtering Criteria

Only practice sessions that meet **BOTH** criteria are included:
- ✅ Duration > 2 minutes
- ✅ Correct answer rate > 50% (excluding "I don't know" responses)

This ensures you only see meaningful practice attempts, not quick trials or incomplete sessions.

### CSV Columns

| Column | Description |
|--------|-------------|
| **Date** | Date of practice session |
| **Student Name** | Name set in app settings |
| **Duration (min)** | How long the session lasted |
| **Questions Total** | Number of questions answered (excluding "I don't know") |
| **Questions Correct** | Number of correct answers |
| **Score %** | Percentage of correct answers |
| **Topics Practiced** | List of topics with question counts, e.g., "Arithmetic(5); Algebra(3)" |

When imported via Apps Script, two additional columns are added:
- **Student or mentor Comments** - For your notes
- **Self-Assessment** - To mark sessions as checked

---

## Session Grouping Logic

Questions are automatically grouped into sessions based on timing:
- Questions within 30 minutes of each other = same session
- Gap > 30 minutes = new session starts

Example:
```
10:00 AM - Question 1
10:05 AM - Question 2
10:08 AM - Question 3
[Same session - 8 minutes duration]

11:00 AM - Question 4  <- New session (52 minutes gap)
11:02 AM - Question 5
[New session - 2 minutes duration]
```

---

## Using the Apps Script

### Installation

1. Open your Google Sheet
2. **Extensions → Apps Script**
3. Delete any default code
4. Copy the entire contents of `google-sheets-import.gs` from this repository
5. **Save** (💾) and close the Apps Script tab
6. **Refresh** your Google Sheet
7. You should see a new "Algebra Helper" menu

### Using the Menu

**Import CSV Sessions**
- Use this for pre-filtered CSV exports from students
- Paste CSV content when prompted
- Data is added to "Algebra Helper Sessions" sheet

**Import JSON Data** (Advanced)
- For importing full JSON exports with all question details
- Processes raw data and groups into sessions
- Creates detailed summary sheet

**Clear Summary Sheet**
- Removes all data from current sheet
- Use with caution!

### Troubleshooting Apps Script

**Menu doesn't appear**
- Refresh the Google Sheet
- Check that script was saved
- Try closing and reopening the sheet

**Import fails**
- Make sure you copied the **entire** CSV including header row
- Check for special characters that might have been corrupted
- Verify CSV format matches expected structure

---

## Sample Workflow

### Weekly Practice Tracking

**Monday - Start of Week**
- Student or mentor reminds students to practice
- Students ensure name is set in app settings

**Throughout Week**
- Students practice regularly
- App automatically tracks meaningful sessions

**Friday - End of Week**
1. Students export CSV: Stats → "📊 Export for Student or mentor"
2. Students submit CSV (email, Google Classroom, Drive folder, etc.)
3. Student or mentor imports all CSVs into tracking sheet
4. Student or mentor reviews data, adds comments, marks as reviewed

**Following Week**
- Student or mentor provides feedback to students
- Identifies students who need extra help
- Celebrates improvements and achievements

---

## Privacy & Security

### Student Control
- CSV export is manual - students choose when to export
- No automatic cloud uploads or tracking
- Students can review CSV contents before sharing
- Name must be manually set in app

### Data Minimization
- CSV contains only session summaries, not individual questions
- Questions/answers not included in export
- Only aggregated statistics are shared

### Student or mentor Recommendations
- Use school-approved sharing methods
- Follow school data retention policies
- Consider end-of-term data archival
- Respect student privacy in shared documents

---

## Advanced Use Cases

### Multiple Classes
Create separate sheets per class:
- "Period 1 - Algebra Helper"
- "Period 2 - Algebra Helper"
- Master sheet with combined data

### Parent Reporting
Extract individual student data:
1. Filter sheet by student name
2. Copy filtered rows
3. Share with parents during conferences

### Progress Tracking
Monitor student improvement:
- Sort by date to see chronological progress
- Compare early vs. recent session scores
- Track topic distribution over time
- Use conditional formatting for visual indicators

### Grade Component
Use practice data for participation grades:
- Award points for consistent practice
- Consider duration + accuracy
- Focus on effort, not just performance

---

## Comparison with Other Methods

### ✅ CSV Export (This Implementation)
- **Pros**: No auth, simple setup, student control, privacy-friendly
- **Cons**: Manual import, not real-time, requires file sharing

### ❌ Google Sheets API (NOT Used)
- **Pros**: Automated, real-time updates
- **Cons**: Requires OAuth, Cloud Console setup, complex, potential privacy concerns

### ❌ Third-Party Services (NOT Used)
- **Pros**: Pre-built integrations
- **Cons**: Additional costs, data privacy risks, dependency on external services

---

## Technical Details

### CSV Format Specification

```csv
Date,Student Name,Duration (min),Questions Total,Questions Correct,Score %,Topics Practiced
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

## Sample Data

See `sample-export.csv` for an example of exported data format.

---

## Support & Resources

### Documentation Files
- **TEACHER_GUIDE.md** - Comprehensive guide for self-analysis
- **google-sheets-import.gs** - Apps Script code
- **sample-export.csv** - Example export file

### Getting Help
- Review this documentation
- Check the TEACHER_GUIDE.md for detailed instructions
- Test with sample data before using with students
- Consult school IT for Google Sheets assistance

### Contributing
Found an issue or have a suggestion? Please open an issue on the GitHub repository.

---

## FAQ

**Q: Do students need Google accounts?**  
A: No! Students only need to use the web app and export a CSV file.

**Q: Can I import multiple student files at once?**  
A: Yes, import them one at a time using the Apps Script or combine CSV files manually.

**Q: What if a student doesn't set their name?**  
A: The export will use "Anonymous". Remind students to set their name first.

**Q: Can I edit the imported data?**  
A: Yes! Feel free to add columns, notes, or modify as needed.

**Q: How often should students export?**  
A: Weekly is recommended, but adjust based on your needs.

**Q: What if no sessions meet the export criteria?**  
A: The export will show an error. Student needs to complete longer sessions with better accuracy.

**Q: Can I use this for grading?**  
A: Yes, but consider using practice data for effort/participation grades rather than performance grades.

**Q: Is this FERPA/COPPA compliant?**  
A: The tool itself doesn't collect data. Follow your school's policies for handling student data.

---

## Version History

**v1.0** (December 2024)
- Initial CSV export implementation
- Google Sheets Apps Script for import
- Session filtering (>2min, >50% correct)
- Comprehensive documentation

---

*For more information, see the main README.md and TEACHER_GUIDE.md files.*
