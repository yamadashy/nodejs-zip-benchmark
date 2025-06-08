const fs = require('fs').promises;
const path = require('path');

class ReadmeUpdater {
    constructor() {
        this.resultsDir = path.join(__dirname, '..', 'results');
        this.readmePath = path.join(__dirname, '..', 'README.md');
        this.startMarker = '<!-- BENCHMARK_RESULTS_START -->';
        this.endMarker = '<!-- BENCHMARK_RESULTS_END -->';
    }

    async loadLatestResults() {
        try {
            // Try to load consolidated results first
            const consolidatedPath = path.join(this.resultsDir, 'consolidated-results.json');
            const content = await fs.readFile(consolidatedPath, 'utf8');
            const results = JSON.parse(content);
            console.log('✓ Loaded consolidated results');
            return results;
        } catch (error) {
            console.log('⚠️  Consolidated results not found, trying latest.json');
            
            try {
                const latestPath = path.join(this.resultsDir, 'latest.json');
                const content = await fs.readFile(latestPath, 'utf8');
                const results = JSON.parse(content);
                console.log('✓ Loaded latest results');
                return results;
            } catch (error) {
                console.error('❌ No results found');
                return null;
            }
        }
    }

    async loadReadme() {
        try {
            const content = await fs.readFile(this.readmePath, 'utf8');
            console.log('✓ Loaded README.md');
            return content;
        } catch (error) {
            console.error('❌ Failed to load README.md:', error.message);
            return null;
        }
    }

    generateBenchmarkSection(results) {
        if (!results) {
            return `${this.startMarker}\n\n*Benchmark results will appear here after the first run.*\n\n${this.endMarker}`;
        }

        let section = `${this.startMarker}\n\n`;
        section += `## 🏆 Latest Benchmark Results\n\n`;
        
        const timestamp = new Date(results.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
        
        section += `*Last updated: ${timestamp} UTC*\n\n`;

        // Check if this is consolidated results or single version results
        const isConsolidated = results.nodeVersions && Object.keys(results.nodeVersions).length > 0;
        
        if (isConsolidated) {
            section += this.generateConsolidatedSummary(results);
        } else {
            section += this.generateSingleVersionSummary(results);
        }

        section += `\n### 📊 Performance Overview\n\n`;
        section += `This benchmark compares the performance of popular Node.js ZIP libraries across different file sizes and operations.\n\n`;
        
        section += `**Libraries tested:**\n`;
        const libraries = this.getTestedLibraries(results);
        for (const lib of libraries) {
            section += `- **${lib.name}**: ${lib.description}\n`;
        }
        section += `\n`;

        section += `**Test methodology:**\n`;
        section += `- File sizes: 1KB (small), 1MB (medium), 10MB (large)\n`;
        section += `- Operations: Create and extract ZIP files\n`;
        section += `- Multiple iterations for statistical accuracy\n`;
        
        if (isConsolidated) {
            const nodeVersions = Object.keys(results.nodeVersions);
            section += `- Tested on Node.js versions: ${nodeVersions.join(', ')}\n`;
        }
        section += `\n`;

        section += `### 🚀 Quick Start\n\n`;
        section += `\`\`\`bash\n`;
        section += `# Clone the repository\n`;
        section += `git clone https://github.com/your-username/nodejs-zip-benchmark.git\n`;
        section += `cd nodejs-zip-benchmark\n\n`;
        section += `# Install dependencies\n`;
        section += `npm install\n\n`;
        section += `# Run benchmark\n`;
        section += `npm run benchmark\n`;
        section += `\`\`\`\n\n`;

        section += `### 📈 Detailed Results\n\n`;
        section += `- [📊 Full Report](results/consolidated-report.md) - Comprehensive analysis and rankings\n`;
        section += `- [📁 Raw Data](results/consolidated-results.json) - Complete benchmark data\n`;
        section += `- [🔍 Performance Comparison](results/performance-comparison.md) - Change analysis\n\n`;

        section += `### 🤝 Contributing\n\n`;
        section += `Want to add a library or improve the benchmark? Contributions are welcome!\n\n`;
        section += `1. Fork the repository\n`;
        section += `2. Add your library to the benchmark suite\n`;
        section += `3. Submit a pull request\n\n`;

        section += `${this.endMarker}`;

        return section;
    }

    generateConsolidatedSummary(results) {
        let summary = `### 🏆 Top Performers (Averaged across Node.js versions)\n\n`;
        
        const operations = ['create', 'extract'];
        
        for (const operation of operations) {
            const rankings = results.rankings?.[operation];
            if (!rankings) continue;
            
            summary += `#### ${operation.charAt(0).toUpperCase() + operation.slice(1)} Performance\n\n`;
            
            const sizes = ['small', 'medium', 'large'];
            for (const size of sizes) {
                const ranking = rankings[size];
                if (!ranking || ranking.length === 0) continue;
                
                const winner = ranking[0];
                const runnerUp = ranking[1];
                const third = ranking[2];
                
                summary += `**${size.charAt(0).toUpperCase() + size.slice(1)} files:**\n`;
                summary += `🥇 **${winner.library}** - ${winner.avgTime.toFixed(1)}ms avg`;
                
                if (runnerUp) {
                    const slowdown = (runnerUp.avgTime / winner.avgTime).toFixed(1);
                    summary += ` | 🥈 ${runnerUp.library} (${slowdown}x slower)`;
                }
                
                if (third) {
                    const slowdown = (third.avgTime / winner.avgTime).toFixed(1);
                    summary += ` | 🥉 ${third.library} (${slowdown}x slower)`;
                }
                
                summary += `\n\n`;
            }
        }
        
        return summary;
    }

    generateSingleVersionSummary(results) {
        let summary = `### 🏆 Top Performers\n\n`;
        summary += `*Results from Node.js ${results.systemInfo?.nodeVersion || 'Unknown'}*\n\n`;
        
        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];
        
        for (const operation of operations) {
            summary += `#### ${operation.charAt(0).toUpperCase() + operation.slice(1)} Performance\n\n`;
            
            for (const size of sizes) {
                const sizeResults = results.results?.[size];
                if (!sizeResults) continue;
                
                // Extract and sort results for this operation and size
                const rankings = [];
                for (const [library, libraryResults] of Object.entries(sizeResults)) {
                    if (libraryResults[operation]) {
                        rankings.push({
                            library,
                            time: libraryResults[operation].avg,
                            memory: libraryResults[operation].memory
                        });
                    }
                }
                
                rankings.sort((a, b) => a.time - b.time);
                
                if (rankings.length > 0) {
                    const winner = rankings[0];
                    const runnerUp = rankings[1];
                    const third = rankings[2];
                    
                    summary += `**${size.charAt(0).toUpperCase() + size.slice(1)} files:**\n`;
                    summary += `🥇 **${winner.library}** - ${winner.time.toFixed(1)}ms`;
                    
                    if (runnerUp) {
                        const slowdown = (runnerUp.time / winner.time).toFixed(1);
                        summary += ` | 🥈 ${runnerUp.library} (${slowdown}x slower)`;
                    }
                    
                    if (third) {
                        const slowdown = (third.time / winner.time).toFixed(1);
                        summary += ` | 🥉 ${third.library} (${slowdown}x slower)`;
                    }
                    
                    summary += `\n\n`;
                }
            }
        }
        
        return summary;
    }

    getTestedLibraries(results) {
        const libraries = [
            { name: 'adm-zip', description: 'Pure JavaScript implementation with sync/async support' },
            { name: 'yauzl', description: 'Focused on extraction with streaming support' },
            { name: 'yazl', description: 'Focused on creation with streaming support' },
            { name: 'node-stream-zip', description: 'Memory-efficient streaming ZIP reader' },
            { name: 'jszip', description: 'Popular library with browser compatibility' },
            { name: 'fflate', description: 'High-performance compression library' }
        ];

        // Filter to only libraries that have results
        const testedLibraryNames = new Set();
        
        if (results.nodeVersions) {
            // Consolidated results
            for (const versionResults of Object.values(results.nodeVersions)) {
                for (const sizeResults of Object.values(versionResults.results || {})) {
                    Object.keys(sizeResults).forEach(lib => testedLibraryNames.add(lib));
                }
            }
        } else {
            // Single version results
            for (const sizeResults of Object.values(results.results || {})) {
                Object.keys(sizeResults).forEach(lib => testedLibraryNames.add(lib));
            }
        }

        return libraries.filter(lib => testedLibraryNames.has(lib.name));
    }

    async updateReadme(newSection) {
        let readme = await this.loadReadme();
        if (!readme) {
            console.error('❌ Cannot update README without existing content');
            return false;
        }

        const startIndex = readme.indexOf(this.startMarker);
        const endIndex = readme.indexOf(this.endMarker);

        if (startIndex === -1 || endIndex === -1) {
            console.log('⚠️  Benchmark markers not found, appending to README');
            readme += `\n\n${newSection}\n`;
        } else {
            // Replace content between markers
            const before = readme.substring(0, startIndex);
            const after = readme.substring(endIndex + this.endMarker.length);
            readme = before + newSection + after;
        }

        try {
            await fs.writeFile(this.readmePath, readme);
            console.log('✅ README.md updated successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to write README.md:', error.message);
            return false;
        }
    }

    async createBackup() {
        try {
            const readme = await fs.readFile(this.readmePath, 'utf8');
            const backupPath = path.join(this.resultsDir, `readme-backup-${Date.now()}.md`);
            await fs.writeFile(backupPath, readme);
            console.log(`✓ Created README backup: ${backupPath}`);
        } catch (error) {
            console.log('⚠️  Could not create README backup:', error.message);
        }
    }

    async ensureReadmeExists() {
        try {
            await fs.access(this.readmePath);
            return true;
        } catch (error) {
            console.log('📝 Creating new README.md');
            
            const defaultReadme = `# Node.js ZIP Library Benchmark

A comprehensive performance comparison of popular Node.js ZIP libraries.

## Overview

This project benchmarks various Node.js libraries for creating and extracting ZIP files, providing detailed performance metrics to help developers choose the best library for their use case.

## Features

- 🚀 Automated benchmarking across multiple Node.js versions
- 📊 Detailed performance reports with rankings
- 🔄 Continuous integration with GitHub Actions
- 📈 Performance regression detection
- 🎯 Memory usage analysis
- 📱 Browser compatibility testing

<!-- BENCHMARK_RESULTS_START -->

*Benchmark results will appear here after the first run.*

<!-- BENCHMARK_RESULTS_END -->

## License

MIT License - see LICENSE file for details.
`;
            
            try {
                await fs.writeFile(this.readmePath, defaultReadme);
                console.log('✅ Created new README.md');
                return true;
            } catch (error) {
                console.error('❌ Failed to create README.md:', error.message);
                return false;
            }
        }
    }

    async run() {
        try {
            console.log('📝 Updating README with latest benchmark results...\n');

            // Ensure README exists
            const readmeExists = await this.ensureReadmeExists();
            if (!readmeExists) {
                process.exit(1);
            }

            // Create backup
            await this.createBackup();

            // Load latest results
            const results = await this.loadLatestResults();
            
            // Generate new benchmark section
            const newSection = this.generateBenchmarkSection(results);
            
            // Update README
            const success = await this.updateReadme(newSection);
            
            if (success) {
                console.log('\n✅ README update completed successfully!');
            } else {
                console.log('\n❌ README update failed');
                process.exit(1);
            }

        } catch (error) {
            console.error('❌ README update failed:', error);
            process.exit(1);
        }
    }
}

// Run README updater if this file is executed directly
if (require.main === module) {
    const updater = new ReadmeUpdater();
    updater.run();
}

module.exports = ReadmeUpdater;
