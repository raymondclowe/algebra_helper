/**
 * Google Sheets AppScript for Algebra Helper - Homework Tracking & Analysis
 * 
 * This enhanced script imports exported data from Algebra Helper for homework
 * tracking, self-reflection, and progress analysis.
 * 
 * VERSION: 2.0 - Enhanced for Homework Tracking
 * 
 * NEW FEATURES:
 * - ✓ Duplicate detection - prevents re-importing the same sessions
 * - ✓ Top 2-3 topics display - shows what was actually practiced
 * - ✓ Homework-friendly formatting - makes sessions count toward homework requirements
 * - ✓ Date & Time tracking - precise session timing
 * - ✓ Enhanced session summaries - clear descriptions of what was accomplished
 * 
 * HOW TO USE:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Copy this entire file into the script editor
 * 4. Save and close
 * 5. Refresh your Google Sheet - you'll see a new "Algebra Helper" menu
 * 6. Use "Algebra Helper > Import CSV Sessions" for homework tracking (Recommended)
 *    OR use "Import JSON Data" for detailed analysis with full data
 * 
 * The script supports two import methods:
 * 
 * METHOD 1: Import CSV Sessions (Recommended for Homework Tracking)
 * - Import the CSV file exported from the "Export Sessions" button
 * - CSV is pre-filtered to include only meaningful sessions (>2min, >50% correct)
 * - Automatically detects and skips duplicate sessions
 * - Shows top 2-3 topics practiced in each session
 * - Perfect for demonstrating homework completion
 * 
 * METHOD 2: Import JSON Data (Full Import for Detailed Analysis)
 * - Import the complete JSON export with all question data
 * - Groups questions into sessions (max 30min gap between questions)
 * - Creates a detailed summary sheet with homework-tracking columns:
 *   Date, Time, Topics Covered, What Was Practiced, Minutes Spent,
 *   Questions Answered, Questions Correct, Success Rate %, 
 *   Notes/Areas to Review, Checked ✓
 */

// Helper function to safely get UI - handles contexts where UI is not available
function safeGetUi() {
  try {
    return SpreadsheetApp.getUi();
  } catch (e) {
    // UI is not available in this context (e.g., triggered from API, time-based trigger, etc.)
    throw new Error('This function must be run from the Algebra Helper menu in Google Sheets. ' +
                    'It cannot be called from triggers, API calls, or other automated contexts. ' +
                    'Please open the Google Sheet and run the function from the menu: ' +
                    'Algebra Helper > Import CSV Sessions or Import JSON Data');
  }
}

// Add menu to Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Algebra Helper')
      .addItem('Import CSV Sessions', 'importCSVSessions')
      .addItem('Import JSON Data', 'importAlgebraHelperData')
      .addSeparator()
      .addItem('Clear Summary Sheet', 'clearSummarySheet')
      .addToUi();
}

// Import CSV sessions directly (pre-filtered data)
function importCSVSessions() {
  var ui = safeGetUi();
  
  // Prompt user to paste CSV data
  var response = ui.prompt(
    'Import CSV Sessions',
    'Please paste the contents of your exported CSV file (including header row):',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() != ui.Button.OK) {
    return;
  }
  
  try {
    var csvText = response.getResponseText();
    
    // Parse CSV
    var rows = parseCSV(csvText);
    
    if (rows.length < 2) {
      ui.alert('Error', 'CSV file appears to be empty or invalid.', ui.ButtonSet.OK);
      return;
    }
    
    // Define expected CSV structure
    var CSV_HEADERS = ['Date', 'Student Name', 'Duration (min)', 'Questions Total', 'Questions Correct', 'Score %', 'Topics Practiced'];
    var NUM_CSV_COLUMNS = CSV_HEADERS.length;
    var ANALYSIS_COLUMNS = ['Review Notes', 'Self-Assessment'];
    var TOTAL_COLUMNS = NUM_CSV_COLUMNS + ANALYSIS_COLUMNS.length;
    
    // Column indices for duplicate detection
    var COL_DATE = 0;
    var COL_STUDENT_NAME = 1;
    var COL_DURATION = 2;
    var COL_TOPICS = 6;
    
    // Validate header row
    var headers = rows[0];
    
    // Check if headers match (allowing for variations)
    var validHeader = CSV_HEADERS.every(function(header, index) {
      return headers[index] && headers[index].trim() === header;
    });
    
    if (!validHeader) {
      ui.alert('Error', 'CSV header row does not match expected format. Please ensure you exported from the "Export Sessions" button.', ui.ButtonSet.OK);
      return;
    }
    
    // Get or create summary sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = 'Algebra Helper Sessions';
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      
      // Add headers with additional columns for self-analysis
      var enhancedHeaders = CSV_HEADERS.concat(ANALYSIS_COLUMNS);
      
      sheet.getRange(1, 1, 1, enhancedHeaders.length).setValues([enhancedHeaders]);
      formatHeaderRow(sheet, enhancedHeaders.length);
    }
    
    // Import data rows (skip header)
    var dataRows = rows.slice(1);
    
    if (dataRows.length === 0) {
      ui.alert('Info', 'No data rows found in CSV.', ui.ButtonSet.OK);
      return;
    }
    
    // Check for duplicates based on date, student name, duration, and topics
    // Use a Set for O(n) lookup instead of O(n*m) with array.some()
    var existingSignatures = new Set();
    if (sheet.getLastRow() > 1) {
      var existingData = sheet.getRange(2, 1, sheet.getLastRow() - 1, NUM_CSV_COLUMNS).getValues();
      existingData.forEach(function(row) {
        // Create a unique signature using JSON.stringify to avoid delimiter collision
        var signature = JSON.stringify([
          String(row[COL_DATE]), 
          String(row[COL_STUDENT_NAME]), 
          String(row[COL_DURATION]), 
          String(row[COL_TOPICS])
        ]);
        existingSignatures.add(signature);
      });
    }
    
    var duplicateCount = 0;
    var newRows = [];
    
    dataRows.forEach(function(row) {
      // Create signature using JSON.stringify for robust comparison
      var signature = JSON.stringify([
        String(row[COL_DATE]), 
        String(row[COL_STUDENT_NAME]), 
        String(row[COL_DURATION]), 
        String(row[COL_TOPICS])
      ]);
      
      if (!existingSignatures.has(signature)) {
        newRows.push(row);
        existingSignatures.add(signature); // Add to set to detect duplicates within the import batch
      } else {
        duplicateCount++;
      }
    });
    
    if (newRows.length === 0) {
      ui.alert('Info', 'All ' + duplicateCount + ' session(s) already exist in the sheet. No new data imported.', ui.ButtonSet.OK);
      return;
    }
    
    // Find the next empty row
    var lastRow = sheet.getLastRow();
    var startRow = lastRow + 1;
    
    // Add new data to sheet (with empty columns for self-analysis)
    newRows.forEach(function(row, index) {
      // Extend row with empty analysis columns
      var enhancedRow = row.slice(0, NUM_CSV_COLUMNS).concat(['', '']); // Add Review Notes and Self-Assessment columns
      sheet.getRange(startRow + index, 1, 1, enhancedRow.length).setValues([enhancedRow]);
    });
    
    // Format the data range
    var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, TOTAL_COLUMNS);
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
    
    // Auto-resize columns
    for (var i = 1; i <= TOTAL_COLUMNS; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Activate the sheet
    ss.setActiveSheet(sheet);
    
    var message = 'Imported ' + newRows.length + ' new session(s) successfully!';
    if (duplicateCount > 0) {
      message += '\n' + duplicateCount + ' duplicate(s) were skipped.';
    }
    ui.alert('Success', message, ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Error', 'Failed to import CSV: ' + e.message, ui.ButtonSet.OK);
  }
}

// Parse CSV text into array of arrays
function parseCSV(csvText) {
  var rows = [];
  var lines = csvText.split('\n');
  
  lines.forEach(function(line) {
    if (line.trim() === '') return; // Skip empty lines
    
    var row = [];
    var inQuotes = false;
    var field = '';
    
    for (var i = 0; i < line.length; i++) {
      var char = line[i];
      var nextChar = i + 1 < line.length ? line[i + 1] : '';
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote (two consecutive quotes)
          field += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    
    // Add last field
    row.push(field.trim());
    rows.push(row);
  });
  
  return rows;
}

// Format header row
function formatHeaderRow(sheet, columnCount) {
  var headerRange = sheet.getRange(1, 1, 1, columnCount);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
}

// Main JSON import function
function importAlgebraHelperData() {
  var ui = safeGetUi();
  
  // Prompt user to paste JSON data
  var response = ui.prompt(
    'Import Algebra Helper Data',
    'Please paste the contents of your exported JSON file:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() != ui.Button.OK) {
    return;
  }
  
  try {
    var jsonText = response.getResponseText();
    var data = JSON.parse(jsonText);
    
    // Validate data
    if (!data.questions || !Array.isArray(data.questions)) {
      ui.alert('Error', 'Invalid data format. Please ensure you pasted the complete JSON export.', ui.ButtonSet.OK);
      return;
    }
    
    // Process data and create summary
    var sessions = groupIntoSessions(data.questions);
    var summaryData = createSummaryData(sessions);
    
    // Write to sheet
    writeToSummarySheet(summaryData);
    
    ui.alert('Success', 'Imported ' + data.questions.length + ' questions grouped into ' + sessions.length + ' sessions.', ui.ButtonSet.OK);
    
  } catch (e) {
    ui.alert('Error', 'Failed to import data: ' + e.message, ui.ButtonSet.OK);
  }
}

// Group questions into sessions (30 min gap threshold)
function groupIntoSessions(questions) {
  if (questions.length === 0) return [];
  
  // Sort questions by datetime
  questions.sort(function(a, b) {
    return a.datetime - b.datetime;
  });
  
  var sessions = [];
  var currentSession = {
    startTime: questions[0].datetime,
    endTime: questions[0].datetime,
    questions: [questions[0]]
  };
  
  var SESSION_GAP_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  for (var i = 1; i < questions.length; i++) {
    var q = questions[i];
    var timeSinceLastQuestion = q.datetime - currentSession.endTime;
    
    if (timeSinceLastQuestion > SESSION_GAP_MS) {
      // Start new session
      sessions.push(currentSession);
      currentSession = {
        startTime: q.datetime,
        endTime: q.datetime,
        questions: [q]
      };
    } else {
      // Add to current session
      currentSession.questions.push(q);
      currentSession.endTime = q.datetime;
    }
  }
  
  // Add last session
  sessions.push(currentSession);
  
  return sessions;
}

// Create summary data from sessions
function createSummaryData(sessions) {
  var summaryRows = [];
  
  // Header row - homework tracking friendly
  summaryRows.push([
    'Date',
    'Time',
    'Topics Covered',
    'What Was Practiced',
    'Minutes Spent',
    'Questions Answered',
    'Questions Correct',
    'Success Rate %',
    'Notes/Areas to Review',
    'Checked ✓'
  ]);
  
  // Process each session
  sessions.forEach(function(session) {
    var date = new Date(session.startTime);
    // Use spreadsheet timezone or fall back to GMT
    var timezone = 'GMT';
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if (ss) {
        timezone = ss.getSpreadsheetTimeZone();
      }
    } catch (e) {
      // If we can't get spreadsheet timezone, use GMT as fallback
      timezone = 'GMT';
    }
    var dateStr = Utilities.formatDate(date, timezone, 'dd/MM/yyyy');
    var timeStr = Utilities.formatDate(date, timezone, 'HH:mm');
    
    // Calculate session duration in minutes
    var durationMin = Math.round((session.endTime - session.startTime) / 1000 / 60);
    if (durationMin === 0) durationMin = 1; // Minimum 1 minute
    
    // Count correct/total questions
    var correctCount = 0;
    var totalCount = session.questions.length;
    var dontKnowCount = 0;
    
    // Track topics in this session
    var topicCounts = {};
    
    session.questions.forEach(function(q) {
      // Count correct answers (excluding "I don't know")
      if (!q.isDontKnow) {
        if (q.isCorrect) correctCount++;
      } else {
        dontKnowCount++;
      }
      
      // Track topics
      var topic = q.topic || 'Unknown';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
    
    // Sort topics by count (descending) to get top topics
    var topicEntries = [];
    for (var topic in topicCounts) {
      topicEntries.push({ topic: topic, count: topicCounts[topic] });
    }
    topicEntries.sort(function(a, b) { return b.count - a.count; });
    
    // Get top 2-3 topics for display
    var topTopics = topicEntries.slice(0, 3);
    var topicStr = '';
    
    if (topicEntries.length === 1) {
      // Single topic
      topicStr = topTopics[0].topic + ' (' + topTopics[0].count + ' questions)';
    } else {
      // Multiple topics - show top 2-3
      var topicParts = topTopics.map(function(t) {
        return t.topic + ' (' + t.count + ')';
      });
      
      if (topicEntries.length > 3) {
        // Add "and X more" if there are more than 3 topics
        var remaining = topicEntries.length - 3;
        topicStr = topicParts.join('; ') + '; +' + remaining + ' more';
      } else {
        topicStr = topicParts.join('; ');
      }
    }
    
    // Calculate percentage (excluding "I don't know")
    var answeredCount = totalCount - dontKnowCount;
    var percentageCorrect = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) / 100 : 0;
    
    // Build "What was done" description - make it homework-tracking friendly
    var whatDone = 'Practiced ';
    
    // Add top topics to the description
    if (topTopics.length === 1) {
      whatDone += topTopics[0].topic;
    } else if (topTopics.length === 2) {
      whatDone += topTopics[0].topic + ' and ' + topTopics[1].topic;
    } else if (topTopics.length >= 3) {
      whatDone += topTopics[0].topic + ', ' + topTopics[1].topic + ', and ' + topTopics[2].topic;
    }
    
    whatDone += ' (' + totalCount + ' question' + (totalCount > 1 ? 's' : '') + ')';
    
    if (dontKnowCount > 0) {
      whatDone += ' - ' + dontKnowCount + ' skipped';
    }
    
    // Build notes with areas needing review
    var notes = '';
    if (correctCount < answeredCount) {
      var wrongCount = answeredCount - correctCount;
      notes = wrongCount + ' incorrect';
      if (dontKnowCount > 0) {
        notes += '; ' + dontKnowCount + ' skipped';
      }
      notes += ' - Review needed';
    } else if (correctCount === answeredCount && answeredCount > 0) {
      notes = 'Perfect! All correct ⭐';
    }
    
    if (durationMin < 5) {
      if (notes) notes += '; ';
      notes += 'Short session';
    }
    
    // Add row with new structure
    summaryRows.push([
      dateStr,
      timeStr,
      topicStr,
      whatDone,
      durationMin,
      answeredCount,
      correctCount,
      percentageCorrect,
      notes,
      '' // Checked - empty for manual marking
    ]);
  });
  
  return summaryRows;
}

// Write summary data to sheet
function writeToSummarySheet(summaryData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Algebra Helper Summary';
  
  // Get or create summary sheet
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    // Clear existing data
    sheet.clear();
  }
  
  // Write data
  if (summaryData.length > 0) {
    var range = sheet.getRange(1, 1, summaryData.length, summaryData[0].length);
    range.setValues(summaryData);
    
    // Format header row
    var headerRange = sheet.getRange(1, 1, 1, summaryData[0].length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
    
    // Auto-resize columns
    for (var i = 1; i <= summaryData[0].length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Format percentage column as percentage (Column H - Success Rate %)
    if (summaryData.length > 1) {
      var percentageCol = 8; // Column H - Success Rate %
      var percentageRange = sheet.getRange(2, percentageCol, summaryData.length - 1, 1);
      percentageRange.setNumberFormat('0.00%');
    }
    
    // Add alternating row colors for readability
    var dataRange = sheet.getRange(2, 1, summaryData.length - 1, summaryData[0].length);
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  }
  
  // Activate the sheet
  ss.setActiveSheet(sheet);
}

// Clear summary sheet
function clearSummarySheet() {
  var ui = safeGetUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Algebra Helper Summary';
  var sheet = ss.getSheetByName(sheetName);
  
  if (sheet) {
    sheet.clear();
    ui.alert('Summary sheet cleared.');
  } else {
    ui.alert('No summary sheet found.');
  }
}
