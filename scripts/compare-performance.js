const fs = require('fs').promises;
const path = require('path');

class PerformanceComparator {
    constructor() {
        this.resultsDir = path.join(__dirname, '..', 'results');
        this.baselineThreshold = 0.05; // 5% performance regression threshold
        this.comparison = {
            timestamp: new Date().toISOString(),
            baseline: null,
            current: null,
            differences: {},
            regressions: [],
            improvements: [],
            summary: {}
        };
    }

    async loadBaseline() {
        // Try to load baseline from main branch results or previous runs
        const possibleBaselines = [
            'baseline-results.json',
            'consolidated-results.json',
            'latest.json'
        ];

        for (const filename of possibleBaselines) {
            try {
                const filepath = path.join(this.resultsDir, filename);
                const content = await fs.readFile(filepath, 'utf8');
                this.comparison.baseline = JSON.parse(content);
                console.log(`✓ Loaded baseline from: ${filename}`);
                return true;
            } catch (error) {
                // Continue to next file
            }
        }

        console.log('⚠️  No baseline found, using current results as baseline');
        return false;
    }

    async loadCurrentResults() {
        try {
            // Load the most recent consolidated results
            const filepath = path.join(this.resultsDir, 'consolidated-results.json');
            const content = await fs.readFile(filepath, 'utf8');
            this.comparison.current = JSON.parse(content);
            console.log('✓ Loaded current results');
            return true;
        } catch (error) {
            console.error('❌ Failed to load current results:', error.message);
            return false;
        }
    }

    compareResults() {
        if (!this.comparison.baseline || !this.comparison.current) {
            console.log('❌ Cannot compare without both baseline and current results');
            return;
        }

        console.log('🔍 Comparing performance results...');

        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];

        for (const operation of operations) {
            this.comparison.differences[operation] = {};

            for (const size of sizes) {
                this.comparison.differences[operation][size] = {};

                const baselineData = this.comparison.baseline.summary?.[operation]?.[size] || {};
                const currentData = this.comparison.current.summary?.[operation]?.[size] || {};

                // Get all libraries present in either baseline or current
                const allLibraries = new Set([
                    ...Object.keys(baselineData),
                    ...Object.keys(currentData)
                ]);

                for (const library of allLibraries) {
                    const baseline = baselineData[library];
                    const current = currentData[library];

                    let comparison = { status: 'unknown' };

                    if (baseline && current) {
                        // Both exist - compare performance
                        const baselineTime = baseline.avgAcrossVersions;
                        const currentTime = current.avgAcrossVersions;
                        const timeDiff = currentTime - baselineTime;
                        const percentChange = (timeDiff / baselineTime) * 100;

                        comparison = {
                            status: 'compared',
                            baseline: {
                                time: baselineTime,
                                memory: baseline.memoryAvg,
                                versions: baseline.versionsCount
                            },
                            current: {
                                time: currentTime,
                                memory: current.memoryAvg,
                                versions: current.versionsCount
                            },
                            difference: {
                                time: timeDiff,
                                timePercent: percentChange,
                                memory: current.memoryAvg - baseline.memoryAvg,
                                memoryPercent: ((current.memoryAvg - baseline.memoryAvg) / baseline.memoryAvg) * 100
                            }
                        };

                        // Check for significant regressions or improvements
                        if (Math.abs(percentChange) > this.baselineThreshold * 100) {
                            const entry = {
                                library,
                                operation,
                                size,
                                change: percentChange,
                                baselineTime,
                                currentTime,
                                difference: timeDiff
                            };

                            if (percentChange > 0) {
                                this.comparison.regressions.push(entry);
                            } else {
                                this.comparison.improvements.push(entry);
                            }
                        }

                    } else if (baseline && !current) {
                        comparison = {
                            status: 'removed',
                            baseline: {
                                time: baseline.avgAcrossVersions,
                                memory: baseline.memoryAvg
                            }
                        };
                    } else if (!baseline && current) {
                        comparison = {
                            status: 'added',
                            current: {
                                time: current.avgAcrossVersions,
                                memory: current.memoryAvg
                            }
                        };
                    }

                    this.comparison.differences[operation][size][library] = comparison;
                }
            }
        }

        // Sort regressions and improvements by impact
        this.comparison.regressions.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
        this.comparison.improvements.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

        this.generateSummary();
    }

    generateSummary() {
        const totalLibrariesTested = new Set();
        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];

        // Count unique libraries
        for (const operation of operations) {
            for (const size of sizes) {
                const libs = this.comparison.differences[operation]?.[size] || {};
                Object.keys(libs).forEach(lib => totalLibrariesTested.add(lib));
            }
        }

        this.comparison.summary = {
            totalLibraries: totalLibrariesTested.size,
            regressions: this.comparison.regressions.length,
            improvements: this.comparison.improvements.length,
            unchanged: totalLibrariesTested.size - this.comparison.regressions.length - this.comparison.improvements.length,
            hasSignificantChanges: this.comparison.regressions.length > 0 || this.comparison.improvements.length > 0
        };

        console.log(`📊 Comparison summary:`);
        console.log(`  - Total libraries: ${this.comparison.summary.totalLibraries}`);
        console.log(`  - Regressions: ${this.comparison.summary.regressions}`);
        console.log(`  - Improvements: ${this.comparison.summary.improvements}`);
        console.log(`  - Unchanged: ${this.comparison.summary.unchanged}`);
    }

    async generateMarkdownReport() {
        let markdown = `# 📊 Performance Comparison Report\n\n`;
        markdown += `**Generated:** ${this.comparison.timestamp}\n\n`;

        if (!this.comparison.baseline) {
            markdown += `⚠️ **No baseline available** - This is the first run or baseline data is missing.\n\n`;
            return markdown;
        }

        // Summary
        markdown += `## 📈 Summary\n\n`;
        markdown += `- **Total libraries tested:** ${this.comparison.summary.totalLibraries}\n`;
        markdown += `- **Performance regressions:** ${this.comparison.summary.regressions} 📉\n`;
        markdown += `- **Performance improvements:** ${this.comparison.summary.improvements} 📈\n`;
        markdown += `- **Unchanged:** ${this.comparison.summary.unchanged} ➡️\n\n`;

        if (!this.comparison.summary.hasSignificantChanges) {
            markdown += `✅ **No significant performance changes detected** (threshold: ${this.baselineThreshold * 100}%)\n\n`;
        }

        // Regressions
        if (this.comparison.regressions.length > 0) {
            markdown += `## 🚨 Performance Regressions\n\n`;
            markdown += `The following libraries show performance regressions > ${this.baselineThreshold * 100}%:\n\n`;
            markdown += `| Library | Operation | Size | Change | Baseline | Current | Difference |\n`;
            markdown += `|---------|-----------|------|--------|----------|---------|------------|\n`;

            for (const regression of this.comparison.regressions) {
                const changeStr = `+${regression.change.toFixed(1)}%`;
                const diffStr = `+${regression.difference.toFixed(2)}ms`;
                markdown += `| **${regression.library}** | ${regression.operation} | ${regression.size} | ${changeStr} 📉 | ${regression.baselineTime.toFixed(2)}ms | ${regression.currentTime.toFixed(2)}ms | ${diffStr} |\n`;
            }
            markdown += `\n`;
        }

        // Improvements
        if (this.comparison.improvements.length > 0) {
            markdown += `## 🎉 Performance Improvements\n\n`;
            markdown += `The following libraries show performance improvements > ${this.baselineThreshold * 100}%:\n\n`;
            markdown += `| Library | Operation | Size | Change | Baseline | Current | Difference |\n`;
            markdown += `|---------|-----------|------|--------|----------|---------|------------|\n`;

            for (const improvement of this.comparison.improvements) {
                const changeStr = `${improvement.change.toFixed(1)}%`;
                const diffStr = `${improvement.difference.toFixed(2)}ms`;
                markdown += `| **${improvement.library}** | ${improvement.operation} | ${improvement.size} | ${changeStr} 📈 | ${improvement.baselineTime.toFixed(2)}ms | ${improvement.currentTime.toFixed(2)}ms | ${diffStr} |\n`;
            }
            markdown += `\n`;
        }

        // Detailed comparison table (for smaller changes)
        markdown += `## 📋 Detailed Comparison\n\n`;
        markdown += `<details>\n<summary>Click to expand detailed comparison</summary>\n\n`;

        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];

        for (const operation of operations) {
            markdown += `### ${operation.charAt(0).toUpperCase() + operation.slice(1)} Operation\n\n`;

            for (const size of sizes) {
                const comparisons = this.comparison.differences[operation]?.[size] || {};
                
                if (Object.keys(comparisons).length === 0) continue;

                markdown += `#### ${size.charAt(0).toUpperCase() + size.slice(1)} Files\n\n`;
                markdown += `| Library | Status | Baseline | Current | Change |\n`;
                markdown += `|---------|--------|----------|---------|--------|\n`;

                for (const [library, comp] of Object.entries(comparisons)) {
                    let statusEmoji = '';
                    let changeStr = '';

                    switch (comp.status) {
                        case 'compared':
                            const change = comp.difference.timePercent;
                            if (Math.abs(change) < this.baselineThreshold * 100) {
                                statusEmoji = '➡️';
                                changeStr = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
                            } else if (change > 0) {
                                statusEmoji = '📉';
                                changeStr = `+${change.toFixed(1)}%`;
                            } else {
                                statusEmoji = '📈';
                                changeStr = `${change.toFixed(1)}%`;
                            }
                            markdown += `| ${library} | ${statusEmoji} | ${comp.baseline.time.toFixed(2)}ms | ${comp.current.time.toFixed(2)}ms | ${changeStr} |\n`;
                            break;
                        case 'added':
                            markdown += `| ${library} | ✨ New | - | ${comp.current.time.toFixed(2)}ms | New library |\n`;
                            break;
                        case 'removed':
                            markdown += `| ${library} | ❌ Removed | ${comp.baseline.time.toFixed(2)}ms | - | Library removed |\n`;
                            break;
                    }
                }
                markdown += `\n`;
            }
        }

        markdown += `</details>\n\n`;

        // Recommendations
        if (this.comparison.regressions.length > 0) {
            markdown += `## 💡 Recommendations\n\n`;
            markdown += `Based on the performance analysis:\n\n`;

            if (this.comparison.regressions.length > 0) {
                markdown += `- **Review recent changes** that might have caused performance regressions\n`;
                markdown += `- **Consider alternative libraries** for use cases where regressions are significant\n`;
            }

            if (this.comparison.improvements.length > 0) {
                markdown += `- **Great job!** Some libraries show performance improvements\n`;
            }

            markdown += `- **Monitor trends** over time to catch gradual performance degradation\n\n`;
        }

        markdown += `---\n\n`;
        markdown += `*Comparison threshold: ${this.baselineThreshold * 100}% | Generated by [nodejs-zip-benchmark](https://github.com/your-repo/nodejs-zip-benchmark)*\n`;

        return markdown;
    }

    async generatePRComment() {
        if (!this.comparison.baseline) {
            return `## 📊 Benchmark Results\n\n✨ **First benchmark run completed!** No baseline available for comparison.\n\nResults will be available for future comparisons.`;
        }

        let comment = `## 📊 Performance Comparison Results\n\n`;

        if (!this.comparison.summary.hasSignificantChanges) {
            comment += `✅ **No significant performance changes detected** (threshold: ${this.baselineThreshold * 100}%)\n\n`;
        } else {
            if (this.comparison.regressions.length > 0) {
                comment += `🚨 **${this.comparison.regressions.length} performance regression(s) detected:**\n\n`;
                
                // Show top 3 regressions
                const topRegressions = this.comparison.regressions.slice(0, 3);
                for (const reg of topRegressions) {
                    comment += `- **${reg.library}** (${reg.operation}/${reg.size}): +${reg.change.toFixed(1)}% slower\n`;
                }
                
                if (this.comparison.regressions.length > 3) {
                    comment += `- ... and ${this.comparison.regressions.length - 3} more\n`;
                }
                comment += `\n`;
            }

            if (this.comparison.improvements.length > 0) {
                comment += `🎉 **${this.comparison.improvements.length} performance improvement(s) detected:**\n\n`;
                
                // Show top 3 improvements
                const topImprovements = this.comparison.improvements.slice(0, 3);
                for (const imp of topImprovements) {
                    comment += `- **${imp.library}** (${imp.operation}/${imp.size}): ${Math.abs(imp.change).toFixed(1)}% faster\n`;
                }
                
                if (this.comparison.improvements.length > 3) {
                    comment += `- ... and ${this.comparison.improvements.length - 3} more\n`;
                }
                comment += `\n`;
            }
        }

        comment += `📈 **Summary:** ${this.comparison.summary.totalLibraries} libraries tested, `;
        comment += `${this.comparison.summary.regressions} regressions, `;
        comment += `${this.comparison.summary.improvements} improvements\n\n`;
        comment += `[📋 View detailed comparison](results/performance-comparison.md)`;

        return comment;
    }

    async saveResults() {
        // Save detailed comparison
        const jsonPath = path.join(this.resultsDir, 'performance-comparison.json');
        await fs.writeFile(jsonPath, JSON.stringify(this.comparison, null, 2));
        console.log(`✓ Saved comparison results: ${jsonPath}`);

        // Generate and save markdown report
        const markdown = await this.generateMarkdownReport();
        const markdownPath = path.join(this.resultsDir, 'performance-comparison.md');
        await fs.writeFile(markdownPath, markdown);
        console.log(`✓ Saved comparison report: ${markdownPath}`);

        // Generate PR comment
        const prComment = await this.generatePRComment();
        const prCommentPath = path.join(this.resultsDir, 'pr-comment.md');
        await fs.writeFile(prCommentPath, prComment);
        console.log(`✓ Saved PR comment: ${prCommentPath}`);
    }

    async run() {
        try {
            console.log('🔍 Starting performance comparison...\n');

            const hasBaseline = await this.loadBaseline();
            const hasCurrent = await this.loadCurrentResults();

            if (!hasCurrent) {
                console.error('❌ Cannot proceed without current results');
                process.exit(1);
            }

            if (hasBaseline) {
                this.compareResults();
            } else {
                // First run - save current as baseline for future comparisons
                const baselinePath = path.join(this.resultsDir, 'baseline-results.json');
                await fs.writeFile(baselinePath, JSON.stringify(this.comparison.current, null, 2));
                console.log(`✓ Saved baseline for future comparisons: ${baselinePath}`);
            }

            await this.saveResults();

            console.log('\n✅ Performance comparison completed successfully!');

        } catch (error) {
            console.error('❌ Performance comparison failed:', error);
            process.exit(1);
        }
    }
}

// Run performance comparator if this file is executed directly
if (require.main === module) {
    const comparator = new PerformanceComparator();
    comparator.run();
}

module.exports = PerformanceComparator;
