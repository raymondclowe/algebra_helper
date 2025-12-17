// Gamification Constants
const AUTO_ADVANCE_DELAY_MS = 1500;     // Time before auto-advancing after correct answer
const CONFETTI_COUNT = 30;              // Number of confetti particles
const CONFETTI_DELAY_STEP_MS = 30;      // Delay between each confetti spawn
const SUCCESS_SOUND_FREQUENCY = 800;    // Hz for success beep
const SUCCESS_SOUND_VOLUME = 0.3;       // Volume (0-1)
const SUCCESS_SOUND_DURATION = 0.3;     // Seconds
const SUCCESS_SOUND_MIN_GAIN = 0.01;    // Minimum gain for exponential ramp
const FLOAT_ANIMATION_DELAY_MS = 50;    // Delay before starting float animation
const FLOAT_ANIMATION_DURATION_MS = 800; // Duration of float animation
const FLOAT_CLEANUP_DELAY_MS = 900;     // When to remove float element

// Stats Tracking Constants
const STATS_SAVE_INTERVAL_MS = 10000;   // How often to save active time to localStorage (10 seconds)
const DAILY_SAVE_INTERVAL_MS = 60000;   // How often to save daily time tracking (60 seconds)

// Response Speed Thresholds (seconds)
// Note: Thresholds adjusted to reduce speed pressure and encourage thoughtful problem-solving
// Research shows deeper learning occurs when students have time to reflect (Schraw & Dennison, 1994)
const FAST_ANSWER_THRESHOLD = 8;        // Answers under this are considered "fast" (increased from 5)
const SLOW_ANSWER_THRESHOLD = 20;       // Answers over this are considered "slow" (increased from 10)

// Level Adjustment Deltas
const BASE_LEVEL_DELTA = 0.2;           // Base level increase for correct answer
const TURBO_LEVEL_DELTA = 0.4;          // Level increase when in turbo mode (reduced from 0.5 to reduce speed pressure)

// Calibration Constants
const MAX_LEVEL = 24;                    // Maximum supported level in the app
const MIN_LEVEL = 1;                     // Minimum level in the app

// Display Mode Configuration
// Controls how progress metrics are shown to students
// Based on educational research showing mastery-oriented displays promote learning goals
// over performance goals and reduce anxiety (Dweck, 1986; Ames, 1992)
const DISPLAY_MODES = {
    MASTERY: 'mastery',    // Default: Show skill area and encouraging messages (recommended for students)
    GROWTH: 'growth',      // Show level bands and trends without exact numbers
    FULL: 'full'          // Show all metrics with educational context (for advanced users)
};

// Default display mode - can be changed in settings or based on user role
const DEFAULT_DISPLAY_MODE = DISPLAY_MODES.MASTERY;

// Fixing Habits Category Constants
// Internal-only category for addressing recurring student mistakes
// Not displayed in the regular syllabus interface
const FIXING_HABITS_CATEGORY = 0;        // Category code for internal use
const FIXING_HABITS_INSERTION_RATE = 0.15; // 15% chance of inserting a fixing habits question when relevant errors detected
const FIXING_HABITS_MIN_ERRORS = 2;      // Minimum error count before triggering habit fixing questions

// Break Splash Screen Constants
const BREAK_SPLASH_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes - minimum time between break splash screens
