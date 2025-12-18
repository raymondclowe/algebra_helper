// Gamification Constants
const AUTO_ADVANCE_DELAY_MS = 1500;     // Time before auto-advancing after correct answer
const CONFETTI_COUNT = 30;              // Number of confetti particles
const CONFETTI_DELAY_STEP_MS = 30;      // Delay between each confetti spawn
// Success Sound Constants - Research-backed audio design for learning motivation
// Based on educational feedback research and game audio design principles
const SUCCESS_SOUND_BASE_FREQUENCY = 880;  // Hz - A5 note, pleasant and clear
const SUCCESS_SOUND_INTERVAL_RATIO = 1.2599; // Major third interval (equal temperament: 2^(4/12))
const SUCCESS_SOUND_VOLUME = 0.25;         // Volume (0-1) - moderate, not harsh
const SUCCESS_SOUND_DURATION = 0.35;       // Seconds - optimal 300-400ms range
const SUCCESS_SOUND_ATTACK = 0.01;         // 10ms attack - fast but not clicky
const SUCCESS_SOUND_DECAY = 0.20;          // 200ms decay
const SUCCESS_SOUND_SUSTAIN = 0.05;        // Very low sustain level
const SUCCESS_SOUND_RELEASE = 0.12;        // 120ms release
const SUCCESS_SOUND_DETUNE_AMOUNT = 3;     // Cents - slight detuning for richness
const SUCCESS_SOUND_PITCH_VARIATION = 2;   // Semitones - random variation range (±2)
const SUCCESS_SOUND_TIMING_VARIATION = 0.015; // Seconds - ±15ms timing variation
const SUCCESS_SOUND_ARPEGGIO_DELAY = 0.08; // Seconds - 80ms delay between notes for arpeggio effect
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
const BREAK_SESSION_MIN_MINUTES = 25;      // Minimum session length (minutes) before checking for break
const BREAK_SCORE_THRESHOLD = 40;          // Score percentage below which break is suggested
const BREAK_CHECK_RECENT_QUESTIONS = 15;   // Number of recent questions to check for performance trend
const BREAK_CHECK_MIN_QUESTIONS = 10;      // Minimum questions needed before checking break conditions
const BREAK_CHECK_RAPID_WINDOW = 5;        // Window of questions to check for rapid failures
const BREAK_RAPID_CORRECT_THRESHOLD = 1;   // Maximum correct answers in rapid window before suggesting break
// Personalization Constants
const PERSONALIZATION_PROBABILITY_SLOW = 0.4;  // 40% chance to use student name in slow answer feedback
const PERSONALIZATION_PROBABILITY_FAST = 0.3;  // 30% chance to use student name in fast answer feedback
const INPUT_FOCUS_DELAY_MS = 100;             // Delay before focusing input field in modals
