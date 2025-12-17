/**
 * Google Sheets AppScript for Algebra Helper Data Import and Analysis
 * 
 * This script imports exported JSON data from Algebra Helper and creates
 * a session-based summary for tracking student progress.
 * 
 * HOW TO USE:
 * 1. Open Google Sheets
 * 2. Go to Extensions > Apps Script
 * 3. Copy this entire file into the script editor
 * 4. Save and close
 * 5. Refresh your Google Sheet - you'll see a new "Algebra Helper" menu
 * 6. Use "Algebra Helper > Import Data" to import your JSON file
 * 
 * The script will:
 * - Parse your exported JSON data
 * - Group questions into sessions (max 30min gap between questions)
 * - Create a summary sheet with columns:
 *   Date, Topic, What was done, How long did it take (min), Correct Questions, 
 *   Total Questions, If not right, Checked by AI (link) (optional), 
 *   Checked by human (mandatory), Percentage correct, Notes
 */

// Add menu to Google Sheets
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Algebra Helper')
      .addItem('Import Data', 'importAlgebraHelperData')
      .addItem('Clear Summary Sheet', 'clearSummarySheet')
      .addToUi();
}

// Main import function
function importAlgebraHelperData() {
  var ui = SpreadsheetApp.getUi();
  
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
  
  // Header row
  summaryRows.push([
    'Date',
    'Topic',
    'What was done',
    'How long did it take (min)',
    'Correct Questions',
    'Total Questions',
    'If not right',
    'Checked by AI (link) (optional)',
    'Checked by human (mandatory)',
    'Percentage correct',
    'Notes'
  ]);
  
  // Process each session
  sessions.forEach(function(session) {
    var date = new Date(session.startTime);
    var dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    
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
    
    // Get primary topic (most common)
    var primaryTopic = 'Mixed';
    var maxCount = 0;
    for (var topic in topicCounts) {
      if (topicCounts[topic] > maxCount) {
        maxCount = topicCounts[topic];
        primaryTopic = topic;
      }
    }
    
    // Create topic string with counts if multiple topics
    var topicStr = primaryTopic;
    if (Object.keys(topicCounts).length > 1) {
      var topicDetails = [];
      for (var topic in topicCounts) {
        topicDetails.push(topic + ': ' + topicCounts[topic]);
      }
      topicStr = 'Mixed (' + topicDetails.join(', ') + ')';
    }
    
    // Calculate percentage (excluding "I don't know")
    var answeredCount = totalCount - dontKnowCount;
    var percentageCorrect = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) / 100 : 0;
    
    // Build "What was done" description
    var whatDone = totalCount + ' questions practiced';
    if (dontKnowCount > 0) {
      whatDone += ' (' + dontKnowCount + ' skipped with "I don\'t know")';
    }
    
    // Build "If not right" field
    var wrongDetails = '';
    if (correctCount < answeredCount) {
      var wrongCount = answeredCount - correctCount;
      wrongDetails = wrongCount + ' incorrect';
      if (dontKnowCount > 0) {
        wrongDetails += ', ' + dontKnowCount + ' skipped';
      }
    }
    
    // Notes field - include any useful metadata
    var notes = '';
    if (session.questions.length === 1) {
      notes = 'Single question session';
    }
    
    // Add row
    summaryRows.push([
      dateStr,
      topicStr,
      whatDone,
      durationMin,
      correctCount,
      answeredCount,
      wrongDetails,
      '', // Checked by AI (optional) - empty for manual entry
      '', // Checked by human (mandatory) - empty for manual entry
      percentageCorrect,
      notes
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
    
    // Format percentage column as percentage
    if (summaryData.length > 1) {
      var percentageCol = 10; // Column J
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = 'Algebra Helper Summary';
  var sheet = ss.getSheetByName(sheetName);
  
  if (sheet) {
    sheet.clear();
    SpreadsheetApp.getUi().alert('Summary sheet cleared.');
  } else {
    SpreadsheetApp.getUi().alert('No summary sheet found.');
  }
}
