# Teacher Guide: Google Sheets Integration

This guide explains how to track student practice sessions from Algebra Helper in Google Sheets **without requiring Google Cloud authentication or complex API setup**.

## Overview

Students can export their meaningful practice sessions (>2 minutes duration, >50% correct answers) to a CSV file, which teachers can then import into Google Sheets for tracking and review.

---

## For Students: Exporting Practice Data

### Step 1: Complete Practice Sessions
- Practice problems in Algebra Helper
- Aim for sessions longer than 2 minutes with good accuracy (>50% correct)
- Make sure to set your name in the app (Settings → Student Name)

### Step 2: Export CSV File
1. Click the **Stats** button (📈) in Algebra Helper
2. Click the **"📊 Export for Teacher"** button
3. A CSV file will download automatically (e.g., `algebra-helper-sessions-2024-01-15.csv`)

### What Gets Exported?
The CSV includes **only meaningful practice sessions**:
- Sessions longer than 2 minutes
- Sessions with >50% correct answers
- Excludes very short practice attempts

### CSV Format
The exported file contains:
- **Date**: When the practice session occurred
- **Student Name**: The name set in the app
- **Duration (min)**: How long the session lasted
- **Questions Total**: Total questions answered (excluding "I don't know")
- **Questions Correct**: Number of correct answers
- **Score %**: Percentage of correct answers
- **Topics Practiced**: List of topics covered with question counts

---

## For Teachers: Importing into Google Sheets

### Method 1: Manual CSV Import (Simple)

1. **Open Google Sheets** and create a new spreadsheet (or open an existing one)
2. Go to **File → Import**
3. Click **Upload** and select the student's CSV file
4. Choose import options:
   - **Import location**: "Append to current sheet" (to add to existing data) or "Replace current sheet"
   - **Separator type**: "Comma"
5. Click **Import data**

### Method 2: Google Apps Script Import (Advanced)

This method adds a custom menu to Google Sheets for easier repeated imports.

#### One-Time Setup:

1. **Open Google Sheets**
2. Go to **Extensions → Apps Script**
3. Delete any default code in the editor
4. Copy and paste the entire contents of the `google-sheets-import.gs` file from the Algebra Helper repository
5. Click **Save** (💾 icon) and name your project (e.g., "Algebra Helper Import")
6. Close the Apps Script tab
7. Refresh your Google Sheet

You should now see a new **"Algebra Helper"** menu in the menu bar!

#### Using the Script:

1. Get the student's CSV file
2. Open the CSV file in a text editor and **copy all contents** (Ctrl+A, Ctrl+C)
3. In Google Sheets, click **Algebra Helper → Import CSV Sessions**
4. **Paste** the CSV contents into the dialog box
5. Click **OK**

The script will:
- Parse the CSV data
- Add it to a new sheet called "Algebra Helper Sessions" (or append to existing)
- Add extra columns for **Teacher Comments** and **Reviewed** checkbox
- Format the data with alternating row colors for easy reading

---

## Tracking Multiple Students

### Option 1: Separate Sheets per Student
- Create one Google Sheet per student
- Import their CSV files regularly
- Track individual progress over time

### Option 2: Combined Master Sheet
- Create one Google Sheet for all students
- Import CSV files from multiple students
- The **Student Name** column helps you filter/sort by student
- Use Google Sheets filters to view individual students

### Recommended Columns for Teacher Use

When using the Apps Script import, two additional columns are automatically added:
1. **Teacher Comments**: Add notes about the session
2. **Reviewed**: Mark sessions as reviewed (Yes/No or checkmark)

You can add more columns as needed:
- **Grade/Score**
- **Follow-up needed**
- **Parent contacted**

---

## Tips for Effective Tracking

### 1. Regular Exports
- Ask students to export their data weekly or after major practice sessions
- Students can export multiple times - the CSV includes all qualifying sessions

### 2. Session Quality Indicators
- **Duration**: Longer sessions show sustained engagement
- **Score %**: Track improvement over time
- **Topics Practiced**: See which areas students are working on
- Look for patterns in topic distribution

### 3. Identifying Students Needing Help
- Students with declining scores over time
- Students avoiding certain topics
- Very short sessions might indicate frustration
- Students not exporting data regularly

### 4. Data Analysis
Use Google Sheets features:
- **Sort** by date, score, or student name
- **Filter** to see specific students or time periods
- **Charts** to visualize progress over time
- **Conditional formatting** to highlight low scores

---

## Privacy & Data Management

### Student Privacy
- The CSV export is entirely **local** to the student's device
- No data is automatically uploaded to any cloud service
- Students control what they share and when
- The student name is set manually in the app

### Data Security
- CSV files can be shared via email, cloud storage, or in person
- Consider using secure channels for sharing (school email, LMS, etc.)
- Exported CSV files contain only session summaries, not individual questions

### Data Retention
- Students can export their full data (JSON format) for backup
- Teachers should follow school policies for data retention
- Consider archiving old sheets at end of term/year

---

## Troubleshooting

### "No sessions meet the criteria"
- Student hasn't completed qualifying sessions yet (>2 min, >50% correct)
- Ask student to practice more before exporting

### CSV Import Errors
- Make sure to copy **all content** including the header row
- Check that quotation marks and commas weren't corrupted
- Try opening CSV in Excel/Numbers first to verify format

### Script Not Appearing
- Refresh the Google Sheet after installing the script
- Make sure you saved the script in Apps Script editor
- Check that you're looking at the correct Google Sheet

### Missing Student Name
- Student didn't set their name in Algebra Helper settings
- Ask students to go to Settings → Student Name and enter their name
- Re-export after setting name

---

## Advanced: Automated Import (Optional)

For teachers wanting fully automated imports, consider:

1. **Google Drive + Apps Script Trigger**
   - Students save CSV to shared Google Drive folder
   - Apps Script runs on a schedule to check for new files
   - Automatically imports and moves processed files

2. **Form-Based Submission**
   - Create a Google Form for students to paste CSV data
   - Apps Script processes form submissions
   - Automatically populates master tracking sheet

3. **Third-Party Integration Services**
   - Use Zapier, Make (Integromat), or similar services
   - Connect file uploads to Google Sheets
   - Set up rules for processing multiple students

*Note: These advanced methods require additional setup and are beyond the scope of this guide.*

---

## Support & Questions

### For Students
- Check the app's Stats modal for export options
- Make sure your browser allows downloads
- Contact your teacher if exports aren't working

### For Teachers
- Review this guide and the `google-sheets-import.gs` file
- Test with a sample CSV file first
- Reach out to your school's IT support for Google Sheets help

### Resources
- [Google Sheets IMPORTDATA Documentation](https://support.google.com/docs/answer/3093335?hl=en)
- [Google Apps Script Guides](https://developers.google.com/apps-script/)
- Algebra Helper GitHub Repository: [https://github.com/raymondclowe/algebra_helper](https://github.com/raymondclowe/algebra_helper)

---

## Sample Workflow

### Weekly Check-In Process:

**Monday** (Start of Week):
1. Remind students to practice throughout the week
2. Ensure students have set their name in the app

**Friday** (End of Week):
1. Ask students to export their CSV file
2. Students submit CSV via agreed method (email, drive, etc.)

**Weekend** (Teacher Review):
1. Import all student CSV files into your tracking sheet
2. Review session data for each student
3. Note students who need follow-up
4. Prepare feedback for following week

**Next Monday**:
1. Share progress insights with class
2. Provide individual feedback to students who need support
3. Encourage continued practice

---

## Example Use Cases

### Use Case 1: Homework Tracking
- Assign 20 minutes of practice as homework
- Students export CSV after completing practice
- Import CSV files to verify completion and effort

### Use Case 2: Progress Monitoring
- Track student improvement over semester
- Compare early vs. late session scores
- Identify topics students struggle with
- Adjust lesson plans based on practice data

### Use Case 3: Parent Communication
- Export data shows student practice time and accuracy
- Share summary with parents during conferences
- Demonstrate student engagement and areas for improvement

### Use Case 4: Grade Component
- Use practice sessions as part of participation grade
- Award points for consistent practice (not just high scores)
- Encourage growth mindset through improvement tracking

---

*Last Updated: December 2024*
