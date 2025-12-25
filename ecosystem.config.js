module.exports = {
  apps : [{
    name: "task-management-app",
    script: "./dist/main.js",
    cwd: "/home/ubuntu/task-management",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      STAGE: "prod",
      PORT: 3009 // Standard port, not sensitive
    }
  }]
}