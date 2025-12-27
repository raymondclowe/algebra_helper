/**
 * Worksheet Generator - Front-end module for AI-powered worksheet generation
 * 
 * This module communicates with the Cloudflare Worker AI microservice to generate
 * personalized practice worksheets based on student performance and error patterns.
 * 
 * Integration points:
 * - Uses error tracking from fixing-habits-questions.js
 * - Retrieves student history from storage-manager.js
 * - Generates printable worksheets with positive framing
 */

window.WorksheetGenerator = {
  
  // Cloudflare Worker endpoint URL (update with your deployed worker URL)
  // IMPORTANT: Replace YOUR-SUBDOMAIN with your actual Cloudflare subdomain before production use
  API_ENDPOINT: 'https://algebra-helper-worksheet-generator.YOUR-SUBDOMAIN.workers.dev/api/worksheet/analyze',
  
  /**
   * Check if API endpoint is properly configured
   */
  isConfigured() {
    return !this.API_ENDPOINT.includes('YOUR-SUBDOMAIN');
  },
  
  /**
   * Collect student data for worksheet generation
   */
  collectStudentData() {
    // Get student name
    const studentName = window.APP.userName || 'Student';
    
    // Get error patterns from fixing habits tracker
    const errorPatterns = window.APP.errorTracker || {};
    
    // Get performance history from storage
    const performanceHistory = this.getPerformanceHistory();
    
    // Get current level
    const level = window.APP.level || 0;
    
    // Identify weakness areas based on error patterns
    const weaknessAreas = this.identifyWeaknessAreas(errorPatterns, performanceHistory);
    
    return {
      studentName,
      errorPatterns,
      performanceHistory,
      weaknessAreas,
      level,
      timestamp: new Date().toISOString()
    };
  },
  
  /**
   * Get performance history from storage
   */
  getPerformanceHistory() {
    try {
      // Get recent questions from APP history
      const history = window.APP.history || [];
      
      // Group by topic and calculate success rates
      const topicPerformance = {};
      
      history.forEach(entry => {
        if (entry.topic) {
          if (!topicPerformance[entry.topic]) {
            topicPerformance[entry.topic] = { correct: 0, total: 0 };
          }
          topicPerformance[entry.topic].total++;
          if (entry.correct) {
            topicPerformance[entry.topic].correct++;
          }
        }
      });
      
      // Convert to array format
      return Object.entries(topicPerformance).map(([topic, stats]) => ({
        topic,
        correct: stats.correct,
        total: stats.total,
        successRate: (stats.correct / stats.total * 100).toFixed(1)
      }));
    } catch (error) {
      console.error('Error retrieving performance history:', error);
      return [];
    }
  },
  
  /**
   * Identify weakness areas from error patterns and performance
   */
  identifyWeaknessAreas(errorPatterns, performanceHistory) {
    const weaknesses = [];
    
    // Add error pattern types with significant counts
    Object.entries(errorPatterns).forEach(([type, count]) => {
      if (count >= 3) {
        weaknesses.push(this.formatErrorTypeName(type));
      }
    });
    
    // Add topics with low success rates
    performanceHistory.forEach(({ topic, successRate }) => {
      if (parseFloat(successRate) < 60) {
        weaknesses.push(topic);
      }
    });
    
    return [...new Set(weaknesses)]; // Remove duplicates
  },
  
  /**
   * Format error type name for display
   */
  formatErrorTypeName(type) {
    const nameMap = {
      'squareRootSign': 'Square Root Signs (±)',
      'divisionByZero': 'Division by Zero Awareness',
      'negativeExponents': 'Negative Exponents',
      'fractionSimplification': 'Fraction Simplification'
    };
    return nameMap[type] || type;
  },
  
  /**
   * Generate worksheet by calling the AI microservice
   */
  async generateWorksheet() {
    try {
      // Check if API endpoint is configured
      if (!this.isConfigured()) {
        this.showError('API endpoint not configured. Please update the worker URL in worksheet-generator.js');
        return;
      }
      
      // Show loading indicator
      this.showLoadingIndicator();
      
      // Collect student data
      const studentData = this.collectStudentData();
      
      // Call the Cloudflare Worker AI microservice
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Invalid API response format');
      }
      
      // Hide loading indicator
      this.hideLoadingIndicator();
      
      // Render the worksheet
      this.renderWorksheet(result.data);
      
      return result.data;
    } catch (error) {
      console.error('Worksheet generation failed:', error);
      this.hideLoadingIndicator();
      this.showError(error.message);
      throw error;
    }
  },
  
  /**
   * Show loading indicator
   */
  showLoadingIndicator() {
    const modal = document.createElement('div');
    modal.id = 'worksheet-loading-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <h3 class="text-xl font-bold mb-2">Generating Your Personalized Worksheet</h3>
        <p class="text-gray-600">Our AI is analyzing your practice patterns...</p>
      </div>
    `;
    document.body.appendChild(modal);
  },
  
  /**
   * Hide loading indicator
   */
  hideLoadingIndicator() {
    const modal = document.getElementById('worksheet-loading-modal');
    if (modal) {
      modal.remove();
    }
  },
  
  /**
   * Show error message
   */
  showError(message) {
    // Create error modal instead of using alert()
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div class="flex items-center mb-4">
          <span class="text-3xl mr-3">⚠️</span>
          <h3 class="text-xl font-bold text-red-600">Worksheet Generation Error</h3>
        </div>
        <p class="text-gray-700 mb-6">${message}</p>
        <button onclick="this.closest('.fixed').remove()" 
                class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  },
  
  /**
   * Render the generated worksheet
   */
  renderWorksheet(worksheetData) {
    // Create worksheet modal
    const modal = document.createElement('div');
    modal.id = 'worksheet-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto';
    
    const content = this.buildWorksheetHTML(worksheetData);
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-4xl mx-4 my-8 shadow-xl">
        <div class="p-6">
          ${content}
        </div>
        <div class="bg-gray-100 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button onclick="WorksheetGenerator.printWorksheet()" 
                  class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Print Worksheet
          </button>
          <button onclick="WorksheetGenerator.closeWorksheet()" 
                  class="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  /**
   * Build HTML for worksheet content
   */
  buildWorksheetHTML(data) {
    const { worksheetTitle, headerMessage, targetHabits, exercises, rationale, studentName } = data;
    
    let html = `
      <div id="worksheet-content" class="print:p-8">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold mb-2">${worksheetTitle}</h1>
          <p class="text-lg text-gray-600">For: ${studentName}</p>
          <p class="text-sm text-gray-500">${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p class="text-gray-800 italic">${headerMessage}</p>
        </div>
        
        <div class="mb-6">
          <h2 class="text-2xl font-bold mb-3">🎯 Target Habits for Improvement</h2>
          ${targetHabits.map((habit, idx) => `
            <div class="mb-4 p-4 bg-yellow-50 rounded">
              <h3 class="font-bold text-lg mb-1">${idx + 1}. ${habit.habitName}</h3>
              <p class="text-gray-700 mb-2">${habit.description}</p>
              <p class="text-green-700 font-semibold">💡 Why this matters: ${habit.importance}</p>
              <p class="text-red-600 text-sm">⚠️ Points at risk: ${habit.examPointsAtRisk}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="mb-6">
          <h2 class="text-2xl font-bold mb-3">📝 Practice Exercises</h2>
          <p class="text-gray-600 mb-4">Complete these exercises to develop automatic correct responses:</p>
          ${exercises.map(exercise => `
            <div class="mb-6 p-4 border-2 border-gray-300 rounded">
              <div class="flex items-start mb-2">
                <span class="font-bold text-xl mr-3">${exercise.questionNumber}.</span>
                <div class="flex-1">
                  <div class="math-content mb-2">${exercise.question}</div>
                  ${exercise.hints && exercise.hints.length > 0 ? `
                    <div class="text-sm text-gray-600 ml-4">
                      <p class="font-semibold">Hints:</p>
                      <ul class="list-disc ml-5">
                        ${exercise.hints.map(hint => `<li>${hint}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>
              <div class="ml-8 mt-3 p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">
                  <strong>Key Reminder:</strong> ${exercise.keyReminder}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <h3 class="font-bold mb-2">📚 How These Exercises Help You</h3>
          <p class="text-gray-800">${rationale}</p>
        </div>
        
        <div class="text-center text-gray-500 text-sm border-t pt-4">
          <p>Generated by Algebra Helper AI Worksheet Generator</p>
          <p>Keep practicing to build strong mathematical habits! 🚀</p>
        </div>
      </div>
    `;
    
    return html;
  },
  
  /**
   * Print the worksheet
   */
  printWorksheet() {
    const content = document.getElementById('worksheet-content');
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Practice Worksheet</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
          .math-content { font-family: 'Times New Roman', serif; font-size: 1.1em; }
        </style>
      </head>
      <body class="p-8">
        ${content.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  },
  
  /**
   * Close the worksheet modal
   */
  closeWorksheet() {
    const modal = document.getElementById('worksheet-modal');
    if (modal) {
      modal.remove();
    }
  },
  
  /**
   * Add worksheet generation button to the UI
   */
  addWorksheetButton() {
    // Find stats modal or create a button in the main UI
    const statsButton = document.querySelector('[onclick*="showStatsModal"]');
    if (statsButton && statsButton.parentElement) {
      const container = statsButton.parentElement;
      
      // Check if button already exists
      if (document.getElementById('worksheet-generator-btn')) return;
      
      const button = document.createElement('button');
      button.id = 'worksheet-generator-btn';
      button.className = 'px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm ml-2';
      button.innerHTML = '📄 Generate Practice Worksheet';
      button.onclick = () => this.generateWorksheet();
      
      container.appendChild(button);
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.WorksheetGenerator.addWorksheetButton();
  });
} else {
  window.WorksheetGenerator.addWorksheetButton();
}
