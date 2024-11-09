
// 题目3： 当前有100个任务，请编写代码执行这些任务，要求最高支持5个任务并发（
// 请设计 Task 类，并编写代码按要求执行它们）。

class Task {
    constructor(id) {
        this.id = id;
    }

    // 模拟任务执行
    execute() {
        return new Promise((resolve) => {
            console.log(`任务 ${this.id} 开始执行`);
            setTimeout(() => {
                console.log(`任务 ${this.id} 执行完成`);
                resolve();
            }, Math.random() * 2000); // 随机延迟 0-2 秒
        });
    }
}

// 执行任务的函数
async function executeTasks(tasks, maxConcurrent) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const promise = task.execute().then(() => {
            executing.delete(promise);
        });

        executing.add(promise);
        results.push(promise);

        // 控制并发数量
        if (executing.size >= maxConcurrent) {
            await Promise.race(executing);
        }
    }

    // 等待所有任务完成
    await Promise.all(results);
}

// 创建 100 个任务
const tasks = Array.from({ length: 100 }, (_, i) => new Task(i + 1));
console.log(tasks)

// 执行任务，最大并发 5 个
executeTasks(tasks, 5)
    .then((res) => console.log("所有任务执行完成",res))
    .catch(err => console.error("任务执行出错", err));
