### 依赖安装说明

采用pnpm monorepo管理依赖

需要在全局安装pnpm, 整个项目安装项目全局依赖，子项目分别安装子项目依赖


### 打包注意事项

1. 微前端架构每个子应用分别打包（为什么采用微前端：完全没有采用该架构的必要，因为工作后可能会用到，正好就拿来练手了）

2. 打包配置在每个vite.config.ts中，打包命令在package.json中, 输出路径需要修改outDir属性值
