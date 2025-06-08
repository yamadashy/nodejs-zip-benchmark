# 🚀 Node.js ZIP Library Benchmark - Consolidated Results

**Generated:** 2025-06-08T11:47:55.198Z

## 📊 Overview

This report consolidates benchmark results across **3 Node.js versions**: 18, 20, 22

### System Information (Sample)

- **Platform:** linux (x64)
- **CPUs:** 2
- **Memory:** 8GB

## 🏆 Top Performers Summary

### Create Operation

**Small files:** 🥇 **jszip** (2.02ms avg)
  - 🥈 yazl (2.34ms, 1.2x slower)
  - 🥉 fflate (2.77ms, 1.4x slower)

**Medium files:** 🥇 **jszip** (8.22ms avg)
  - 🥈 adm-zip (29.75ms, 3.6x slower)
  - 🥉 yazl (38.12ms, 4.6x slower)

**Large files:** 🥇 **jszip** (69.23ms avg)
  - 🥈 yazl (337.69ms, 4.9x slower)
  - 🥉 adm-zip (397.06ms, 5.7x slower)

### Extract Operation

**Small files:** 🥇 **fflate** (0.72ms avg)
  - 🥈 adm-zip (1.51ms, 2.1x slower)
  - 🥉 node-stream-zip (2.37ms, 3.3x slower)

**Medium files:** 🥇 **fflate** (1.24ms avg)
  - 🥈 adm-zip (9.86ms, 7.9x slower)
  - 🥉 jszip (14.10ms, 11.4x slower)

**Large files:** 🥇 **fflate** (7.07ms avg)
  - 🥈 adm-zip (69.94ms, 9.9x slower)
  - 🥉 jszip (88.38ms, 12.5x slower)

## 📈 Detailed Performance Rankings

### Create Performance

#### Small Files

| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |
|------|---------|---------------|----------|----------|----------------|----------|----------------|
| 🥇 | **jszip** | 2.02 | 0.91 | 3.89 | 832 | 18, 20, 22 | 1.00x |
| 🥈 | **yazl** | 2.34 | 1.47 | 3.93 | 2,515 | 18, 20, 22 | 0.86x |
| 🥉 | **fflate** | 2.77 | 1.82 | 3.28 | 832 | 18, 20, 22 | 0.73x |
| 4 | **adm-zip** | 4.09 | 0.90 | 6.49 | 1,309 | 18, 20, 22 | 0.49x |

#### Medium Files

| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |
|------|---------|---------------|----------|----------|----------------|----------|----------------|
| 🥇 | **jszip** | 8.22 | 7.19 | 8.99 | 832 | 18, 20, 22 | 1.00x |
| 🥈 | **adm-zip** | 29.75 | 28.79 | 30.79 | 832 | 18, 20, 22 | 0.28x |
| 🥉 | **yazl** | 38.12 | 36.74 | 40.14 | 832 | 18, 20, 22 | 0.22x |
| 4 | **fflate** | 69.05 | 43.99 | 103.83 | 832 | 18, 20, 22 | 0.12x |

#### Large Files

| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |
|------|---------|---------------|----------|----------|----------------|----------|----------------|
| 🥇 | **jszip** | 69.23 | 60.51 | 85.70 | 832 | 18, 20, 22 | 1.00x |
| 🥈 | **yazl** | 337.69 | 312.81 | 363.70 | 832 | 18, 20, 22 | 0.21x |
| 🥉 | **adm-zip** | 397.06 | 294.13 | 551.46 | 832 | 18, 20, 22 | 0.17x |
| 4 | **fflate** | 458.20 | 426.58 | 476.95 | 832 | 18, 20, 22 | 0.15x |

### Extract Performance

#### Small Files

| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |
|------|---------|---------------|----------|----------|----------------|----------|----------------|
| 🥇 | **fflate** | 0.72 | 0.26 | 1.63 | 0 | 18, 20, 22 | 1.00x |
| 🥈 | **adm-zip** | 1.51 | 0.72 | 3.03 | 0 | 18, 20, 22 | 0.48x |
| 🥉 | **node-stream-zip** | 2.37 | 1.34 | 4.31 | 0 | 18, 20, 22 | 0.30x |
| 4 | **yauzl** | 2.97 | 1.11 | 6.11 | 0 | 18, 20, 22 | 0.24x |
| 5 | **jszip** | 3.12 | 0.91 | 6.74 | 0 | 18, 20, 22 | 0.23x |

#### Medium Files

| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |
|------|---------|---------------|----------|----------|----------------|----------|----------------|
| 🥇 | **fflate** | 1.24 | 1.13 | 1.44 | 0 | 18, 20, 22 | 1.00x |
| 🥈 | **adm-zip** | 9.86 | 7.81 | 11.14 | 0 | 18, 20, 22 | 0.13x |
| 🥉 | **jszip** | 14.10 | 10.66 | 20.37 | 0 | 18, 20, 22 | 0.09x |
| 4 | **yauzl** | 18.66 | 14.14 | 22.56 | 0 | 18, 20, 22 | 0.07x |
| 5 | **node-stream-zip** | 30.91 | 28.52 | 34.00 | 0 | 18, 20, 22 | 0.04x |

#### Large Files

| Rank | Library | Avg Time (ms) | Min (ms) | Max (ms) | Memory (bytes) | Versions | Relative Speed |
|------|---------|---------------|----------|----------|----------------|----------|----------------|
| 🥇 | **fflate** | 7.07 | 5.10 | 8.86 | 0 | 18, 20, 22 | 1.00x |
| 🥈 | **adm-zip** | 69.94 | 54.61 | 87.24 | 0 | 18, 20, 22 | 0.10x |
| 🥉 | **jszip** | 88.38 | 82.11 | 91.86 | 0 | 18, 20, 22 | 0.08x |
| 4 | **yauzl** | 92.93 | 87.97 | 99.02 | 0 | 18, 20, 22 | 0.08x |
| 5 | **node-stream-zip** | 214.62 | 202.03 | 227.45 | 0 | 18, 20, 22 | 0.03x |

## 💡 Recommendations

### 📝 Use Case Specific Recommendations

- **For file creation only:** Consider libraries that excel in create operations
- **For file extraction only:** Consider libraries optimized for extraction
- **For mixed usage:** Choose libraries with balanced performance
- **For memory-constrained environments:** Consider memory usage alongside speed

## 🔄 Node.js Version Comparison

Performance differences across Node.js versions:

*Detailed version comparison analysis will be added in future updates.*

---

*Report generated automatically by [nodejs-zip-benchmark](https://github.com/your-repo/nodejs-zip-benchmark)*
