# 五行阵斗部署说明

这是一个纯静态网页游戏，不需要后端。

## 本地试玩

```bash
cd web
python3 -m http.server 5173
```

打开 `http://localhost:5173/`。

## 部署

把 `web/` 目录作为静态站点根目录部署即可。

常见平台：

- Vercel：导入项目后，Root Directory 选 `web`，Build Command 留空，Output Directory 留空或填 `.`。
- Netlify：Publish directory 选 `web`，Build command 留空。
- GitHub Pages：发布 `web` 目录中的静态文件。

手机访问部署后的网址后，可以通过浏览器菜单添加到主屏幕。
