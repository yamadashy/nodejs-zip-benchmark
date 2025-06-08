const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');
const os = require('os');

class ZipBenchmark {
    constructor() {
        this.libraries = {};
        this.testData = {};
        this.results = {
            timestamp: new Date().toISOString(),
            systemInfo: this.getSystemInfo(),
            results: {}
        };
        this.iterations = parseInt(process.argv.find(arg => arg.startsWith('--iterations='))?.split('=')[1]) || 5;
    }

    getSystemInfo() {
        return {
            nodeVersion: process.version,
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
            hostname: os.hostname()
        };
    }

    async loadLibraries() {
        const libraryConfigs = [
            { name: 'adm-zip', module: 'adm-zip', supports: ['create', 'extract'] },
            { name: 'yauzl', module: 'yauzl', supports: ['extract'] },
            { name: 'yazl', module: 'yazl', supports: ['create'] },
            { name: 'node-stream-zip', module: 'node-stream-zip', supports: ['extract'] },
            { name: 'jszip', module: 'jszip', supports: ['create', 'extract'] },
            { name: 'fflate', module: 'fflate', supports: ['create', 'extract'] }
        ];

        for (const config of libraryConfigs) {
            try {
                this.libraries[config.name] = {
                    module: require(config.module),
                    supports: config.supports
                };
                console.log(`✓ Loaded ${config.name}`);
            } catch (error) {
                console.log(`✗ Failed to load ${config.name}: ${error.message}`);
            }
        }
    }

    async generateTestData() {
        const sizes = {
            small: 1024,        // 1KB
            medium: 1024 * 1024, // 1MB
            large: 10 * 1024 * 1024 // 10MB
        };

        console.log('Generating test data...');
        
        for (const [size, bytes] of Object.entries(sizes)) {
            const data = Buffer.alloc(bytes);
            // Fill with random-like data for better compression testing
            for (let i = 0; i < bytes; i++) {
                data[i] = Math.floor(Math.random() * 256);
            }
            
            this.testData[size] = data;
            
            // Save to file for libraries that work with files
            const filePath = path.join(__dirname, '..', 'test-data', `${size}.txt`);
            await fs.writeFile(filePath, data);
            console.log(`✓ Generated ${size} test data (${bytes} bytes)`);
        }
    }

    async measureMemory(operation) {
        const before = process.memoryUsage();
        await operation();
        const after = process.memoryUsage();
        return after.heapUsed - before.heapUsed;
    }

    async measureTime(operation) {
        const start = performance.now();
        await operation();
        return performance.now() - start;
    }

    async benchmarkLibrary(libraryName, library, operation, dataSize) {
        const results = [];
        
        for (let i = 0; i < this.iterations; i++) {
            try {
                let time, memory;
                
                if (operation === 'create') {
                    const result = await this.benchmarkCreate(libraryName, library, dataSize);
                    time = result.time;
                    memory = result.memory;
                } else {
                    const result = await this.benchmarkExtract(libraryName, library, dataSize);
                    time = result.time;
                    memory = result.memory;
                }
                
                results.push({ time, memory });
            } catch (error) {
                console.error(`Error in ${libraryName} ${operation} (iteration ${i + 1}):`, error.message);
            }
        }
        
        if (results.length === 0) {
            return null;
        }
        
        const times = results.map(r => r.time);
        const memories = results.map(r => r.memory);
        
        return {
            avg: times.reduce((a, b) => a + b, 0) / times.length,
            min: Math.min(...times),
            max: Math.max(...times),
            memory: memories.reduce((a, b) => a + b, 0) / memories.length,
            iterations: results.length
        };
    }

    async benchmarkCreate(libraryName, library, dataSize) {
        const data = this.testData[dataSize];
        const outputPath = path.join(__dirname, '..', 'test-data', `output-${libraryName}-${dataSize}.zip`);
        
        let time, memory;
        
        switch (libraryName) {
            case 'adm-zip':
                time = await this.measureTime(async () => {
                    const zip = new library.module();
                    zip.addFile(`test-${dataSize}.txt`, data);
                    zip.writeZip(outputPath);
                });
                break;
                
            case 'yazl':
                time = await this.measureTime(async () => {
                    return new Promise((resolve, reject) => {
                        const zipfile = new library.module.ZipFile();
                        zipfile.addBuffer(data, `test-${dataSize}.txt`);
                        zipfile.end();
                        zipfile.outputStream.pipe(require('fs').createWriteStream(outputPath))
                            .on('close', resolve)
                            .on('error', reject);
                    });
                });
                break;
                
            case 'jszip':
                time = await this.measureTime(async () => {
                    const zip = new library.module();
                    zip.file(`test-${dataSize}.txt`, data);
                    const content = await zip.generateAsync({ type: 'nodebuffer' });
                    await fs.writeFile(outputPath, content);
                });
                break;
                
            case 'fflate':
                time = await this.measureTime(async () => {
                    const { zipSync } = library.module;
                    const compressed = zipSync({ [`test-${dataSize}.txt`]: data });
                    await fs.writeFile(outputPath, compressed);
                });
                break;
                
            default:
                throw new Error(`Create operation not implemented for ${libraryName}`);
        }
        
        memory = await this.measureMemory(async () => {
            // Re-run the operation to measure memory
            // This is a simplified approach - in practice, memory measurement is complex
        });
        
        return { time, memory: memory || 0 };
    }

    async benchmarkExtract(libraryName, library, dataSize) {
        const zipPath = path.join(__dirname, '..', 'test-data', `output-adm-zip-${dataSize}.zip`);
        
        // Create zip file if it doesn't exist (using adm-zip as reference)
        try {
            await fs.access(zipPath);
        } catch {
            const admZip = require('adm-zip');
            const zip = new admZip();
            zip.addFile(`test-${dataSize}.txt`, this.testData[dataSize]);
            zip.writeZip(zipPath);
        }
        
        let time, memory;
        
        switch (libraryName) {
            case 'adm-zip':
                time = await this.measureTime(async () => {
                    const zip = new library.module(zipPath);
                    zip.extractAllTo(path.join(__dirname, '..', 'test-data', 'temp'), true);
                });
                break;
                
            case 'yauzl':
                time = await this.measureTime(async () => {
                    return new Promise((resolve, reject) => {
                        library.module.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
                            if (err) return reject(err);
                            zipfile.readEntry();
                            zipfile.on('entry', (entry) => {
                                zipfile.openReadStream(entry, (err, readStream) => {
                                    if (err) return reject(err);
                                    readStream.on('end', () => {
                                        zipfile.readEntry();
                                    });
                                    readStream.resume();
                                });
                            });
                            zipfile.on('end', resolve);
                        });
                    });
                });
                break;
                
            case 'node-stream-zip':
                time = await this.measureTime(async () => {
                    return new Promise((resolve, reject) => {
                        const zip = new library.module.async({ file: zipPath });
                        zip.extract(null, path.join(__dirname, '..', 'test-data', 'temp'))
                            .then(resolve)
                            .catch(reject);
                    });
                });
                break;
                
            case 'jszip':
                time = await this.measureTime(async () => {
                    const data = await fs.readFile(zipPath);
                    const zip = await library.module.loadAsync(data);
                    const files = Object.keys(zip.files);
                    for (const filename of files) {
                        await zip.files[filename].async('nodebuffer');
                    }
                });
                break;
                
            case 'fflate':
                time = await this.measureTime(async () => {
                    const { unzipSync } = library.module;
                    const data = await fs.readFile(zipPath);
                    const unzipped = unzipSync(data);
                    // Process the unzipped data to ensure it's actually extracted
                    Object.values(unzipped);
                });
                break;
                
            default:
                throw new Error(`Extract operation not implemented for ${libraryName}`);
        }
        
        memory = 0; // Simplified for now
        
        return { time, memory };
    }

    async runBenchmarks() {
        console.log(`Starting benchmarks with ${this.iterations} iterations each...`);
        
        const dataSizes = ['small', 'medium', 'large'];
        
        for (const dataSize of dataSizes) {
            console.log(`\n=== Testing ${dataSize} files ===`);
            this.results.results[dataSize] = {};
            
            for (const [libraryName, library] of Object.entries(this.libraries)) {
                console.log(`\nTesting ${libraryName}...`);
                this.results.results[dataSize][libraryName] = {};
                
                for (const operation of library.supports) {
                    console.log(`  ${operation}...`);
                    const result = await this.benchmarkLibrary(libraryName, library, operation, dataSize);
                    
                    if (result) {
                        this.results.results[dataSize][libraryName][operation] = result;
                        console.log(`    ✓ Average: ${result.avg.toFixed(2)}ms`);
                    } else {
                        console.log(`    ✗ Failed`);
                    }
                }
            }
        }
    }

    async saveResults() {
        const resultsDir = path.join(__dirname, '..', 'results');
        await fs.mkdir(resultsDir, { recursive: true });
        
        // Save JSON results
        const jsonPath = path.join(resultsDir, `benchmark-${Date.now()}.json`);
        await fs.writeFile(jsonPath, JSON.stringify(this.results, null, 2));
        
        // Save latest results
        const latestPath = path.join(resultsDir, 'latest.json');
        await fs.writeFile(latestPath, JSON.stringify(this.results, null, 2));
        
        console.log(`\nResults saved to:`);
        console.log(`  - ${jsonPath}`);
        console.log(`  - ${latestPath}`);
        
        await this.generateMarkdownReport();
    }

    async generateMarkdownReport() {
        const reportPath = path.join(__dirname, '..', 'results', 'latest-report.md');
        
        let markdown = `# ZIP Library Benchmark Results\n\n`;
        markdown += `**Generated:** ${this.results.timestamp}\n\n`;
        
        markdown += `## System Information\n\n`;
        markdown += `- **Node.js Version:** ${this.results.systemInfo.nodeVersion}\n`;
        markdown += `- **Platform:** ${this.results.systemInfo.platform} (${this.results.systemInfo.arch})\n`;
        markdown += `- **CPUs:** ${this.results.systemInfo.cpus}\n`;
        markdown += `- **Memory:** ${this.results.systemInfo.totalMemory}\n`;
        markdown += `- **Iterations:** ${this.iterations}\n\n`;
        
        // Generate ranking tables for each operation and size
        const operations = ['create', 'extract'];
        const sizes = ['small', 'medium', 'large'];
        
        for (const operation of operations) {
            markdown += `## ${operation.charAt(0).toUpperCase() + operation.slice(1)} Performance\n\n`;
            
            for (const size of sizes) {
                markdown += `### ${size.charAt(0).toUpperCase() + size.slice(1)} Files\n\n`;
                markdown += `| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |\n`;
                markdown += `|---------|--------------|----------|----------|----------------|\n`;
                
                const results = [];
                for (const [libraryName, libraryResults] of Object.entries(this.results.results[size] || {})) {
                    if (libraryResults[operation]) {
                        const result = libraryResults[operation];
                        results.push({
                            name: libraryName,
                            avg: result.avg,
                            min: result.min,
                            max: result.max,
                            memory: result.memory
                        });
                    }
                }
                
                // Sort by average time
                results.sort((a, b) => a.avg - b.avg);
                
                for (const result of results) {
                    markdown += `| ${result.name} | ${result.avg.toFixed(2)} | ${result.min.toFixed(2)} | ${result.max.toFixed(2)} | ${Math.round(result.memory).toLocaleString()} |\n`;
                }
                
                markdown += `\n`;
            }
        }
        
        await fs.writeFile(reportPath, markdown);
        console.log(`  - ${reportPath}`);
    }

    async cleanup() {
        // Clean up temporary files
        const tempDir = path.join(__dirname, '..', 'test-data', 'temp');
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch (error) {
            // Ignore cleanup errors
        }
    }

    async run() {
        try {
            console.log('🚀 Starting ZIP library benchmark...\n');
            
            await this.loadLibraries();
            await this.generateTestData();
            await this.runBenchmarks();
            await this.saveResults();
            await this.cleanup();
            
            console.log('\n✅ Benchmark completed successfully!');
            
        } catch (error) {
            console.error('❌ Benchmark failed:', error);
            process.exit(1);
        }
    }
}

// Run benchmark if this file is executed directly
if (require.main === module) {
    const benchmark = new ZipBenchmark();
    benchmark.run();
}

module.exports = ZipBenchmark;
