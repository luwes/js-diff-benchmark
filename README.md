# js-diff-benchmark

Simple benchmark for testing your DOM diffing algorithm.

## Ranking

| Position | Library | Size | Speed | Notes |
| --- | --- | --- | --- | --- |
| 🏆 1 | [snabbdom](https://github.com/snabbdom/snabbdom) | 425B | ~242ms | |
| 2 | [udomdiff](https://github.com/WebReflection/udomdiff) | 460B | ~258ms | Fails some minimum operations tests. |
| 3 | [list-difference](https://github.com/paldepind/list-difference/) | 283B | ~310ms | Fails some minimum operations tests. |
| 4 | [stage0](https://github.com/Freak613/stage0) | 950B | ~330ms | Fails some minimum operations tests. |

<table>
  <tr>
    <td><img src="assets/Screen%20Shot%202020-04-14%20at%209.09.46%20AM.png" width=270></td>
    <td><img src="assets/Screen%20Shot%202020-04-14%20at%209.09.55%20AM.png" width=270></td>
    <td><img src="assets/Screen%20Shot%202020-04-14%20at%209.09.38%20AM.png" width=270></td>
  </tr>
 </table>

## Credits

Benchmark code based on the tests in [udomdiff](https://github.com/WebReflection/udomdiff).
