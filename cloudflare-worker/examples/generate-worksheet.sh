# Example: Generate Worksheet

curl -X POST http://localhost:8787/api/worksheet/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Sarah",
    "errorPatterns": {
      "squareRootSign": 5,
      "divisionByZero": 3,
      "negativeExponents": 2
    },
    "performanceHistory": [
      {
        "topic": "Quadratic Equations",
        "correct": 7,
        "total": 10,
        "successRate": "70.0"
      },
      {
        "topic": "Exponentials & Logarithms",
        "correct": 4,
        "total": 8,
        "successRate": "50.0"
      },
      {
        "topic": "Factorising Quadratics",
        "correct": 9,
        "total": 10,
        "successRate": "90.0"
      }
    ],
    "weaknessAreas": [
      "Square Root Signs (±)",
      "Division by Zero Awareness",
      "Exponentials & Logarithms"
    ],
    "level": 10.5,
    "timestamp": "2024-12-24T01:00:00.000Z"
  }'

# Expected response:
# {
#   "success": true,
#   "data": {
#     "worksheetTitle": "Habit Improvement Practice - Critical Math Habits",
#     "headerMessage": "This is to help you gain more IB exam points...",
#     "targetHabits": [...],
#     "exercises": [...],
#     "rationale": "...",
#     "generatedAt": "2024-12-24T01:30:00.000Z",
#     "studentName": "Sarah",
#     "currentLevel": 10.5
#   }
# }
