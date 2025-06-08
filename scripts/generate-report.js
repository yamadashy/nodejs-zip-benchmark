const fs = require('fs').promises;
const path = require('path');

class ReportGenerator {
    constructor() {
        this.resultsDir = path.join(__dirname, '..', 'results');
        this.consolidatedResults = {
            timestamp: new Date().toISOString(),
            nodeVersions: {},
            summary: {},
            rankings: {}
        };
    }

    async loadAllResults() {
        console.log('Loading benchmark results...');
        
        try {
            const files = await fs.readdir(this.resultsDir);
            const resultFiles = files.filter(f => f.startsWith('benchmark-node') && f.endsWith('.json'));
            
            console.log(`Found ${resultFiles.length} result files:`, resultFiles);
            
            for (const filename of resultFiles) {
                const nodeVersion = filename.match(/node(\d+)/)?.[1];
                if (!nodeVersion) continue;
                
                const filePath = path.join(this.resultsDir, filename);
                const content = await fs.readFile(filePath, 'utf8');
                const results = JSON.parse(content);
                
                this.consolidatedResults.nodeVersions[nodeVersion] = results;
                console.log(`✓ Loaded results for Node.js ${nodeVersion}`);
            }
            
        } catch (error) {
            console.error('Error loading results:', error.message);
        }
    }

    calculateSummaryStats() {
        console.log('Calculating summary statistics...');
        
        const allVersions = Object.keys(this.consolidatedResults.nodeVersions);
        if (allVersions.length === 0) {
            console.log('No results to summarize');
            return;
        }
        
        // Initialize summary structure
        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];
        
        for (const operation of operations) {
            this.consolidatedResults.summary[operation] = {};
            
            for (const size of sizes) {
                this.consolidatedResults.summary[operation][size] = {};
                
                // Collect all libraries across versions
                const allLibraries = new Set();
                for (const version of allVersions) {
                    const versionResults = this.consolidatedResults.nodeVersions[version];
                    if (versionResults.results[size]) {
                        Object.keys(versionResults.results[size]).forEach(lib => {
                            if (versionResults.results[size][lib][operation]) {
                                allLibraries.add(lib);
                            }
                        });
                    }
                }
                
                // Calculate average performance across Node.js versions
                for (const library of allLibraries) {
                    const performanceData = [];
                    
                    for (const version of allVersions) {
                        const versionResults = this.consolidatedResults.nodeVersions[version];
                        if (versionResults.results[size]?.[library]?.[operation]) {
                            performanceData.push(versionResults.results[size][library][operation]);
                        }
                    }
                    
                    if (performanceData.length > 0) {
                        this.consolidatedResults.summary[operation][size][library] = {
                            avgAcrossVersions: performanceData.reduce((sum, p) => sum + p.avg, 0) / performanceData.length,
                            minAcrossVersions: Math.min(...performanceData.map(p => p.min)),
                            maxAcrossVersions: Math.max(...performanceData.map(p => p.max)),
                            memoryAvg: performanceData.reduce((sum, p) => sum + p.memory, 0) / performanceData.length,
                            versionsCount: performanceData.length,
                            versions: allVersions.filter(v => 
                                this.consolidatedResults.nodeVersions[v].results[size]?.[library]?.[operation]
                            )
                        };
                    }
                }
            }
        }
    }

    generateRankings() {
        console.log('Generating performance rankings...');
        
        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];
        
        for (const operation of operations) {
            this.consolidatedResults.rankings[operation] = {};
            
            for (const size of sizes) {
                const libraries = Object.entries(this.consolidatedResults.summary[operation]?.[size] || {});
                
                // Sort by average performance (fastest first)
                libraries.sort(([, a], [, b]) => a.avgAcrossVersions - b.avgAcrossVersions);
                
                this.consolidatedResults.rankings[operation][size] = libraries.map(([name, data], index) => ({
                    rank: index + 1,
                    library: name,
                    avgTime: data.avgAcrossVersions,
                    minTime: data.minAcrossVersions,
                    maxTime: data.maxAcrossVersions,
                    avgMemory: data.memoryAvg,
                    versionsCount: data.versionsCount,
                    versions: data.versions,
                    // Calculate relative performance (compared to fastest)
                    relativeSpeed: libraries.length > 0 ? libraries[0][1].avgAcrossVersions / data.avgAcrossVersions : 1
                }));
            }
        }
    }

    async generateMarkdownReport() {
        console.log('Generating consolidated markdown report...');
        
        let markdown = `# 🚀 Node.js ZIP Library Benchmark - Consolidated Results\n\n`;
        markdown += `**Generated:** ${this.consolidatedResults.timestamp}\n\n`;
        
        // Overview
        const nodeVersions = Object.keys(this.consolidatedResults.nodeVersions);
        markdown += `## 📊 Overview\n\n`;
        markdown += `This report consolidates benchmark results across **${nodeVersions.length} Node.js versions**: ${nodeVersions.join(', ')}\n\n`;
        
        if (nodeVersions.length > 0) {
            const sampleResult = Object.values(this.consolidatedResults.nodeVersions)[0];
            markdown += `### System Information (Sample)\n\n`;
            markdown += `- **Platform:** ${sampleResult.systemInfo.platform} (${sampleResult.systemInfo.arch})\n`;
            markdown += `- **CPUs:** ${sampleResult.systemInfo.cpus}\n`;
            markdown += `- **Memory:** ${sampleResult.systemInfo.totalMemory}\n\n`;
        }
        
        // Top performers summary
        markdown += `## 🏆 Top Performers Summary\n\n`;
        
        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];
        
        for (const operation of operations) {
            markdown += `### ${operation.charAt(0).toUpperCase() + operation.slice(1)} Operation\n\n`;
            
            for (const size of sizes) {
                const ranking = this.consolidatedResults.rankings[operation]?.[size] || [];
                if (ranking.length > 0) {
                    const winner = ranking[0];
                    markdown += `**${size.charAt(0).toUpperCase() + size.slice(1)} files:** `;
                    markdown += `🥇 **${winner.library}** (${winner.avgTime.toFixed(2)}ms avg)\n`;
                    
                    if (ranking.length > 1) {
                        markdown += `  - 🥈 ${ranking[1].library} (${ranking[1].avgTime.toFixed(2)}ms, ${(ranking[1].avgTime / winner.avgTime).toFixed(1)}x slower)\n`;
                    }
                    if (ranking.length > 2) {
                        markdown += `  - 🥉 ${ranking[2].library} (${ranking[2].avgTime.toFixed(2)}ms, ${(ranking[2].avgTime / winner.avgTime).toFixed(1)}x slower)\n`;
                    }
                    markdown += `\n`;
                }
            }
        }
        
        // Detailed rankings
        markdown += `## 📈 Detailed Performance Rankings\n\n`;
        
        for (const operation of operations) {
            markdown += `### ${operation.charAt(0).toUpperCase() + operation.slice(1)} Performance\n\n`;
            
            for (const size of sizes) {
                const ranking = this.consolidatedResults.rankings[operation]?.[size] || [];
                
                if (ranking.length === 0) {
                    markdown += `#### ${size.charAt(0).toUpperCase() + size.slice(1)} Files\n\n`;
                    markdown += `*No results available*\n\n`;
                    continue;
                }
                
                markdown += `#### ${size.charAt(0).toUpperCase() + size.slice(1)} Files\n\n`;
                markdown += `| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |\n`;
                markdown += `|------|---------|---------------|----------|----------|----------------|----------|----------------|\n`;
                
                for (const result of ranking) {
                    const medal = result.rank === 1 ? '🥇' : result.rank === 2 ? '🥈' : result.rank === 3 ? '🥉' : result.rank.toString();
                    const relativeSpeed = result.relativeSpeed.toFixed(2) + 'x';
                    
                    markdown += `| ${medal} | **${result.library}** | ${result.avgTime.toFixed(2)} | ${result.minTime.toFixed(2)} | ${result.maxTime.toFixed(2)} | ${Math.round(result.avgMemory).toLocaleString()} | ${result.versions.join(', ')} | ${relativeSpeed} |\n`;
                }
                
                markdown += `\n`;
            }
        }
        
        // Recommendations
        markdown += `## 💡 Recommendations\n\n`;
        
        const createRanking = this.consolidatedResults.rankings.create;
        const extractRanking = this.consolidatedResults.rankings.extract;
        
        if (createRanking && extractRanking) {
            // Find libraries that perform well in both operations
            const createWinners = Object.values(createRanking).map(rankings => rankings[0]?.library).filter(Boolean);
            const extractWinners = Object.values(extractRanking).map(rankings => rankings[0]?.library).filter(Boolean);
            const allRoundWinners = createWinners.filter(lib => extractWinners.includes(lib));
            
            if (allRoundWinners.length > 0) {
                markdown += `### 🌟 Best All-Round Performers\n`;
                markdown += `Libraries that consistently perform well in both create and extract operations:\n\n`;
                for (const library of [...new Set(allRoundWinners)]) {
                    markdown += `- **${library}**\n`;
                }
                markdown += `\n`;
            }
            
            markdown += `### 📝 Use Case Specific Recommendations\n\n`;
            markdown += `- **For file creation only:** Consider libraries that excel in create operations\n`;
            markdown += `- **For file extraction only:** Consider libraries optimized for extraction\n`;
            markdown += `- **For mixed usage:** Choose libraries with balanced performance\n`;
            markdown += `- **For memory-constrained environments:** Consider memory usage alongside speed\n\n`;
        }
        
        // Node.js version comparison
        if (nodeVersions.length > 1) {
            markdown += `## 🔄 Node.js Version Comparison\n\n`;
            markdown += `Performance differences across Node.js versions:\n\n`;
            
            // This would require more detailed analysis
            markdown += `*Detailed version comparison analysis will be added in future updates.*\n\n`;
        }
        
        markdown += `---\n\n`;
        markdown += `*Report generated automatically by [nodejs-zip-benchmark](https://github.com/your-repo/nodejs-zip-benchmark)*\n`;
        
        return markdown;
    }

    async saveConsolidatedResults() {
        // Save consolidated JSON
        const jsonPath = path.join(this.resultsDir, 'consolidated-results.json');
        await fs.writeFile(jsonPath, JSON.stringify(this.consolidatedResults, null, 2));
        console.log(`✓ Saved consolidated results: ${jsonPath}`);
        
        // Generate and save markdown report
        const markdown = await this.generateMarkdownReport();
        const markdownPath = path.join(this.resultsDir, 'consolidated-report.md');
        await fs.writeFile(markdownPath, markdown);
        console.log(`✓ Saved consolidated report: ${markdownPath}`);
        
        // Create a summary for README
        const summaryPath = path.join(this.resultsDir, 'summary-for-readme.md');
        const summary = await this.generateReadmeSummary();
        await fs.writeFile(summaryPath, summary);
        console.log(`✓ Saved README summary: ${summaryPath}`);
    }

    async generateReadmeSummary() {
        let summary = `## 🏆 Latest Benchmark Results\n\n`;
        summary += `*Last updated: ${new Date(this.consolidatedResults.timestamp).toLocaleDateString()}*\n\n`;
        
        const operations = ['create', 'extract'];
        
        for (const operation of operations) {
            const rankings = this.consolidatedResults.rankings[operation];
            if (!rankings) continue;
            
            summary += `### ${operation.charAt(0).toUpperCase() + operation.slice(1)} Performance Winners\n\n`;
            
            // Show top performer for each file size
            const sizes = ['small', 'medium', 'large'];
            for (const size of sizes) {
                const ranking = rankings[size];
                if (ranking && ranking.length > 0) {
                    const winner = ranking[0];
                    summary += `- **${size.charAt(0).toUpperCase() + size.slice(1)} files:** ${winner.library} (${winner.avgTime.toFixed(1)}ms)\n`;
                }
            }
            summary += `\n`;
        }
        
        summary += `[📊 View Full Report](results/consolidated-report.md) | [📁 Raw Data](results/consolidated-results.json)\n\n`;
        
        return summary;
    }

    async run() {
        try {
            console.log('🚀 Generating consolidated benchmark report...\n');
            
            await this.loadAllResults();
            this.calculateSummaryStats();
            this.generateRankings();
            await this.saveConsolidatedResults();
            
            console.log('\n✅ Report generation completed successfully!');
            
        } catch (error) {
            console.error('❌ Report generation failed:', error);
            process.exit(1);
        }
    }
}

// Run report generator if this file is executed directly
if (require.main === module) {
    const generator = new ReportGenerator();
    generator.run();
}

module.exports = ReportGenerator;
