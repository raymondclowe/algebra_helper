# Guidelines for AI Agents Working on This Repository

## Overview

This document provides critical guidelines for AI agents (including GitHub Copilot, custom agents, and other automated tools) working on the Algebra Helper codebase. These guidelines ensure that changes preserve student data integrity and maintain backward compatibility.

## Goals

The student who has practiced with this app should be so well prepared for the exam, able to answer basic questions instantly, that they can focus their mental energy on the more complex, higher-order thinking questions during the exam. Therefore they get a perfect IB score of 7 !

## Critical Rule: Preserve Student Data Integrity

**NEVER make changes that could corrupt, lose, or make inaccessible existing student data.**

Student progress, statistics, and historical data are stored locally in:
- **IndexedDB** (`AlgebraHelperDB`) - Individual question history with metadata
- **localStorage** - Cumulative statistics, user preferences, daily stats

### Protected Data Structures

#### 1. Level Numbers (0-34)

**DO NOT renumber or reorder levels without a migration strategy.**

- Levels 0-34 map to specific topics via `TopicDefinitions.getTopicForLevel()`
- "Levels" are internal gamification constructs and must remain stable, they are unrelated to any educational or ib standards
- Historical question data stores `level` field (e.g., level 12 = "Polynomials")
- Student stats and CSV exports rely on level numbers for topic identification
- **If levels must change**: Implement a migration in `StorageManager.migrateExistingData()`


**Example Protected Mapping:**
```javascript
// topic-definitions.js - DO NOT change these mappings without migration
if (band <= 1) return "Basic Arithmetic";
if (band <= 2) return "Powers and Roots";
// ... up to level 34
```

**Safe Changes:**
- ✅ Adding new levels at the end (35, 36, etc.)
- ✅ Adding question types within existing levels
- ❌ Renumbering existing levels (breaks historical data)
- ❌ Removing levels (orphans historical data)

#### 2. Topic Names

**DO NOT rename topics without ensuring backward compatibility.**

- Topic names appear in stored question data: `topic: "Polynomials"`
- Stats modal groups questions by topic name
- CSV exports include topic names
- Historical data cannot be automatically migrated if topics are renamed

**Safe Changes:**
- ✅ Adding new topics (with new level numbers)
- ✅ Adding question types to existing topics
- ⚠️ Renaming topics: Update display logic to map old→new names
- ❌ Deleting topic names (makes historical data unmatchable)

**If a topic must be renamed**, add a mapping function:
```javascript
// Example migration approach
getLegacyTopicName: function(modernName) {
    const legacyMap = {
        "New Topic Name": "Old Topic Name",
        // Add mappings as needed
    };
    return legacyMap[modernName] || modernName;
}
```

#### 3. Question Data Schema

**All stored question records contain these fields:**

```javascript
{
    id: auto-increment,              // IndexedDB key
    question: "LaTeX string",        // Question text
    allAnswers: ["A", "B", "C", "D"], // All answer choices
    chosenAnswer: "A",               // Student's selection
    correctAnswer: "A",              // Correct answer
    userAnswer: "A",                 // Deprecated, kept for compatibility
    advice: "explanation text",      // Shown on wrong answer
    timeSpent: 15.2,                 // Seconds spent on question
    datetime: 1704067200000,         // Unix timestamp (ms)
    isCorrect: true,                 // Boolean result
    isDontKnow: false,               // "I don't know" clicked
    attemptNumber: 1,                // 1st, 2nd, 3rd attempt
    topic: "Polynomials",            // Topic name
    level: 12.3,                     // Level (floating point)
    hintsUsed: 0,                    // Reserved for future
    eventHash: "evt_abc123_...",     // Unique event identifier
}
```

**When adding new fields:**
1. Make them optional (or provide defaults in migration)
2. Update `DB_VERSION` in `storage-manager.js`
3. Implement migration in `StorageManager.migrateExistingData()`
4. Test with existing data to ensure no data loss

**Example Migration Pattern:**
```javascript
// storage-manager.js
DB_VERSION: 3,  // Increment version

// In onupgradeneeded handler
if (event.oldVersion < 3) {
    // Add migration logic
    const getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = () => {
        const records = getAllRequest.result;
        records.forEach(record => {
            if (!record.newField) {
                record.newField = defaultValue;
            }
            objectStore.put(record);
        });
    };
}
```

#### 4. LocalStorage Statistics

**Protected localStorage keys:**
- `algebraHelperStats` - Cumulative totals (JSON)
- `algebraHelperStudentName` - Student's name (string)
- `algebraHelperDailyStats` - Today's time tracking (JSON)
- `algebraHelperDailyHistory` - Historical daily stats (JSON)
- `displayMode` - User's display preference (string)

**DO NOT:**
- Remove or rename these keys without migration
- Change the structure without providing defaults for missing fields
- Clear these unintentionally (user data loss)

**Safe Pattern for Schema Changes:**
```javascript
getStats: function() {
    const statsJSON = localStorage.getItem('algebraHelperStats');
    if (statsJSON) {
        try {
            const stats = JSON.parse(statsJSON);
            // Add new fields with defaults if missing
            stats.newField = stats.newField || defaultValue;
            return stats;
        } catch (e) {
            return this.getDefaultStats();
        }
    }
    return this.getDefaultStats();
}
```

## Database Versioning Strategy

### Current Version: DB_VERSION = 2

Version 2 added:
- `eventHash` index for duplicate detection
- Migration for: `allAnswers`, `chosenAnswer`, `hintsUsed`, `eventHash`, `attemptNumber`

### When to Increment DB_VERSION

Increment `DB_VERSION` when:
- Adding new required fields to stored questions
- Adding new indexes to IndexedDB
- Changing data types or structures
- Removing deprecated fields (keep them for one version with migration)

### Migration Checklist

When making schema changes:

1. **Increment DB_VERSION**
   ```javascript
   DB_VERSION: 3, // Increment from 2 to 3
   ```

2. **Add migration logic in `onupgradeneeded`**
   ```javascript
   if (event.oldVersion < 3) {
       // Your migration code here
       this.migrateToVersion3(objectStore);
   }
   ```

3. **Provide default values for new fields**
   - Ensure old data remains valid
   - Use sensible defaults (not null/undefined unless intended)

4. **Test with existing data**
   - Export data from current version
   - Upgrade to new version
   - Import exported data
   - Verify all data is accessible and correct

5. **Document the change**
   - Update comments in `storage-manager.js`
   - Add notes to this file (AGENTS.md)
   - Mention in PR description

## Question Generation Guidelines

### Adding New Question Types

**Safe to do:**
- Add new question types to existing levels
- Use `Math.floor(Math.random() * N)` to randomly select among N types
- Ensure backward compatibility (old levels still work)

**Example:**
```javascript
// Safe: Adding a new question type to level 10
if (band <= 10) {
    const types = ['factorQuadratic', 'expandBinomial', 'newType'];
    const typeIndex = Math.floor(Math.random() * types.length);
    // Generate question based on type
}
```

### Level-Specific Generation

Current level ranges (as of 2026-01):
- 0-1: Basic Arithmetic
- 2: Powers and Roots
- 3: Multiplication and Division
- 4: Fractions
- 5: Decimals & Percentages
- 6-7: Linear Equations
- 8: Inequalities
- 9: Expanding Expressions
- 10-11: Quadratics
- 12: Polynomials
- 13: Exponentials & Logarithms
- 14: Sequences & Series
- 15: Functions
- 16-17: Trigonometry
- 18: Vectors
- 19: Complex Numbers
- 20-21: Calculus
- 22-24: Statistics & Probability
- 25-34: Advanced HL Topics

**When adding content at a specific level:**
1. Check `topic-definitions.js` for current level→topic mapping
2. Add questions that fit the topic's difficulty
3. Maintain variety within the level
4. Test that questions are appropriate for the difficulty band

## Display and UI Changes

### Safe Display Changes

**These changes do NOT affect stored data:**
- Modifying how levels are displayed (e.g., "Level 5-6" vs "5.3")
- Changing topic names in the UI only (map old→new for display)
- Adjusting stats modal presentation
- Reformatting CSV exports (add columns, don't remove)

**Example Safe Display Mapping:**
```javascript
// Display new name, but use old name for data queries
getDisplayTopicName: function(storedTopic) {
    const displayMap = {
        "Old Topic": "New Display Name",
    };
    return displayMap[storedTopic] || storedTopic;
}
```

### Display Mode Compatibility

The app supports multiple display modes:
- `MASTERY`: Shows topic names, hides exact numbers
- `GROWTH`: Shows level bands, de-emphasizes competition
- `CLASSIC`: Shows exact level numbers

**All modes must work with the same underlying data.**

Changes to display modes should not require data migration.

## Testing Requirements

### Before Merging Changes That Touch Data

1. **Test with empty database**
   - Fresh user experience should work

2. **Test with existing data**
   - Export data from production version
   - Load your changes
   - Import the exported data
   - Verify stats, history, and navigation work correctly

3. **Test migrations**
   - Simulate upgrade from v1 to v2 (or current to new version)
   - Check console for migration errors
   - Verify all fields populated correctly

4. **Test CSV export**
   - Ensure exported data is complete
   - Check that topic names are correct
   - Verify question history is accurate

### Regression Testing

After level or topic changes:
- Navigate through all levels (0-34)
- Generate multiple questions per level
- Check that topic names display correctly in stats
- Export and verify CSV contains correct topic names

## CSV Export Considerations

Students may export their practice sessions for academic tracking. The CSV format is:

```csv
Date,Topic,What was done,How long did it take (min),Correct Questions,Total Questions,If not right,Checked by AI (link),Checked by human,Percentage correct
```

**Protected by this format:**
- Topic names (must remain consistent or be mapped)
- Question counts (must be accurate)
- Time tracking (must be in minutes)
- Score percentage (must match stored data)

**If CSV format changes:**
- Add new columns at the end (don't reorder)
- Don't remove existing columns (downstream tools may depend on them)
- Document format changes in GOOGLE_SHEETS_INTEGRATION.md

## Common Pitfalls to Avoid

### ❌ Don't Do This

1. **Renumbering levels without migration**
   ```javascript
   // BAD: Changing level 12 from Polynomials to something else
   if (band <= 12) return "New Topic"; // Breaks historical data!
   ```

2. **Removing topic names**
   ```javascript
   // BAD: Removing a topic entirely
   // Historical data will have orphaned topic names
   ```

3. **Changing required fields without defaults**
   ```javascript
   // BAD: Adding required field without migration
   const questionData = {
       newRequiredField: someValue, // Old data won't have this!
   };
   ```

4. **Breaking CSV export format**
   ```javascript
   // BAD: Reordering or removing CSV columns
   csvRows.push([score, date, topic]); // Wrong order!
   ```

5. **Clearing data without confirmation**
   ```javascript
   // BAD: Clearing data without user consent
   localStorage.clear(); // Loses all student data!
   ```

### ✅ Do This Instead

1. **Add levels at the end**
   ```javascript
   // GOOD: Level 35 is new, doesn't affect historical data
   if (band <= 35) return "New Advanced Topic";
   ```

2. **Add display name mapping**
   ```javascript
   // GOOD: Map old names to new for display, keep data intact
   getDisplayName: function(storedName) {
       return nameMap[storedName] || storedName;
   }
   ```

3. **Provide migration with defaults**
   ```javascript
   // GOOD: Add field with sensible default
   if (!record.newField) {
       record.newField = defaultValue;
   }
   ```

4. **Extend CSV format carefully**
   ```javascript
   // GOOD: Add new column at end, keep existing order
   csvRows.push([date, topic, whatDone, duration, correct, total, 
                 ifNotRight, aiLink, humanCheck, percent, newColumn]);
   ```

5. **Confirm before clearing**
   ```javascript
   // GOOD: Get explicit user confirmation
   if (confirm("This will delete all your data. Continue?")) {
       clearAllData();
   }
   ```

## Version Control and Rollback

### Before Deploying Schema Changes

1. **Tag the current version**
   ```bash
   git tag -a v2.x-stable -m "Stable version before schema change"
   ```

2. **Document the change**
   - Update this file (AGENTS.md)
   - Add comments to storage-manager.js
   - Include migration notes in commit message

3. **Plan rollback strategy**
   - Can users downgrade safely?
   - Do we need export/import cycle for safety?
   - How will we handle if migration fails?

### If Migration Fails

1. Revert to previous version immediately
2. Export user data if possible
3. Fix migration code
4. Test thoroughly before re-deploying
5. Notify affected users if any data was impacted

## Contact and Questions

If you're unsure whether a change will affect student data:

1. **Review this document first**
2. **Check existing migration code** in `storage-manager.js`
3. **Test with real data exports** before merging
4. **Ask for human review** if uncertain

Remember: **Student data is irreplaceable. When in doubt, preserve backward compatibility.**

## Change Log

### 2026-01-08
- Initial version of AGENTS.md created
- Documented DB_VERSION 2 schema
- Established level-topic mapping contract
- Added migration guidelines
- Defined protected data structures

---

**Last Updated:** 2026-01-08
**Current DB_VERSION:** 2
**Current MAX_LEVEL:** 34
**Storage Format:** IndexedDB + localStorage
