# JavaScript Module Structure

This directory contains the modular JavaScript code for Algebra Helper. The code has been split into separate files to make development easier and reduce merge conflicts.

## File Organization

### Core Modules

- **`constants.js`** - Configuration constants for gamification features
  - Animation timings
  - Sound settings
  - Visual effect parameters

- **`state.js`** - Application state management
  - Global APP object
  - Level tracking
  - Calibration state
  - History tracking

- **`ui.js`** - UI management functions
  - Question rendering
  - UI updates
  - Display management

- **`drill.js`** - Drill mode logic
  - Multiple choice UI setup
  - Answer handling
  - Level adjustment logic

- **`calibration.js`** - Calibration mode logic
  - Binary search algorithm
  - Statistical confidence checks
  - Calibration completion logic

- **`gamification.js`** - Gamification features
  - Toast notifications
  - Confetti animations
  - Points floating animation
  - Success sounds

- **`main.js`** - Application initialization
  - Startup logic
  - Backward compatibility wrappers

### Supporting Modules

- **`generator.js`** - Question generation
- **`debug-mode.js`** - Debug mode functionality

## Load Order

The scripts must be loaded in this order (as specified in `algebra-helper.html`):

1. `debug-mode.js` - Debug utilities
2. `generator.js` - Question generation
3. `constants.js` - Configuration
4. `state.js` - State initialization
5. `ui.js` - UI functions
6. `drill.js` - Drill mode
7. `calibration.js` - Calibration mode
8. `gamification.js` - Gamification features
9. `main.js` - Initialization and setup

## Benefits of This Structure

1. **Reduced Merge Conflicts**: Each functional area is in its own file, so developers can work on different features without conflicts.

2. **Better Organization**: Related functions are grouped together, making the code easier to navigate and understand.

3. **Easier Testing**: Individual modules can be tested in isolation.

4. **Improved Maintainability**: Changes to one feature area don't require understanding or modifying unrelated code.

## Backward Compatibility

The `main.js` file includes wrapper functions on the `APP` object to maintain backward compatibility with existing code and tests. The HTML uses inline handlers like `onclick="APP.handleCalibration('pass')"` which continue to work through these wrappers.

## Development Workflow

When working on a specific feature:

1. Identify which module contains the relevant code
2. Make changes to that specific file
3. Test your changes
4. Commit the specific file(s) you modified

This modular approach reduces the chance of merge conflicts when multiple developers are working on different features simultaneously.
