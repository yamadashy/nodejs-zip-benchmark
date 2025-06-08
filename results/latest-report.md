# ZIP Library Benchmark Results

**Generated:** 2025-06-08T12:45:41.585Z

## System Information

- **Node.js Version:** v20.19.0
- **Platform:** linux (x64)
- **CPUs:** 2
- **Memory:** 8GB
- **Iterations:** 3

## Create Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| adm-zip | 2.18 | 0.79 | 4.94 | 1,309 |
| jszip | 2.76 | 1.39 | 5.42 | 832 |
| yazl | 3.76 | 1.94 | 7.16 | 1,341 |
| fflate | 4.13 | 1.98 | 6.28 | 832 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 7.32 | 5.94 | 8.95 | 832 |
| adm-zip | 34.75 | 32.25 | 38.79 | 832 |
| yazl | 37.87 | 36.00 | 41.31 | 832 |
| fflate | 104.18 | 87.54 | 128.31 | 832 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 75.40 | 59.70 | 99.28 | 832 |
| adm-zip | 289.65 | 274.21 | 306.74 | 832 |
| yazl | 312.48 | 300.99 | 333.82 | 832 |
| fflate | 515.39 | 353.57 | 655.61 | 832 |

## Extract Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| adm-zip | 1.64 | 0.68 | 3.47 | 0 |
| fflate | 1.93 | 0.98 | 3.42 | 0 |
| jszip | 2.67 | 1.02 | 5.94 | 0 |
| node-stream-zip | 3.25 | 1.62 | 6.46 | 0 |
| yauzl | 7.23 | 1.47 | 18.34 | 0 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 3.04 | 2.69 | 3.67 | 0 |
| adm-zip | 7.42 | 7.40 | 7.45 | 0 |
| jszip | 14.64 | 9.11 | 22.45 | 0 |
| yauzl | 17.35 | 15.18 | 20.98 | 0 |
| node-stream-zip | 32.89 | 30.76 | 34.07 | 0 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 15.24 | 11.76 | 20.13 | 0 |
| adm-zip | 57.04 | 48.76 | 73.57 | 0 |
| yauzl | 102.84 | 92.04 | 111.45 | 0 |
| jszip | 154.44 | 144.04 | 164.87 | 0 |
| node-stream-zip | 232.65 | 217.70 | 251.99 | 0 |

