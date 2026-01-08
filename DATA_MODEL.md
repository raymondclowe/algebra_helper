# Data Model Documentation

## Overview

This document describes the data structures used to store student progress, statistics, and preferences in the Algebra Helper application. All data is stored locally in the user's browser using IndexedDB and localStorage.

## IndexedDB Schema

### Database: `AlgebraHelperDB`

**Current Version:** 2 (as of 2026-01-08)

#### Object Store: `questions`

Stores individual question attempts with full metadata.

**Configuration:**
- **keyPath:** `id` (auto-increment)
- **Indexes:**
  - `datetime` (non-unique) - for time-based queries
  - `isCorrect` (non-unique) - for filtering by result
  - `eventHash` (non-unique) - for duplicate detection

**Record Structure:**

```javascript
{
    // Auto-generated identifier
    id: 1234,  // auto-increment primary key
    
    // Question content
    question: "\\text{Solve: } x^2 + 5x + 6 = 0",  // LaTeX string
    allAnswers: ["x = -2, -3", "x = 2, 3", "x = -1, -6", "x = 1, 6"],  // All choices
    correctAnswer: "x = -2, -3",  // The correct answer
    
    // Student response
    chosenAnswer: "x = -2, -3",  // What student selected
    isCorrect: true,  // Whether answer was correct
    isDontKnow: false,  // Whether student clicked "I don't know"
    attemptNumber: 1,  // 1st, 2nd, 3rd+ attempt on this type of question
    
    // Metadata
    topic: "Quadratic Equations",  // Topic name from TopicDefinitions
    level: 11.3,  // Floating-point level (11.0-12.0 = Quadratic Equations)
    datetime: 1704067200000,  // Unix timestamp in milliseconds
    timeSpent: 15.2,  // Seconds spent on this question
    
    // Learning support
    advice: "Factor as (x+2)(x+3) = 0, then solve each factor",  // Explanation (if wrong)
    hintsUsed: 0,  // Reserved for future hint system
    
    // Deduplication
    eventHash: "evt_abc123_1704067200000",  // Unique identifier for this event
    
    // Legacy fields (kept for backward compatibility)
    userAnswer: "x = -2, -3"  // Deprecated: use chosenAnswer instead
}
```

**Field Details:**

| Field | Type | Required | Description | Added in Version |
|-------|------|----------|-------------|------------------|
| `id` | Number | Yes (auto) | Auto-increment primary key | 1 |
| `question` | String | Yes | LaTeX question text | 1 |
| `allAnswers` | Array | Yes | All answer choices [A, B, C, D] | 2 |
| `chosenAnswer` | String | Yes | Student's selected answer | 2 |
| `correctAnswer` | String | Yes | The correct answer | 1 |
| `userAnswer` | String | No | Deprecated field (use chosenAnswer) | 1 |
| `isCorrect` | Boolean | Yes | Whether answer was correct | 1 |
| `isDontKnow` | Boolean | Yes | "I don't know" button clicked | 1 |
| `attemptNumber` | Number | Yes | Attempt number (1, 2, 3, ...) | 2 |
| `topic` | String | Yes | Topic name (e.g., "Fractions") | 1 |
| `level` | Number | Yes | Level number (0.0 - 34.9+) | 1 |
| `datetime` | Number | Yes | Unix timestamp (milliseconds) | 1 |
| `timeSpent` | Number | Yes | Time in seconds | 1 |
| `advice` | String | No | Explanation text (shown on wrong answer) | 1 |
| `hintsUsed` | Number | Yes | Number of hints used (future feature) | 2 |
| `eventHash` | String | Yes | Unique event identifier for deduplication | 2 |

**Migration History:**

- **Version 1 → 2:**
  - Added `allAnswers` field (default: `[correctAnswer]`)
  - Added `chosenAnswer` field (default: `correctAnswer` if correct, else `'unknown'`)
  - Added `hintsUsed` field (default: `0`)
  - Added `eventHash` index and field (generated from question data)
  - Added `attemptNumber` field (default: `1`)

**Constraints:**

- ✅ Fields can be added with defaults (increment DB_VERSION)
- ✅ Old records are migrated on upgrade via `migrateExistingData()`
- ❌ Never remove fields (keep for backward compatibility)
- ❌ Never change field types without migration
- ❌ Never change field semantics (e.g., level numbering)

## localStorage Schema

### Key: `algebraHelperStats`

Stores cumulative statistics across all sessions.

**Structure:**

```javascript
{
    totalActiveTime: 3600,     // Total time spent (seconds)
    totalQuestions: 150,       // Total questions answered
    correctAnswers: 120,       // Correct answers (excluding "don't know")
    wrongAnswers: 20,          // Wrong answers
    dontKnowAnswers: 10,       // "I don't know" clicks
    lastUpdated: 1704067200000 // Unix timestamp of last update
}
```

**Field Details:**

| Field | Type | Description |
|-------|------|-------------|
| `totalActiveTime` | Number | Total seconds spent practicing |
| `totalQuestions` | Number | Total questions answered (correct + wrong + don't know) |
| `correctAnswers` | Number | Number of correct answers |
| `wrongAnswers` | Number | Number of incorrect answers |
| `dontKnowAnswers` | Number | Number of "I don't know" responses |
| `lastUpdated` | Number | Unix timestamp (ms) when stats were last updated |

**Update Pattern:**
```javascript
// Increment on each question
StorageManager.updateStats({
    totalQuestions: 1,
    correctAnswers: isCorrect ? 1 : 0,
    wrongAnswers: (!isCorrect && !isDontKnow) ? 1 : 0,
    dontKnowAnswers: isDontKnow ? 1 : 0
});
```

### Key: `algebraHelperStudentName`

Stores the student's name for personalization and exports.

**Type:** String

**Example:** `"John Smith"`

**Usage:**
- Displayed in UI when set
- Included in CSV exports
- Optional field (can be empty)

### Key: `algebraHelperDailyStats`

Tracks time spent today for daily goals.

**Structure:**

```javascript
{
    date: "Wed Jan 08 2026",  // Date string (for comparison)
    minutesSpent: 45          // Minutes practiced today
}
```

**Reset Behavior:**
- Automatically resets when date changes
- Archived to `algebraHelperDailyHistory` at day end

### Key: `algebraHelperDailyHistory`

Historical record of daily practice time.

**Structure:**

```javascript
{
    "Wed Jan 08 2026": {
        minutesSpent: 45,
        date: "Wed Jan 08 2026",
        timestamp: 1704067200000
    },
    "Thu Jan 09 2026": {
        minutesSpent: 30,
        date: "Thu Jan 09 2026",
        timestamp: 1704153600000
    }
    // ... more dates
}
```

**Usage:**
- Historical trend analysis
- Weekly/monthly practice summaries
- Consistency tracking

### Key: `displayMode`

User's preferred display mode for level/score information.

**Type:** String (enum)

**Possible Values:**
- `"mastery"` - Shows topic names, hides exact numbers (default)
- `"growth"` - Shows level bands (5-6), de-emphasizes competition
- `"classic"` - Shows exact level numbers (5.3)

**Example:** `"mastery"`

## Topic-Level Mapping

### Level Ranges and Topics

**Protected Contract:** These mappings must remain stable to preserve historical data integrity.

```javascript
// From topic-definitions.js
Level 0-1:   "Basic Arithmetic"
Level 2:     "Powers and Roots"
Level 3:     "Multiplication and Division"
Level 4:     "Fractions"
Level 5:     "Decimals & Percentages"
Level 6:     "Simple Linear Equations"
Level 7:     "Two-Step Equations"
Level 8:     "Inequalities"
Level 9:     "Expanding Expressions"
Level 10:    "Factorising Quadratics"
Level 11:    "Quadratic Equations"
Level 12:    "Polynomials"
Level 13:    "Exponentials & Logarithms"
Level 14:    "Sequences & Series"
Level 15:    "Functions"
Level 16:    "Basic Trigonometry"
Level 17:    "Advanced Trigonometry"
Level 18:    "Vectors"
Level 19:    "Complex Numbers"
Level 20:    "Basic Differentiation"
Level 21:    "Advanced Calculus"
Level 22:    "Statistics"
Level 23:    "Basic Probability"
Level 24:    "Advanced Probability"
Level 25:    "Integration & Series"
Level 26:    "Proof by Induction"
Level 27:    "Proof by Contradiction"
Level 28:    "Matrix Algebra"
Level 29:    "3D Vectors"
Level 30:    "Complex Numbers (Polar)"
Level 31:    "Advanced Integration"
Level 32:    "Differential Equations"
Level 33:    "Probability Distributions"
Level 34+:   "Hypothesis Testing"
```

**Why This Matters:**

1. **Historical Data**: Questions are stored with level numbers
2. **Topic Stats**: Stats are grouped by topic name
3. **CSV Exports**: Sessions are labeled with topic names
4. **User Progress**: Students track progress by topic

**Migration Impact:**

- ❌ Renumbering levels breaks historical level→topic lookups
- ❌ Renaming topics makes historical data unsearchable
- ✅ Adding new levels at end (35, 36, ...) is safe
- ✅ Adding question types within levels is safe

## Data Flow Diagrams

### Question Attempt Flow

```
Student answers question
         ↓
    drill.js captures response
         ↓
    Prepare questionData object
         ↓
    Add eventHash for deduplication
         ↓
    StorageManager.saveQuestion(questionData)
         ↓
    IndexedDB: questions.add(questionData)
         ↓
    StorageManager.updateStats({correctAnswers: 1})
         ↓
    localStorage: algebraHelperStats updated
         ↓
    ActivityTracker updates daily time
         ↓
    localStorage: algebraHelperDailyStats updated
```

### Stats Retrieval Flow

```
User clicks Stats button
         ↓
    StatsModal.show()
         ↓
    StorageManager.getAllQuestions()
         ↓
    Group questions by topic
         ↓
    Calculate accuracy per topic
         ↓
    Filter topics (>50% score, meaningful engagement)
         ↓
    Display in Stats Modal
```

### CSV Export Flow

```
User clicks "Export Sessions"
         ↓
    StorageManager.exportSessionsCSV()
         ↓
    Get all questions from IndexedDB
         ↓
    Group into sessions (30min gap)
         ↓
    Filter sessions (>2min, >50% correct)
         ↓
    Calculate stats per session
         ↓
    Format as CSV with topic names
         ↓
    Trigger browser download
```

## Export Formats

### JSON Export Format

Full data backup including all question history and stats.

```json
{
  "version": "1.0",
  "exportDate": "2026-01-08T12:00:00.000Z",
  "dbVersion": 2,
  "questions": [
    {
      "id": 1,
      "question": "\\text{Solve: } x + 5 = 10",
      "correctAnswer": "x = 5",
      "isCorrect": true,
      "topic": "Simple Linear Equations",
      "level": 6.2,
      "datetime": 1704067200000,
      "timeSpent": 12.5
    }
    // ... more questions
  ],
  "stats": {
    "totalActiveTime": 3600,
    "totalQuestions": 150,
    "correctAnswers": 120,
    "wrongAnswers": 20,
    "dontKnowAnswers": 10,
    "lastUpdated": 1704067200000
  },
  "dailyStats": {
    "date": "Wed Jan 08 2026",
    "minutesSpent": 45
  },
  "learningVelocity": {
    "velocity": 2.5,
    "earlyAccuracy": 70.0,
    "lateAccuracy": 82.5,
    "timeSpanHours": 5.0,
    "questionCount": 50
  },
  "localStorage": {
    "algebraHelperStats": { /* ... */ },
    "algebraHelperStudentName": "John Smith",
    "displayMode": "mastery"
  }
}
```

### CSV Export Format

Filtered practice sessions for academic tracking.

```csv
Date,Topic,What was done,How long did it take (min),Correct Questions,Total Questions,If not right,Checked by AI (link),Checked by human,Percentage correct
1/8/2026,"Fractions(15); Decimals & Percentages(8)","Practiced 23 questions across topics: Fractions(15); Decimals & Percentages(8)",25,21,23,"2/3 + 1/4 = ?; 0.75 × 0.4 = ?",,85
```

**CSV Fields:**

1. **Date**: Session start date (M/D/YYYY)
2. **Topic**: Topic names with question counts
3. **What was done**: Descriptive summary
4. **How long did it take (min)**: Session duration in minutes
5. **Correct Questions**: Number of correct answers
6. **Total Questions**: Total questions in session
7. **If not right**: Sample of incorrect questions (up to 3)
8. **Checked by AI (link)**: Optional external review link
9. **Checked by human**: Optional human verification field
10. **Percentage correct**: Score as percentage

**Filtering Rules:**
- Only sessions > 2 minutes duration
- Only sessions with > 50% correct rate
- Sessions separated by 30+ minute gaps

## Data Integrity Constraints

### Primary Constraints

1. **Level Numbers (0-34) are immutable**
   - Historical data references level numbers
   - Topic mapping depends on level ranges
   - CSV exports use levels to determine topics

2. **Topic Names should remain stable**
   - Stats are grouped by exact topic name
   - Historical data cannot auto-migrate on rename
   - Display mapping preferred over renaming

3. **Required fields must have defaults**
   - New fields must provide migration defaults
   - Old records must remain valid after upgrade
   - No null/undefined in required fields

4. **Datetime is authoritative timestamp**
   - Used for session grouping (30min gap)
   - Used for daily/weekly/monthly stats
   - Must be Unix timestamp in milliseconds

5. **Event hashes prevent duplicates**
   - Generated from question + answers + datetime
   - Used to detect duplicate imports
   - Should be unique per question attempt

### Secondary Constraints

1. **attemptNumber starts at 1**
   - Legacy records default to 1
   - Increments on repeated question types
   - Used for "right first time" statistics

2. **isDontKnow is exclusive with isCorrect**
   - Both can be false (wrong answer)
   - Both cannot be true
   - "Don't know" is not counted as correct or wrong in some stats

3. **timeSpent is in seconds**
   - Stored as float for precision
   - Displayed as integers in most UIs
   - Used for daily/session time calculations

4. **topic must map to a valid level range**
   - Validated via TopicDefinitions.getTopicForLevel()
   - Unknown topics default to "Unknown"
   - Used for grouping in stats and exports

## Migration Guidelines

### Schema Version Upgrade Checklist

When incrementing `DB_VERSION`:

1. **Update version number**
   ```javascript
   DB_VERSION: 3, // Increment from 2
   ```

2. **Add migration handler**
   ```javascript
   if (event.oldVersion < 3) {
       this.migrateToVersion3(objectStore);
   }
   ```

3. **Provide backward compatibility**
   ```javascript
   migrateToVersion3: function(objectStore) {
       const getAllRequest = objectStore.getAll();
       getAllRequest.onsuccess = () => {
           const records = getAllRequest.result;
           records.forEach(record => {
               // Add new field with default
               if (!record.newField) {
                   record.newField = defaultValue;
               }
               objectStore.put(record);
           });
       };
   }
   ```

4. **Test migration thoroughly**
   - Export data from v2
   - Upgrade to v3
   - Import v2 data
   - Verify all fields present
   - Check stats display correctly

5. **Document the change**
   - Update this file (DATA_MODEL.md)
   - Update AGENTS.md
   - Add migration notes to storage-manager.js

### Breaking Change Protocol

If a breaking change is unavoidable:

1. **Export tool**: Provide data export before upgrade
2. **Migration utility**: Create conversion tool
3. **User warning**: Notify users of upcoming change
4. **Rollback plan**: Maintain previous version for rollback
5. **Support period**: Keep both versions available temporarily

## Performance Considerations

### IndexedDB Query Patterns

**Fast queries** (use indexes):
- Get all questions: `objectStore.getAll()`
- Filter by datetime: `index('datetime').getAll(IDBKeyRange.bound(start, end))`
- Filter by result: `index('isCorrect').getAll(IDBKeyRange.only(true))`

**Slow queries** (require full scan):
- Filter by topic (no index)
- Filter by level (no index)
- Complex multi-field filters

**Optimization strategies:**
- Load all and filter in memory (reasonable for <10,000 records)
- Consider adding indexes for frequently queried fields
- Use pagination for large result sets

### localStorage Limits

- **Typical limit**: 5-10 MB per origin
- **Current usage**: ~5-50 KB (stats + prefs)
- **Growth rate**: Minimal (only cumulative stats)
- **Risk**: Very low (IndexedDB holds bulk data)

### Data Size Estimates

| Data Type | Per Record | 1,000 Records | 10,000 Records |
|-----------|------------|---------------|----------------|
| Question (IndexedDB) | ~500 bytes | ~500 KB | ~5 MB |
| Stats (localStorage) | ~200 bytes | N/A (single record) | N/A |
| Daily History (localStorage) | ~100 bytes/day | ~36 KB/year | ~360 KB/10 years |

**Expected scale:**
- Active user: 100-500 questions per month
- Power user: 1,000-5,000 questions per month
- 1 year of data: 1,200-60,000 questions (0.6-30 MB)

## Security and Privacy

### Data Storage Location

- **All data stored locally** in user's browser
- **No server storage** (fully client-side)
- **No cloud sync** (localStorage + IndexedDB only)

### Data Sharing

- **CSV Export**: User-initiated, manual download
- **JSON Export**: User-initiated, manual download
- **No automatic sharing**: Data never leaves device without user action

### Privacy Features

- **Optional name**: Student name is not required
- **No tracking**: No analytics or user tracking
- **Offline capable**: Works without internet connection
- **No accounts**: No email or authentication required

### Data Retention

- **User controlled**: Data persists until user clears browser data
- **Manual clear**: "Clear All Data" button available in Stats modal
- **No expiration**: Data never auto-deletes
- **Export available**: Users can backup before clearing

## Troubleshooting

### Common Issues

1. **"Database not initialized" error**
   - Cause: StorageManager.init() not called
   - Fix: Ensure initialization in main.js startup

2. **Missing fields in old records**
   - Cause: Viewing v1 data in v2+ app
   - Fix: Migration runs automatically on upgrade
   - Verify: Check DB_VERSION in console

3. **Stats showing wrong topic names**
   - Cause: Topic name changed without migration
   - Fix: Add display name mapping
   - Prevention: Don't rename topics (see AGENTS.md)

4. **CSV export shows no sessions**
   - Cause: No sessions meet filter criteria (>2min, >50%)
   - Fix: User needs longer practice sessions
   - Info: Filtering is intentional for quality exports

5. **"QuotaExceededError" in IndexedDB**
   - Cause: Storage limit reached (rare)
   - Fix: Export and clear old data
   - Prevention: Monitor data size (see Performance section)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-08  
**Current DB_VERSION:** 2  
**Current Schema Status:** Stable
