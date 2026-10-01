# CERN Minecraft 项目

Nuxt 4 + Vue 3 + TypeScript + Tailwind CSS 4。支持浏览器语言检测的四语演示版（English、Français、简体中文、繁體中文），正式项目内容保留占位；首页专题与现实参考暂用注明出处的 CERN 官方照片，非 Minecraft 还原成果。

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
- `app/components/ImageCompare.vue`：现实参考与 Minecraft 演示图同屏展示，中间模糊渐变衔接。
- `app/components/CampusMap.vue`：园区概念导览。
- 网页实验室仅保留占位区域，未迁移或新增小游戏。
- `app/assets/css/main.css`：Tailwind 与项目视觉样式。

视觉与动效直接移植自新亭泪官网，页面栏目按 CERN 项目门户组织；桌面导航增加栏目展开菜单，首页使用带分类、标题、说明和入口的专题轮播。手机菜单采用 CERN 的全屏分组折叠方式，配色仍使用新亭泪黑白灰。临时使用 CERN 官方照片不表示项目获得官方认可或建立合作关系。`public/campus.svg` 是概念示意，非真实园区布局。

## 视觉与动效来源

- `app/assets/css/xintinglei.css` 摘自新亭泪 `style-v260906fix5.css`，保留配色、字体、玻璃面板、按钮扫光、背景、轮播与图片带样式。
- `SiteEffects.vue` 将原站方块转场、滚动显现、遮罩揭示、卡片倾斜、鼠标光晕与首屏视差适配到 Vue 生命周期，页面跳转由 Nuxt 接管。
- `HeroCarousel.vue` 保留图片擦除、缩放、自动播放和触摸切换，默认自动轮播；悬停或键盘焦点位于轮播中时暂停，离开后继续。尊重系统减少动态效果设置，隐藏页面暂停持续动画。
- `SiteHeader.vue` 在新亭泪桌面导航样式中加入 CERN 式栏目展开菜单；手机菜单使用分组折叠列表，沿用新亭泪黑白灰颜色；桌面及移动菜单均有开合动画。
- `public/demo/` 的 4 张 WebP 来自新亭泪原站，均为临时演示素材，非 CERN 实景；双图展示的 MC 一侧暂用其中一张占位。
- 网站图标暂用新亭泪原站的 `favicon.ico`。
- 原作：BaizhouziYou / [Xintinglei Website](https://github.com/BaizhouziYou/xintinglei-website)，AGPL-3.0-only；原许可保存在 `public/credits/xintinglei-LICENSE.txt`。
- `public/reference/` 的 CERN 官方照片为独立的临时参考素材，不属于新亭泪的 AGPL 许可范围；照片来源、原图地址与署名见 [SOURCES.md](public/reference/SOURCES.md)，配置以 `app/data/media.ts` 为准。

## GitHub Pages

`main` 推送后，GitHub Actions 自动检查、生成并部署到 https://xintingleiteam.github.io/cern-in-minecraft-web/ 。在仓库 Settings → Pages 中选择 GitHub Actions。工作流设置 `NUXT_APP_BASE_URL=/cern-in-minecraft-web/`，静态文件、图标及页面导航均使用此子路径。本地开发默认使用根路径。

## 语言设置

桌面顶栏与手机导航提供四语切换。优先恢复手动选择；没有有效的已保存选项时，按浏览器语言偏好顺序匹配 English、Français、简体中文和繁體中文，无法匹配时回退 English。中文根据文字体系和地区识别简繁（如 zh-CN、zh-SG 为简体，zh-TW、zh-HK、zh-MO 为繁体；明确的 Hans/Hant 标记优先）。仅手动选择保存在浏览器本地，自动检测不会覆盖偏好；存储不可用时仍可自动检测和切换。静态 HTML 保持英文，客户端初始化后应用选择，因此首次加载可能短暂显示英文。语言切换同步正文、导航、图片说明、无障碍标签和页面标题，路由与 GitHub Pages 子路径保持不变。翻译在 `app/data/locales/`，共享状态和插值在 `app/composables/useLocale.ts`。当前没有为各语言单独生成 URL。
