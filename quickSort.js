// 示例用法
const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(arr));
function quickSort(arr) {
  // 基线条件：如果数组长度为 0 或 1，直接返回，因为已经排序好了
  if (arr.length <= 1) {
      return arr;
  }
  // 选择基准值（pivot），通常选择数组的第一个元素
  let pivot = arr[0];
  // 创建两个子数组，存放小于和大于基准值的元素
  let left = [];
  let right = [];
  // 从第二个元素开始，依次比较每个元素与基准值的大小
  for (let i = 1; i < arr.length; i++) {
      if (arr[i] < pivot) {
          left.push(arr[i]); // 小于基准值的放入 left
      } else {
          right.push(arr[i]); // 大于等于基准值的放入 right
      }
  }
  // 递归地对 left 和 right 进行排序，并将结果合并
  return quickSort(left).concat(pivot, quickSort(right));
}
