# GitHub Issues Cleanup

This directory contains files for cleaning up issues #78-87 that were created via voice typing and contain formatting, grammar, and spelling errors.

## Files

### ISSUES_CLEANUP.md
A comprehensive document containing the cleaned-up versions of all issues #78-87. This includes:
- Original titles and bodies (for reference)
- Cleaned and corrected versions with proper grammar, spelling, and formatting
- Better organization and structure
- More complete descriptions

### update-issues.sh
A bash script that can be used to automatically update the GitHub issues with the cleaned-up content. 

**Requirements:**
- GitHub CLI (`gh`) must be installed
- You must be authenticated with GitHub CLI
- You must have write access to the repository

**Usage:**
```bash
./update-issues.sh
```

This script will update all issues #78-87 with their cleaned-up content.

## Manual Update Process

If you prefer to update the issues manually, you can:

1. Open `ISSUES_CLEANUP.md`
2. For each issue, copy the cleaned title and body
3. Navigate to the issue on GitHub
4. Click "Edit" 
5. Replace the title and body with the cleaned versions
6. Click "Save"

## Issues Updated

The following issues have been cleaned up:

- **#78**: Convert stats page to educational and encouraging format
- **#79**: Connect to paper homework for personalized practice
- **#80**: Create "Fixing Habits" topic category
- **#81**: Ask for user's name during setup
- **#82**: Reduce font sizes on mobile devices
- **#83**: Display time spent on questions today and yesterday
- **#84**: Google Sheets integration for homework tracking
- **#85**: Bug: Multiple answers are the same
- **#86**: Long text in buttons is not wrapping to two lines
- **#87**: Mobile layout is too cramped

All issues had grammar, spelling, and formatting corrections applied, along with improved organization and clarity.
