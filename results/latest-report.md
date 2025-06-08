# ZIP Library Benchmark Results

**Generated:** 2025-06-08T11:51:50.597Z

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
| jszip | 1.99 | 0.77 | 3.75 | 832 |
| yazl | 2.34 | 1.43 | 4.09 | 1,341 |
| fflate | 2.92 | 1.62 | 4.34 | 832 |
| adm-zip | 4.62 | 2.80 | 7.32 | 1,309 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 12.32 | 9.32 | 17.75 | 832 |
| adm-zip | 31.16 | 29.07 | 35.11 | 832 |
| yazl | 56.08 | 47.36 | 61.10 | 832 |
| fflate | 94.23 | 55.54 | 167.73 | 832 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 55.56 | 54.75 | 57.06 | 832 |
| adm-zip | 281.56 | 278.81 | 286.78 | 832 |
| yazl | 326.73 | 313.29 | 346.61 | 832 |
| fflate | 474.89 | 389.51 | 612.32 | 832 |

## Extract Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 0.55 | 0.22 | 1.19 | 0 |
| adm-zip | 1.98 | 0.93 | 2.98 | 0 |
| jszip | 2.02 | 0.61 | 4.49 | 0 |
| node-stream-zip | 3.02 | 1.61 | 4.92 | 0 |
| yauzl | 5.00 | 1.14 | 12.33 | 0 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 0.84 | 0.73 | 1.00 | 0 |
| adm-zip | 10.00 | 8.52 | 11.67 | 0 |
| yauzl | 24.02 | 15.14 | 32.54 | 0 |
| jszip | 26.86 | 23.17 | 31.65 | 0 |
| node-stream-zip | 37.49 | 34.58 | 40.75 | 0 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 5.40 | 3.96 | 7.31 | 0 |
| adm-zip | 49.95 | 46.01 | 53.93 | 0 |
| jszip | 84.95 | 77.77 | 90.32 | 0 |
| yauzl | 88.04 | 80.49 | 96.14 | 0 |
| node-stream-zip | 202.68 | 179.23 | 227.41 | 0 |

