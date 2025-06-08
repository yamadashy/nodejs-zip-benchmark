# Node.js ZIP Library Benchmark

[![Benchmark Status](https://github.com/your-username/nodejs-zip-benchmark/workflows/ZIP%20Library%20Benchmark/badge.svg)](https://github.com/your-username/nodejs-zip-benchmark/actions/workflows/benchmark.yml)
[![Health Check](https://github.com/your-username/nodejs-zip-benchmark/workflows/Benchmark%20Health%20Check/badge.svg)](https://github.com/your-username/nodejs-zip-benchmark/actions/workflows/health-check.yml)

Performance comparison of popular Node.js ZIP libraries for creating and extracting ZIP files.

## Libraries Tested

| Library | Create | Extract | Description |
|---------|--------|---------|-------------|
| **adm-zip** | ✅ | ✅ | Pure JavaScript with sync/async support |
| **yauzl** | ❌ | ✅ | Extraction-focused with streaming |
| **yazl** | ✅ | ❌ | Creation-focused with streaming |
| **node-stream-zip** | ❌ | ✅ | Memory-efficient streaming reader |
| **jszip** | ✅ | ✅ | Popular with browser compatibility |
| **fflate** | ✅ | ✅ | High-performance modern compression |

## Quick Start

```bash
npm install
npm run benchmark
```

## Usage

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nodejs-zip-benchmark.git
cd nodejs-zip-benchmark

# Install dependencies
npm install
```

### Running Benchmarks

```bash
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

## Contributing

Contributions are welcome! To add a new library or improve the benchmark:

1. Fork the repository
2. Make your changes
3. Test locally with `npm run benchmark`
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

<!-- BENCHMARK_RESULTS_START -->

## 🏆 Latest Benchmark Results

*Last updated: June 8, 2025 at 12:40 PM UTC*

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
