# ZIP Library Benchmark Results

**Generated:** 2025-06-08T13:17:11.873Z

## System Information

- **Node.js Version:** v20.19.0
- **Platform:** linux (x64)
- **CPUs:** 2
- **Memory:** 8GB
- **Iterations:** 5

## Create Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 1.96 | 0.98 | 4.05 | 832 |
| fflate | 2.51 | 0.98 | 4.92 | 832 |
| yazl | 2.80 | 1.30 | 6.21 | 848 |
| uzip | 4.02 | 2.36 | 6.32 | 832 |
| adm-zip | 4.90 | 1.25 | 10.61 | 1,893 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 8.28 | 6.53 | 12.10 | 832 |
| adm-zip | 32.04 | 29.05 | 38.77 | 845 |
| yazl | 46.98 | 32.70 | 71.10 | 832 |
| uzip | 62.60 | 39.68 | 119.05 | 832 |
| fflate | 125.29 | 92.59 | 156.22 | 832 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 87.10 | 64.22 | 120.22 | 832 |
| adm-zip | 275.77 | 260.22 | 288.88 | 832 |
| yazl | 322.07 | 302.48 | 352.23 | 832 |
| fflate | 427.77 | 375.26 | 476.38 | 832 |
| uzip | 490.63 | 427.22 | 578.78 | 832 |

## Extract Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| uzip | 1.36 | 1.00 | 1.79 | 0 |
| jszip | 1.51 | 0.67 | 4.32 | 0 |
| adm-zip | 2.24 | 0.95 | 6.16 | 0 |
| fflate | 2.57 | 0.82 | 5.06 | 0 |
| yauzl | 3.28 | 1.26 | 10.51 | 0 |
| node-stream-zip | 4.21 | 1.20 | 11.14 | 0 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 2.23 | 1.94 | 2.49 | 0 |
| uzip | 3.61 | 2.49 | 4.89 | 0 |
| adm-zip | 8.33 | 7.69 | 9.27 | 0 |
| yauzl | 15.14 | 12.45 | 17.71 | 0 |
| jszip | 15.59 | 9.05 | 31.38 | 0 |
| node-stream-zip | 36.24 | 26.58 | 61.17 | 0 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 13.40 | 11.02 | 17.20 | 0 |
| uzip | 21.10 | 16.38 | 26.47 | 0 |
| adm-zip | 54.31 | 51.02 | 60.83 | 0 |
| yauzl | 86.43 | 71.11 | 102.13 | 0 |
| jszip | 175.42 | 151.65 | 200.17 | 0 |
| node-stream-zip | 332.55 | 241.78 | 362.33 | 0 |

