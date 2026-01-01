#!/usr/bin/env node
/**
 * Run Question Validator Script
 * 
 * This script performs the following tasks:
 * 1. Clears validation-output and validation-issues directories
 * 2. Runs the question validator for all question types (levels 1-34)
 * 3. Concatenates all issue reports into a single markdown file
 * 
 * Usage: node tools/run-validator.js
 *        npm run validate-and-combine
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const QuestionValidator = require('./question-validator');

class ValidatorRunner {
    constructor() {
        this.validationOutputDir = path.join(__dirname, '..', 'validation-output');
        this.validationIssuesDir = path.join(__dirname, '..', 'validation-issues');
    }

    /**
     * Clear directory contents (except .gitkeep files)
     */
    async clearDirectory(dirPath) {
        console.log(`🧹 Clearing directory: ${dirPath}`);
        
        // Check if directory exists
        if (!fsSync.existsSync(dirPath)) {
            console.log(`   Directory doesn't exist yet, will be created.`);
            return;
        }

        // Read directory contents
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            // Skip .gitkeep files
            if (entry.name === '.gitkeep') {
                continue;
            }

            if (entry.isDirectory()) {
                // Recursively clear subdirectory
                await this.clearDirectory(fullPath);
                // Remove the now-empty directory
                await fs.rmdir(fullPath);
            } else {
                // Remove file
                await fs.unlink(fullPath);
                console.log(`   Removed: ${entry.name}`);
            }
        }
    }

    /**
     * Clear validation output directories
     */
    async clearOutputDirectories() {
        console.log('\n📂 Clearing validation output directories...\n');
        
        // Clear validation-output directory (screenshots, responses, etc.)
        await this.clearDirectory(this.validationOutputDir);
        
        // Clear validation-issues directory
        await this.clearDirectory(this.validationIssuesDir);
        
        console.log('\n✅ Directories cleared successfully!\n');
    }

    /**
     * Run the question validator
     */
    async runValidator() {
        console.log('\n🚀 Running Question Validator...\n');
        console.log('=' .repeat(70));
        
        const validator = new QuestionValidator();
        await validator.run();
        
        console.log('\n✅ Validation completed!\n');
    }

    /**
     * Concatenate all issue files into a single markdown file
     */
    async concatenateIssues() {
        console.log('\n📄 Concatenating all issue reports...\n');
        
        // Check if issues directory exists
        if (!fsSync.existsSync(this.validationIssuesDir)) {
            console.log('   No issues directory found - no issues to concatenate.');
            return;
        }

        // Read all markdown files from validation-issues directory
        const files = await fs.readdir(this.validationIssuesDir);
        const markdownFiles = files.filter(f => f.endsWith('.md') && f.startsWith('issue-'));

        if (markdownFiles.length === 0) {
            console.log('   No issue files found to concatenate.');
            return;
        }

        console.log(`   Found ${markdownFiles.length} issue file(s) to concatenate.`);

        // Sort files by level number for organized output
        markdownFiles.sort((a, b) => {
            const levelA = parseInt(a.match(/level-(\d+)/)?.[1] || '0');
            const levelB = parseInt(b.match(/level-(\d+)/)?.[1] || '0');
            return levelA - levelB;
        });

        // Create combined markdown content
        const timestamp = new Date().toISOString();
        let combinedContent = `# All Question Validation Issues\n\n`;
        combinedContent += `**Generated:** ${timestamp}\n`;
        combinedContent += `**Total Issues:** ${markdownFiles.length}\n\n`;
        combinedContent += `---\n\n`;

        // Read and concatenate each issue file
        for (const filename of markdownFiles) {
            const filePath = path.join(this.validationIssuesDir, filename);
            const content = await fs.readFile(filePath, 'utf-8');
            
            combinedContent += content;
            combinedContent += `\n\n---\n\n`;
            
            console.log(`   Added: ${filename}`);
        }

        // Write combined file
        const combinedFilePath = path.join(this.validationIssuesDir, 'all-issues-combined.md');
        await fs.writeFile(combinedFilePath, combinedContent, 'utf-8');

        console.log(`\n✅ All issues concatenated into: ${path.basename(combinedFilePath)}`);
        console.log(`   Total file size: ${Math.round(combinedContent.length / 1024)} KB\n`);
    }

    /**
     * Main execution flow
     */
    async run() {
        try {
            console.log('\n' + '='.repeat(70));
            console.log('  QUESTION VALIDATOR - FULL RUN');
            console.log('='.repeat(70) + '\n');
            
            // Step 1: Clear directories
            await this.clearOutputDirectories();
            
            // Step 2: Run validator
            await this.runValidator();
            
            // Step 3: Concatenate issues
            await this.concatenateIssues();
            
            console.log('\n' + '='.repeat(70));
            console.log('  ✨ ALL TASKS COMPLETED SUCCESSFULLY!');
            console.log('='.repeat(70) + '\n');
            
        } catch (error) {
            console.error('\n❌ Error occurred:', error.message);
            console.error(error.stack);
            process.exit(1);
        }
    }
}

// Run if executed directly
if (require.main === module) {
    const runner = new ValidatorRunner();
    runner.run().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = ValidatorRunner;
