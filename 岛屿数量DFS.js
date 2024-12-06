function numsIsland(grid) {
  if (grid.length === 0) {
    return 0
  }
  let rows = grid.length
  let cols = grid[0].length
  let res = 0
  for (let r = 0; r < rows; r++){
    for (let c = 0; c < cols; c++){
      if (grid[r][c] === '1') {
        res++
        dfs(r, c)
      }
    }
  }
  function dfs(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] === '0') {
      return
    }
    grid[row][col] = '0'
    dfs(row - 1, col)
    dfs(row + 1, col)
    dfs(row, col + 1)
    dfs(row, col - 1)
  }
  return res
}
let grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]

console.log(numsIsland(grid))