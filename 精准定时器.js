class PreciseTimer {
    constructor(callback, interval) {
        this.callback = callback; // 回调函数
        this.interval = interval; // 间隔时间（毫秒）
        this.startTime = Date.now(); // 初始化开始时间
        this.timerId = null; // 定时器 ID
    }

    start() {
        this.scheduleNextTick(); // 开始调度下一个执行
    }

    scheduleNextTick() {
        const currentTime = Date.now(); // 当前时间
        const elapsed = currentTime - this.startTime; // 计算已过去的时间

        console.log("Elapsed time:", elapsed); // 打印 elapsed

        // 计算下次执行的延迟
        const delay = this.interval - (elapsed % this.interval);
        
        // 使用 setTimeout 调度下一次执行
        this.timerId = setTimeout(() => {
            this.callback(); // 执行回调
            // 更新 startTime 为当前时间
            this.startTime = Date.now(); 
            this.scheduleNextTick(); // 继续调度下一个
        }, delay);
    }

    stop() {
        clearTimeout(this.timerId); // 清除定时器
    }
}

// 使用示例
const timer = new PreciseTimer(() => {
    console.log("任务执行时间：" + new Date().toLocaleTimeString());
}, 1000); // 每秒执行一次

// 启动计时器
timer.start();
