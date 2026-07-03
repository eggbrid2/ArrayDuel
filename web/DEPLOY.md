# 五行阵斗部署说明

基础玩法是静态网页。若启用内置大模型对手，需要服务器支持 PHP，并放置一个仅服务器可读的 AI 配置文件。

## 本地试玩

```bash
cd web
python3 -m http.server 5173
```

打开 `http://localhost:5173/`。

## 部署

把 `web/` 目录作为站点根目录部署即可。若要启用默认 AI 代理，还需要在服务器创建：

```php
<?php
return [
    'api_key' => '你的中转站 Key',
    'base_url' => 'https://cloud.omnimind.com.cn/',
    'model' => 'gpt-5.5',
];
```

推荐保存到：

```text
/www/server/arrayduel-ai-config.php
```

不要把这个配置文件提交到 Git。

常见平台：

- Vercel：导入项目后，Root Directory 选 `web`，Build Command 留空，Output Directory 留空或填 `.`。
- Netlify：Publish directory 选 `web`，Build command 留空。
- GitHub Pages：发布 `web` 目录中的静态文件。

手机访问部署后的网址后，可以通过浏览器菜单添加到主屏幕。
