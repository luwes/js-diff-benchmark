# js-diff-benchmark

Simple benchmark for testing your DOM diffing algorithm.

## Ranking (on browser results)

| Position | Library                                                             | Size |
| -------- | ------------------------------------------------------------------- | ---- |
| 🏆 1     | [udomdiff](https://github.com/WebReflection/udomdiff)               | 388B |
| 2        | [snabbdom](https://github.com/snabbdom/snabbdom)                    | 412B |
| 3        | [list-difference](https://github.com/paldepind/list-difference/)    | 281B |
| 4        | [spect](https://github.com/spectjs/spect)                           | 208B |
| 5        | [stage0](https://github.com/Freak613/stage0)                        | 941B |
| 6        | [heckel](https://johnresig.com/projects/javascript-diff-algorithm/) | 449B |

## Browser results (Chrome 89, 6x CPU throttling)

<img src="assets/Screenshot 2021-04-07 at 20.58.33.png" alt="js-diff-benchmark">

## Node results (Node 14, with [dommy](https://github.com/WebReflection/udomdiff/blob/master/test/dommy.js))

<img src="assets/Screenshot 2021-04-10 at 21.10.44.png" alt="js-diff-benchmark">

## Credits

Benchmark code based on the tests in [udomdiff](https://github.com/WebReflection/udomdiff).
