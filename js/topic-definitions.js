// Topic Definitions - Maps levels to curriculum topics
// Based on IB Math HL AA curriculum coverage

window.TopicDefinitions = {
    // Map level bands to topic names
    getTopicForLevel: function(level) {
        const band = Math.round(level);
        
        // Internal-only category: Fixing Habits (not displayed in UI)
        if (band === FIXING_HABITS_CATEGORY) return "Fixing Habits";
        
        if (band <= 1) return "Basic Arithmetic";
        if (band <= 2) return "Powers and Roots";
        if (band <= 3) return "Multiplication and Division";
        if (band <= 4) return "Fractions";
        if (band <= 5) return "Decimals & Percentages";
        if (band <= 6) return "Simple Linear Equations";
        if (band <= 7) return "Two-Step Equations";
        if (band <= 8) return "Inequalities";
        if (band <= 9) return "Expanding Expressions";
        if (band <= 10) return "Factorising Quadratics";
        if (band <= 11) return "Quadratic Equations";
        if (band <= 12) return "Polynomials";
        if (band <= 13) return "Exponentials & Logarithms";
        if (band <= 14) return "Sequences & Series";
        if (band <= 15) return "Functions";
        if (band <= 16) return "Basic Trigonometry";
        if (band <= 17) return "Advanced Trigonometry";
        if (band <= 18) return "Vectors";
        if (band <= 19) return "Complex Numbers";
        if (band <= 20) return "Basic Differentiation";
        if (band <= 21) return "Advanced Calculus";
        if (band <= 22) return "Statistics";
        if (band <= 23) return "Basic Probability";
        if (band <= 24) return "Advanced Probability";
        if (band <= 25) return "Integration & Series";
        // Advanced HL Topics
        if (band <= 26) return "Proof by Induction";
        if (band <= 27) return "Proof by Contradiction";
        if (band <= 28) return "Matrix Algebra";
        if (band <= 29) return "3D Vectors";
        if (band <= 30) return "Complex Numbers (Polar)";
        return "Advanced Integration";
    },
    
    // Get all available topics (in order)
    getAllTopics: function() {
        return [
            "Basic Arithmetic",
            "Powers and Roots",
            "Multiplication and Division",
            "Fractions",
            "Decimals & Percentages",
            "Simple Linear Equations",
            "Two-Step Equations",
            "Inequalities",
            "Expanding Expressions",
            "Factorising Quadratics",
            "Quadratic Equations",
            "Polynomials",
            "Exponentials & Logarithms",
            "Sequences & Series",
            "Functions",
            "Basic Trigonometry",
            "Advanced Trigonometry",
            "Vectors",
            "Complex Numbers",
            "Basic Differentiation",
            "Advanced Calculus",
            "Statistics",
            "Basic Probability",
            "Advanced Probability",
            "Integration & Series",
            "Proof by Induction",
            "Proof by Contradiction",
            "Matrix Algebra",
            "3D Vectors",
            "Complex Numbers (Polar)",
            "Advanced Integration"
        ];
    }
};
