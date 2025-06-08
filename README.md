# Node.js ZIP Library Benchmark

A comprehensive performance comparison of popular Node.js ZIP libraries.

## Overview

This project benchmarks various Node.js libraries for creating and extracting ZIP files, providing detailed performance metrics to help developers choose the best library for their use case.

## Features

- 🚀 **Automated benchmarking** across multiple Node.js versions (18, 20, 22)
- 📊 **Detailed performance reports** with rankings and statistical analysis
- 🔄 **Continuous integration** with GitHub Actions
- 📈 **Performance regression detection** to catch slowdowns early
- 🎯 **Memory usage analysis** alongside execution time
- 📱 **Cross-platform testing** on Ubuntu, macOS, and Windows
- 🏆 **Top performer identification** for different use cases

## Libraries Tested

| Library | Create | Extract | Description |
|---------|--------|---------|-------------|
| **adm-zip** | ✅ | ✅ | Pure JavaScript implementation with sync/async support |
| **yauzl** | ❌ | ✅ | Focused on extraction with streaming support |
| **yazl** | ✅ | ❌ | Focused on creation with streaming support |
| **node-stream-zip** | ❌ | ✅ | Memory-efficient streaming ZIP reader |
| **jszip** | ✅ | ✅ | Popular library with browser compatibility |
| **fflate** | ✅ | ✅ | High-performance compression library |

## Test Methodology

- **File sizes**: 1KB (small), 1MB (medium), 10MB (large)
- **Operations**: Create and extract ZIP files
- **Iterations**: 5 runs per test for statistical accuracy
- **Metrics**: Average execution time, minimum/maximum times, memory usage
- **Environment**: Clean Node.js environment with garbage collection

<!-- BENCHMARK_RESULTS_START -->

## 🏆 Latest Benchmark Results

*Last updated: June 8, 2025 at 11:47 AM UTC*

### 🏆 Top Performers (Averaged across Node.js versions)

#### Create Performance

**Small files:**
🥇 **jszip** - 2.0ms avg | 🥈 yazl (1.2x slower) | 🥉 fflate (1.4x slower)

**Medium files:**
🥇 **jszip** - 8.2ms avg | 🥈 adm-zip (3.6x slower) | 🥉 yazl (4.6x slower)

**Large files:**
🥇 **jszip** - 69.2ms avg | 🥈 yazl (4.9x slower) | 🥉 adm-zip (5.7x slower)

#### Extract Performance

**Small files:**
🥇 **fflate** - 0.7ms avg | 🥈 adm-zip (2.1x slower) | 🥉 node-stream-zip (3.3x slower)

**Medium files:**
🥇 **fflate** - 1.2ms avg | 🥈 adm-zip (7.9x slower) | 🥉 jszip (11.4x slower)

**Large files:**
🥇 **fflate** - 7.1ms avg | 🥈 adm-zip (9.9x slower) | 🥉 jszip (12.5x slower)


### 📊 Performance Overview

This benchmark compares the performance of popular Node.js ZIP libraries across different file sizes and operations.

**Libraries tested:**
- **adm-zip**: Pure JavaScript implementation with sync/async support
- **yauzl**: Focused on extraction with streaming support
- **yazl**: Focused on creation with streaming support
- **node-stream-zip**: Memory-efficient streaming ZIP reader
- **jszip**: Popular library with browser compatibility
- **fflate**: High-performance compression library

**Test methodology:**
- File sizes: 1KB (small), 1MB (medium), 10MB (large)
- Operations: Create and extract ZIP files
- Multiple iterations for statistical accuracy
- Tested on Node.js versions: 18, 20, 22

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/nodejs-zip-benchmark.git
cd nodejs-zip-benchmark

# Install dependencies
npm install

# Run benchmark
npm run benchmark
```

### 📈 Detailed Results

- [📊 Full Report](results/consolidated-report.md) - Comprehensive analysis and rankings
- [📁 Raw Data](results/consolidated-results.json) - Complete benchmark data
- [🔍 Performance Comparison](results/performance-comparison.md) - Change analysis

### 🤝 Contributing

Want to add a library or improve the benchmark? Contributions are welcome!

1. Fork the repository
2. Add your library to the benchmark suite
3. Submit a pull request

<!-- BENCHMARK_RESULTS_END -->

## Usage

### Running Benchmarks Locally

```bash
# Clone the repository
git clone https://github.com/your-username/nodejs-zip-benchmark.git
cd nodejs-zip-benchmark

# Install dependencies
npm install

# Run benchmark with default settings (5 iterations)
npm run benchmark

# Run with custom iterations
npm run benchmark -- --iterations=10

# Run quick test (3 iterations)
npm test
```

### Generating Reports

```bash
# Generate consolidated report from multiple results
npm run generate-report

# Compare performance with baseline
npm run compare-performance

# Update README with latest results
npm run update-readme
```

## Project Structure

```
nodejs-zip-benchmark/
├── .github/
│   └── workflows/
│       └── benchmark.yml      # GitHub Actions workflow
├── benchmark/
│   └── index.js              # Main benchmark script
├── scripts/
│   ├── generate-report.js    # Report generation
│   ├── compare-performance.js # Performance comparison
│   └── update-readme.js      # README updater
├── test-data/                # Generated test files
├── results/                  # Benchmark results
├── package.json
└── README.md
```

## GitHub Actions

The project includes automated benchmarking with GitHub Actions:

- **Triggers**: Push to main/develop, pull requests, weekly schedule, manual dispatch
- **Matrix testing**: Node.js 18, 20, 22
- **Artifact storage**: Results stored for 30-90 days
- **PR comments**: Automatic performance comparison comments
- **README updates**: Automatic updates on main branch
- **GitHub Pages**: Results published to pages

## Contributing

Contributions are welcome! Here's how you can help:

### Adding a New Library

1. Install the library: `npm install library-name`
2. Add configuration to `benchmark/index.js` in the `libraryConfigs` array
3. Implement the benchmark methods (`benchmarkCreate` and/or `benchmarkExtract`)
4. Test locally: `npm run benchmark`
5. Submit a pull request

### Improving Benchmarks

- Enhance measurement accuracy
- Add new test scenarios (compression levels, file types)
- Improve error handling
- Add more detailed memory profiling

### Documentation

- Update library descriptions
- Add usage examples
- Improve setup instructions

## Results Interpretation

### Performance Metrics

- **Average Time**: Mean execution time across all iterations
- **Min/Max Time**: Fastest and slowest individual runs
- **Memory Usage**: Peak memory allocation during operation
- **Relative Speed**: Performance compared to fastest library (1.0x = fastest)

### Rankings

Libraries are ranked by average execution time for each operation and file size. Lower times = better performance.

### Statistical Significance

- Multiple iterations reduce random variation
- Results are averaged across Node.js versions
- Performance differences >5% are highlighted as significant

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- All the library maintainers for their excellent work
- The Node.js community for performance testing best practices
- Contributors who help improve this benchmark suite