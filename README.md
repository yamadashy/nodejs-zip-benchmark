# Node.js ZIP Library Benchmark

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