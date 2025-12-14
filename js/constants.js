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
