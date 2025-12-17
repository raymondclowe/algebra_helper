#!/usr/bin/env python3
"""
Algebra Helper Data Analytics Tool

This Python script analyzes exported JSON data from Algebra Helper to provide
insights into student learning patterns and mistakes.

Usage:
    python analyze_algebra_data.py <path_to_json_file>

Features:
- Filter data by time range
- Generate mistakes report
- Detect learning patterns (error rates, rushing, specific concept errors)
- Provide constructive feedback in "even better if" format

Requirements:
    pip install python-dateutil

Example:
    python analyze_algebra_data.py algebra-helper-data-2024-12-17.json
"""

import json
import sys
from datetime import datetime, timedelta
from collections import defaultdict
from dateutil import parser as date_parser


class AlgebraDataAnalyzer:
    def __init__(self, json_file_path):
        """Load and parse the exported JSON data."""
        with open(json_file_path, 'r') as f:
            self.data = json.load(f)
        
        self.questions = self.data.get('questions', [])
        self.stats = self.data.get('stats', {})
        
        print(f"Loaded {len(self.questions)} question records")
        print(f"Export date: {self.data.get('exportDate', 'unknown')}")
        print()
    
    def filter_by_date_range(self, days_back=None, start_date=None, end_date=None):
        """
        Filter questions by date range.
        
        Args:
            days_back: Only include questions from last N days
            start_date: Start date (ISO format or datetime object)
            end_date: End date (ISO format or datetime object)
        
        Returns:
            Filtered list of questions
        """
        if days_back is not None:
            cutoff = datetime.now() - timedelta(days=days_back)
            return [q for q in self.questions if datetime.fromtimestamp(q['datetime'] / 1000) >= cutoff]
        
        filtered = self.questions
        
        if start_date:
            if isinstance(start_date, str):
                start_date = date_parser.parse(start_date)
            filtered = [q for q in filtered if datetime.fromtimestamp(q['datetime'] / 1000) >= start_date]
        
        if end_date:
            if isinstance(end_date, str):
                end_date = date_parser.parse(end_date)
            filtered = [q for q in filtered if datetime.fromtimestamp(q['datetime'] / 1000) <= end_date]
        
        return filtered
    
    def generate_mistakes_report(self, questions=None, max_mistakes=20):
        """
        Generate a detailed mistakes report.
        
        Returns:
            List of dictionaries with mistake details
        """
        if questions is None:
            questions = self.questions
        
        mistakes = []
        for q in questions:
            if not q.get('isCorrect', True) and not q.get('isDontKnow', False):
                mistakes.append({
                    'date': datetime.fromtimestamp(q['datetime'] / 1000).strftime('%Y-%m-%d %H:%M'),
                    'topic': q.get('topic', 'Unknown'),
                    'question': q.get('question', ''),
                    'correct_answer': q.get('correctAnswer', ''),
                    'chosen_answer': q.get('chosenAnswer', 'unknown'),
                    'time_spent': q.get('timeSpent', 0),
                    'advice': q.get('advice', '')
                })
        
        # Sort by date (most recent first)
        mistakes.sort(key=lambda x: x['date'], reverse=True)
        
        return mistakes[:max_mistakes]
    
    def analyze_time_vs_accuracy(self, questions=None):
        """
        Analyze correlation between time spent and accuracy.
        
        Returns:
            Dictionary with analysis results
        """
        if questions is None:
            questions = self.questions
        
        # Filter out "I don't know" responses
        answered = [q for q in questions if not q.get('isDontKnow', False)]
        
        if not answered:
            return {'error': 'No answered questions to analyze'}
        
        # Group by time spent buckets
        time_buckets = {
            'very_fast': [],  # < 10 seconds
            'fast': [],        # 10-30 seconds
            'normal': [],      # 30-60 seconds
            'slow': []         # > 60 seconds
        }
        
        for q in answered:
            time_spent = q.get('timeSpent', 0)
            if time_spent < 10:
                bucket = 'very_fast'
            elif time_spent < 30:
                bucket = 'fast'
            elif time_spent < 60:
                bucket = 'normal'
            else:
                bucket = 'slow'
            
            time_buckets[bucket].append(q)
        
        # Calculate accuracy for each bucket
        results = {}
        for bucket_name, bucket_questions in time_buckets.items():
            if bucket_questions:
                correct = sum(1 for q in bucket_questions if q.get('isCorrect', False))
                total = len(bucket_questions)
                accuracy = correct / total if total > 0 else 0
                results[bucket_name] = {
                    'count': total,
                    'correct': correct,
                    'accuracy': accuracy
                }
        
        return results
    
    def analyze_topic_performance(self, questions=None):
        """
        Analyze performance by topic.
        
        Returns:
            Dictionary with topic statistics
        """
        if questions is None:
            questions = self.questions
        
        topic_stats = defaultdict(lambda: {'correct': 0, 'incorrect': 0, 'dont_know': 0, 'total_time': 0})
        
        for q in questions:
            topic = q.get('topic', 'Unknown')
            topic_stats[topic]['total_time'] += q.get('timeSpent', 0)
            
            if q.get('isDontKnow', False):
                topic_stats[topic]['dont_know'] += 1
            elif q.get('isCorrect', False):
                topic_stats[topic]['correct'] += 1
            else:
                topic_stats[topic]['incorrect'] += 1
        
        # Calculate percentages and average times
        results = {}
        for topic, stats in topic_stats.items():
            total = stats['correct'] + stats['incorrect']
            accuracy = stats['correct'] / total if total > 0 else 0
            avg_time = stats['total_time'] / (total + stats['dont_know']) if (total + stats['dont_know']) > 0 else 0
            
            results[topic] = {
                'correct': stats['correct'],
                'incorrect': stats['incorrect'],
                'dont_know': stats['dont_know'],
                'total_questions': total + stats['dont_know'],
                'accuracy': accuracy,
                'avg_time_seconds': round(avg_time, 1)
            }
        
        # Sort by total questions (most practiced first)
        results = dict(sorted(results.items(), key=lambda x: x[1]['total_questions'], reverse=True))
        
        return results
    
    def detect_patterns(self, questions=None):
        """
        Detect learning patterns and provide constructive feedback.
        
        Returns:
            List of insight strings in "even better if" format
        """
        if questions is None:
            questions = self.questions
        
        insights = []
        
        # Analyze time vs accuracy
        time_analysis = self.analyze_time_vs_accuracy(questions)
        if 'very_fast' in time_analysis and 'normal' in time_analysis:
            very_fast = time_analysis['very_fast']
            normal = time_analysis['normal']
            if very_fast['count'] >= 5 and normal['count'] >= 5:
                if very_fast['accuracy'] < normal['accuracy'] - 0.2:  # 20% difference
                    insights.append(
                        f"💡 Student would benefit from taking more time on questions. "
                        f"Questions answered in under 10 seconds show {very_fast['accuracy']:.0%} accuracy, "
                        f"while those taking 30-60 seconds show {normal['accuracy']:.0%} accuracy."
                    )
        
        # Analyze topic-specific weaknesses
        topic_performance = self.analyze_topic_performance(questions)
        for topic, stats in topic_performance.items():
            if stats['total_questions'] >= 5:  # Only consider topics with enough data
                if stats['accuracy'] < 0.6:  # Less than 60% accuracy
                    insights.append(
                        f"📚 Student would benefit from additional practice in {topic}. "
                        f"Current accuracy: {stats['accuracy']:.0%} ({stats['correct']}/{stats['correct'] + stats['incorrect']} questions)"
                    )
                
                # Check for excessive "I don't know" usage
                if stats['dont_know'] / stats['total_questions'] > 0.3:  # More than 30%
                    insights.append(
                        f"🤔 Student might need more foundational work in {topic}. "
                        f"{stats['dont_know']} out of {stats['total_questions']} questions were skipped with 'I don't know'."
                    )
        
        # Analyze recent trend
        recent_questions = self.filter_by_date_range(days_back=7)
        if len(recent_questions) >= 10:
            recent_correct = sum(1 for q in recent_questions if q.get('isCorrect', False) and not q.get('isDontKnow', False))
            recent_answered = sum(1 for q in recent_questions if not q.get('isDontKnow', False))
            if recent_answered > 0:
                recent_accuracy = recent_correct / recent_answered
                
                # Compare to overall accuracy
                overall_correct = sum(1 for q in questions if q.get('isCorrect', False) and not q.get('isDontKnow', False))
                overall_answered = sum(1 for q in questions if not q.get('isDontKnow', False))
                overall_accuracy = overall_correct / overall_answered if overall_answered > 0 else 0
                
                if recent_accuracy > overall_accuracy + 0.1:  # 10% improvement
                    insights.append(
                        f"🌟 Great progress! Recent performance ({recent_accuracy:.0%}) shows improvement "
                        f"compared to overall average ({overall_accuracy:.0%})."
                    )
                elif recent_accuracy < overall_accuracy - 0.1:  # 10% decline
                    insights.append(
                        f"📉 Recent performance ({recent_accuracy:.0%}) has declined from overall average "
                        f"({overall_accuracy:.0%}). Student might benefit from reviewing fundamentals or taking a break."
                    )
        
        # Check for concept-specific patterns (looking at mistakes)
        mistakes = self.generate_mistakes_report(questions)
        if mistakes:
            # Look for patterns in advice/explanations
            negative_root_mentions = sum(1 for m in mistakes if 'negative' in m['advice'].lower() and ('root' in m['advice'].lower() or 'square' in m['advice'].lower()))
            if negative_root_mentions >= 3:
                insights.append(
                    "📐 Student would benefit from a reminder that square roots can have both positive and negative solutions. "
                    "This appears in multiple incorrect answers."
                )
            
            inverse_mentions = sum(1 for m in mistakes if 'inverse' in m['advice'].lower())
            if inverse_mentions >= 3:
                insights.append(
                    "🔄 Student needs more practice with inverse functions. "
                    "This concept appears in multiple incorrect answers."
                )
        
        return insights
    
    def generate_full_report(self, days_back=None):
        """
        Generate a comprehensive analysis report.
        
        Args:
            days_back: Only analyze questions from last N days (None for all)
        """
        questions = self.filter_by_date_range(days_back=days_back) if days_back else self.questions
        
        print("=" * 80)
        print("ALGEBRA HELPER - STUDENT ANALYTICS REPORT")
        print("=" * 80)
        print()
        
        if days_back:
            print(f"Analysis period: Last {days_back} days")
        else:
            print("Analysis period: All time")
        print(f"Total questions analyzed: {len(questions)}")
        print()
        
        # Overall statistics
        print("-" * 80)
        print("OVERALL PERFORMANCE")
        print("-" * 80)
        answered = [q for q in questions if not q.get('isDontKnow', False)]
        if answered:
            correct = sum(1 for q in answered if q.get('isCorrect', False))
            accuracy = correct / len(answered) if answered else 0
            print(f"Questions answered: {len(answered)}")
            print(f"Correct: {correct} ({accuracy:.1%})")
            print(f"Incorrect: {len(answered) - correct}")
        
        dont_know_count = sum(1 for q in questions if q.get('isDontKnow', False))
        if dont_know_count:
            print(f"Skipped (I don't know): {dont_know_count}")
        print()
        
        # Topic performance
        print("-" * 80)
        print("PERFORMANCE BY TOPIC")
        print("-" * 80)
        topic_stats = self.analyze_topic_performance(questions)
        for topic, stats in topic_stats.items():
            print(f"\n{topic}:")
            print(f"  Questions: {stats['total_questions']}")
            print(f"  Accuracy: {stats['accuracy']:.1%} ({stats['correct']}/{stats['correct'] + stats['incorrect']})")
            print(f"  Average time: {stats['avg_time_seconds']} seconds")
            if stats['dont_know'] > 0:
                print(f"  Skipped: {stats['dont_know']}")
        print()
        
        # Time vs Accuracy analysis
        print("-" * 80)
        print("TIME SPENT vs ACCURACY")
        print("-" * 80)
        time_analysis = self.analyze_time_vs_accuracy(questions)
        time_labels = {
            'very_fast': '< 10 seconds',
            'fast': '10-30 seconds',
            'normal': '30-60 seconds',
            'slow': '> 60 seconds'
        }
        for bucket, label in time_labels.items():
            if bucket in time_analysis:
                stats = time_analysis[bucket]
                print(f"{label}: {stats['accuracy']:.1%} accuracy ({stats['correct']}/{stats['count']} questions)")
        print()
        
        # Mistakes report
        print("-" * 80)
        print("RECENT MISTAKES (up to 10)")
        print("-" * 80)
        mistakes = self.generate_mistakes_report(questions, max_mistakes=10)
        for i, mistake in enumerate(mistakes, 1):
            print(f"\n{i}. {mistake['date']} - {mistake['topic']}")
            print(f"   Question: {mistake['question'][:80]}...")
            print(f"   Correct answer: {mistake['correct_answer']}")
            print(f"   Student answered: {mistake['chosen_answer']}")
            print(f"   Time spent: {mistake['time_spent']} seconds")
        print()
        
        # Learning insights
        print("-" * 80)
        print("LEARNING INSIGHTS & RECOMMENDATIONS")
        print("-" * 80)
        insights = self.detect_patterns(questions)
        if insights:
            for insight in insights:
                print(f"\n{insight}")
        else:
            print("\nNo specific patterns detected. Keep up the good work!")
        print()
        
        print("=" * 80)


def main():
    if len(sys.argv) < 2:
        print("Usage: python analyze_algebra_data.py <path_to_json_file>")
        print("\nOptional: Specify days to analyze")
        print("Example: python analyze_algebra_data.py data.json 7")
        sys.exit(1)
    
    json_file = sys.argv[1]
    days_back = int(sys.argv[2]) if len(sys.argv) > 2 else None
    
    try:
        analyzer = AlgebraDataAnalyzer(json_file)
        analyzer.generate_full_report(days_back=days_back)
    except FileNotFoundError:
        print(f"Error: File '{json_file}' not found")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: File '{json_file}' is not valid JSON")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()
