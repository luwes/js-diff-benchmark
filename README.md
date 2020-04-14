# js-diff-benchmark

Simple benchmark for testing your DOM diffing algorithm.

## Ranking

| Position | Library | Size | Speed | Notes |
| --- | --- | --- | --- | --- |
| 1 | [udomdiff](https://github.com/WebReflection/udomdiff) | 460B | ~258ms | |
| 2 | [list-difference](https://github.com/paldepind/list-difference/) | 283B | ~310ms | Does not keep number of operations to a minimum for swapping. |
| 3 | [stage0](https://github.com/Freak613/stage0) | 950B | ~330ms | |

## Credits

Benchmark code based on the tests in [udomdiff](https://github.com/WebReflection/udomdiff).
