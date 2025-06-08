# ZIP Library Benchmark Results

**Generated:** 2025-06-08T12:40:00.946Z

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
| jszip | 1.91 | 0.78 | 3.96 | 832 |
| adm-zip | 2.43 | 0.79 | 5.70 | 1,309 |
| yazl | 2.87 | 1.95 | 4.64 | 2,328 |
| fflate | 4.45 | 2.71 | 6.26 | 832 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 13.44 | 8.45 | 22.99 | 832 |
| adm-zip | 33.58 | 31.72 | 37.01 | 832 |
| yazl | 38.86 | 35.03 | 42.56 | 832 |
| fflate | 136.01 | 94.78 | 215.58 | 832 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 71.89 | 57.08 | 84.37 | 832 |
| adm-zip | 288.35 | 268.94 | 318.31 | 832 |
| yazl | 309.44 | 305.44 | 316.44 | 832 |
| fflate | 490.51 | 369.20 | 692.83 | 832 |

## Extract Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| adm-zip | 1.43 | 0.49 | 3.19 | 0 |
| fflate | 1.69 | 0.97 | 2.81 | 0 |
| jszip | 2.16 | 0.61 | 4.89 | 0 |
| node-stream-zip | 2.26 | 1.31 | 4.16 | 0 |
| yauzl | 4.67 | 1.02 | 11.73 | 0 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 2.01 | 1.80 | 2.24 | 0 |
| adm-zip | 7.89 | 7.83 | 7.97 | 0 |
| yauzl | 17.09 | 14.08 | 18.94 | 0 |
| jszip | 25.95 | 16.76 | 40.94 | 0 |
| node-stream-zip | 44.60 | 41.45 | 46.73 | 0 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 32.99 | 21.15 | 38.98 | 0 |
| adm-zip | 61.07 | 48.99 | 69.29 | 0 |
| jszip | 92.40 | 85.49 | 99.78 | 0 |
| yauzl | 109.92 | 91.10 | 128.40 | 0 |
| node-stream-zip | 237.77 | 186.74 | 310.30 | 0 |

