# js-diff-benchmark

Simple benchmark for testing your DOM diffing algorithm.

## Ranking

| Position | Library | Size | Speed |
| --- | --- | --- | --- |
| 🏆 1 | [udomdiff](https://github.com/WebReflection/udomdiff) | 424B | ~255ms |
| 2 | [snabbdom](https://github.com/snabbdom/snabbdom) | 431B | ~257ms |
| 3 | [spect](https://github.com/spectjs/spect) | 299B | ~270ms |
| 4 | [list-difference](https://github.com/paldepind/list-difference/) | 283B | ~311ms |
| 5 | [stage0](https://github.com/Freak613/stage0) | 950B | ~358ms |
| 6 | [heckel](https://johnresig.com/projects/javascript-diff-algorithm/) | 450B | ~524ms |

---

<table>
  <tr>
    <td><img src="assets/Screen Shot 2020-04-15 at 9.22.21 AM.png" width=415></td>
    <td><img src="assets/Screen Shot 2020-04-15 at 9.22.29 AM.png" width=415></td>
  </tr>
 </table>

## Credits

Benchmark code based on the tests in [udomdiff](https://github.com/WebReflection/udomdiff).
