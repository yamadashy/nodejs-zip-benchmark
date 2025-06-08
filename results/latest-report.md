# ZIP Library Benchmark Results

**Generated:** 2025-06-08T12:21:55.786Z

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
| adm-zip | 1.31 | 0.65 | 3.60 | 1,112 |
| jszip | 1.57 | 0.66 | 3.94 | 832 |
| yazl | 1.79 | 1.00 | 4.09 | 1,915 |
| fflate | 2.29 | 0.77 | 4.37 | 832 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 11.12 | 7.74 | 13.01 | 832 |
| adm-zip | 29.54 | 27.14 | 35.50 | 832 |
| yazl | 40.99 | 36.31 | 48.07 | 832 |
| fflate | 114.29 | 86.17 | 206.69 | 832 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 57.11 | 52.97 | 64.30 | 832 |
| yazl | 324.26 | 299.39 | 338.19 | 832 |
| adm-zip | 332.59 | 277.09 | 458.31 | 832 |
| fflate | 564.16 | 404.12 | 797.39 | 832 |

## Extract Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 1.00 | 0.60 | 2.35 | 0 |
| jszip | 1.46 | 0.65 | 3.92 | 0 |
| adm-zip | 1.99 | 0.67 | 5.31 | 0 |
| node-stream-zip | 2.01 | 1.18 | 4.36 | 0 |
| yauzl | 2.25 | 1.15 | 6.00 | 0 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 1.94 | 1.74 | 2.49 | 0 |
| adm-zip | 8.20 | 7.49 | 8.86 | 0 |
| yauzl | 14.14 | 11.27 | 18.68 | 0 |
| jszip | 21.86 | 15.83 | 29.57 | 0 |
| node-stream-zip | 38.75 | 26.27 | 58.57 | 0 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 13.41 | 10.99 | 16.20 | 0 |
| adm-zip | 63.18 | 59.05 | 73.76 | 0 |
| yauzl | 79.74 | 68.37 | 104.33 | 0 |
| jszip | 83.99 | 68.79 | 106.46 | 0 |
| node-stream-zip | 213.37 | 196.45 | 245.19 | 0 |

