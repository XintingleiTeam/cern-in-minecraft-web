# CERN Minecraft 项目

Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS 4。简体中文演示版，正式项目内容保留占位；首页专题与现实参考暂用注明出处的 CERN 官方照片，非 Minecraft 还原成果。

## 本地运行

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:3000。

## 检查与构建

```sh
npm run typecheck
npm run generate
npm test
```

`generate` 生成可独立部署的 `.output/public`。`npm test` 检查生成的静态页面；浏览器交互检查需要运行预览以及端口 9222 的独立 Chrome 调试实例：`npm test -- --browser`。可通过 `DEMO_URL` 指定预览地址。

## 页面与内容

- `app/pages/`：首页、项目介绍、园区目录与建筑详情、科教展馆与展区详情、参观指南。
- `app/data/catalog.ts`：建筑与展区占位目录。
- `app/data/media.ts`：CERN 临时参考照片、署名、来源与首页专题配置。
- `app/components/ImageCompare.vue`：现实参考 / Minecraft 还原切换。
- `app/components/CampusMap.vue`：园区概念导览。
- 网页实验室仅保留占位区域，未迁移或新增小游戏。
- `app/assets/css/main.css`：Tailwind 与项目视觉样式。

视觉与动效直接移植自新亭泪官网，页面栏目按 CERN 项目门户组织；桌面导航增加栏目展开菜单，首页使用带分类、标题、说明和入口的专题轮播。手机菜单采用 CERN 的全屏分组折叠方式，配色仍使用新亭泪黑白灰。临时使用 CERN 官方照片不表示项目获得官方认可或建立合作关系。`public/campus.svg` 是概念示意，非真实园区布局。

## 视觉与动效来源

- `app/assets/css/xintinglei.css` 摘自新亭泪 `style-v260906fix5.css`，保留配色、字体、玻璃面板、按钮扫光、背景、轮播与图片带样式。
- `SiteEffects.vue` 将原站方块转场、滚动显现、遮罩揭示、卡片倾斜、鼠标光晕与首屏视差适配到 Vue 生命周期，页面跳转由 Nuxt 接管。
- `HeroCarousel.vue` 保留图片擦除、缩放、自动播放和触摸切换，增加暂停控制。页脚可暂停全站动效；尊重系统减少动态效果设置，隐藏页面暂停持续动画。
- `SiteHeader.vue` 在新亭泪桌面导航样式中加入 CERN 式栏目展开菜单；手机菜单使用分组折叠列表，沿用新亭泪黑白灰颜色。
- `public/demo/` 的 4 张 WebP 来自新亭泪原站，均为临时演示素材，非 CERN 实景。
- 网站图标暂用新亭泪原站的 `favicon.ico`。
- 原作：BaizhouziYou / [Xintinglei Website](https://github.com/BaizhouziYou/xintinglei-website)，AGPL-3.0-only；原许可保存在 `public/credits/xintinglei-LICENSE.txt`。
- `public/reference/` 的 CERN 官方照片为独立的临时参考素材，不属于新亭泪的 AGPL 许可范围；照片来源、原图地址与署名见 [SOURCES.md](public/reference/SOURCES.md)，配置以 `app/data/media.ts` 为准。

## GitHub Pages

`main` 推送后，GitHub Actions 自动检查、生成并部署到 https://xintingleiteam.github.io/cern-in-minecraft-web/ 。在仓库 Settings → Pages 中选择 GitHub Actions。工作流设置 `NUXT_APP_BASE_URL=/cern-in-minecraft-web/`，静态文件、图标及页面导航均使用此子路径。本地开发默认使用根路径。
