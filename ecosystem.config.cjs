module.exports = {
  apps: [
    {
      name: "trello-clone-web",
      script: "cmd",
      args: "/c npm run preview", // Chạy npm trong cmd
      interpreter: "none", // Không cần interpreter
      autorestart: true,
      watch: false,
    },
  ],
}; 