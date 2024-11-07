// 行星碰撞
// 给定一个整数数组 asteroids，表示在同一行的行星。
// 对于数组中的每一个元素，其绝对值表示行星的大小，正负表示行星的移动方向（正表示向右移动，负表示向左移动）。每一颗行星以相同的速度移动。
// 找出碰撞后剩下的所有行星。碰撞规则：两个行星相互碰撞，较小的行星会爆炸。如果两颗行星大小相同，则两颗行星都会爆炸。两颗移动方向相同的行星，永远不会发生碰撞。

// 示例 1：
// 输入：asteroids = [-2,5,10,-5]
// 输出：[-2,5,10]
// 解释：10 和 -5 碰撞后只剩下 10 。 5 和 10 永远不会发生碰撞。

// 示例 2：
// 输入：asteroids = [8,-8]
// 输出：[]
// 解释：8 和 -8 碰撞后，两者都发生爆炸。

// 示例 3：
// 输入：asteroids = [10,2,-5]
// 输出：[10]
// 解释：2 和 -5 发生碰撞后剩下 -5 。10 和 -5 发生碰撞后剩下 10 。

// 示例 4
// [-2,3,10, 8,9,-10,2,-3,2] 
// [-2,2]
// 提示：
// 2 <= asteroids.length <= 10000
// -1000 <= asteroids[i] <= 1000
// asteroids[i] !=0

// function asteroidCollision(asteroids) {
//   let res = []
//   for (let i = 0; i < asteroids.length - 1; i++) { 
//     let cur = asteroids[i]
//     let next = asteroids[i + 1]
//     if ((cur > 0 && next < 0) ) { 
//       if (Math.abs(cur) > Math.abs(next)) { 
//         if (cur === res[res.length - 1]) {
//           res.pop()
//         }
//         res.push(cur)
//       } else if (Math.abs(cur) < Math.abs(next)) {
//         if (res[res.length - 1] > 0 && next < 0) {
//           if (Math.abs(next) >= Math.abs(res[res.length - 1])) {
//             for (let j = res.length - 1; j >= 0; j--) { 
//               if (Math.abs(next) >= Math.abs(res[j]) && res[j] > 0) {
//                 res.pop()
//               }
//             }
//             res.push(next) 
//           }
//         } else {
//           res.push(next)
//         }
//       }
//     } else if ((cur > 0 && next > 0) || (cur < 0 && next > 0)) { 
//       res.push(cur)
//     }
//   }
//   return res
// }
function asteroidCollision(asteroids) {
  const stack = [];
  
  for (const asteroid of asteroids) {
    let shouldAdd = true;
    
    // 只有当当前行星向左移动（负数）且栈顶有向右移动的行星（正数）时才可能发生碰撞
    while (
      stack.length > 0 && 
      asteroid < 0 && 
      stack[stack.length - 1] > 0
    ) {
      // 如果栈顶行星质量更小，它会爆炸，继续检查下一个栈顶行星
      if (stack[stack.length - 1] < -asteroid) {
        stack.pop();
        continue;
      } 
      // 如果栈顶行星质量相等，都会爆炸
      else if (stack[stack.length - 1] === -asteroid) {
        stack.pop();
        shouldAdd = false;
        break;
      }
      // 如果栈顶行星质量更大，当前行星爆炸
      else {
        shouldAdd = false;
        break;
      }
    }
    
    if (shouldAdd) {
      stack.push(asteroid);
    }
  }
  
  return stack;
}
console.log(asteroidCollision([-2,5,10,-5]))
console.log(asteroidCollision([8,-8]))
console.log(asteroidCollision([10, 2, -5]))
console.log(asteroidCollision([-2,3,10, 8,9,-10,2,-3,2] ))