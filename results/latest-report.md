# ZIP Library Benchmark Results

**Generated:** 2025-06-08T12:14:40.499Z

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
| adm-zip | 2.46 | 0.85 | 4.93 | 1,309 |
| yazl | 3.68 | 1.79 | 7.02 | 1,341 |
| jszip | 4.47 | 1.13 | 9.32 | 832 |
| fflate | 9.39 | 7.30 | 12.22 | 832 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 8.76 | 7.33 | 10.30 | 832 |
| yazl | 37.21 | 34.61 | 39.74 | 832 |
| adm-zip | 51.49 | 48.40 | 53.31 | 832 |
| fflate | 98.20 | 89.42 | 103.69 | 832 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| jszip | 56.86 | 55.90 | 58.03 | 832 |
| adm-zip | 284.12 | 277.33 | 287.81 | 832 |
| yazl | 319.29 | 299.36 | 337.09 | 832 |
| fflate | 515.42 | 417.22 | 708.84 | 832 |

## Extract Performance

### Small Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| adm-zip | 1.06 | 0.48 | 2.15 | 0 |
| fflate | 2.67 | 0.77 | 4.65 | 0 |
| node-stream-zip | 3.58 | 1.96 | 6.78 | 0 |
| jszip | 5.65 | 2.13 | 7.88 | 0 |
| yauzl | 7.01 | 3.83 | 11.88 | 0 |

### Medium Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 2.91 | 2.66 | 3.25 | 0 |
| adm-zip | 9.85 | 7.58 | 13.13 | 0 |
| jszip | 17.25 | 10.10 | 31.24 | 0 |
| yauzl | 18.93 | 12.37 | 24.75 | 0 |
| node-stream-zip | 33.43 | 28.06 | 40.37 | 0 |

### Large Files

| Library | Average (ms) | Min (ms) | Max (ms) | Memory (bytes) |
|---------|--------------|----------|----------|----------------|
| fflate | 26.79 | 14.89 | 43.36 | 0 |
| adm-zip | 56.69 | 50.56 | 64.29 | 0 |
| jszip | 88.00 | 86.27 | 89.96 | 0 |
| yauzl | 90.11 | 81.42 | 101.90 | 0 |
| node-stream-zip | 220.73 | 189.22 | 241.52 | 0 |

