# GitHub Pages デプロイ手順

## ✅ コードは GitHub にプッシュ済み

リポジトリ: https://github.com/OzzyWorks/menu-roulette

## 🚀 GitHub Pages デプロイ手順

### オプション 1: GitHub Actions（推奨）

GitHub Actions ワークフローファイルは `workflows` 権限の制限により自動プッシュできませんでした。
以下の手順で手動で追加してください：

1. **GitHub リポジトリにアクセス**
   - https://github.com/OzzyWorks/menu-roulette にアクセス

2. **ワークフローファイルを作成**
   - 「Add file」→「Create new file」をクリック
   - ファイル名: `.github/workflows/deploy.yml`
   - 以下の内容をコピー＆ペースト：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Commit new file** をクリック

4. **GitHub Secrets を設定**
   - Settings → Secrets and variables → Actions
   - 「New repository secret」をクリック
   - Name: `GEMINI_API_KEY`
   - Secret: あなたの Gemini API キー
   - 「Add secret」をクリック

5. **GitHub Pages を有効化**
   - Settings → Pages
   - Source: 「GitHub Actions」を選択

6. **デプロイ完了を待つ**
   - Actions タブでデプロイの進行状況を確認
   - デプロイ完了後: https://OzzyWorks.github.io/menu-roulette/ にアクセス

### オプション 2: 手動デプロイ（gh-pages コマンド）

ローカルから直接デプロイする場合：

```bash
# ビルドして GitHub Pages にデプロイ
npm run deploy:github
```

この方法では GitHub Actions は不要ですが、デプロイは手動で行う必要があります。

## 📝 重要な注意事項

### Gemini API キーのセキュリティ

このアプリはブラウザから直接 Gemini API を呼び出すため、API キーがビルドに埋め込まれます。

**推奨する対策:**

1. **API キーの使用量制限を設定**
   - https://aistudio.google.com/apikey でキーの使用量を制限

2. **HTTP リファラー制限を設定**（より安全）
   - Google Cloud Console で新しい API キーを作成
   - Application restrictions → HTTP referrers を選択
   - 以下を追加：
     - `https://OzzyWorks.github.io/*`
     - `http://localhost:3000/*` (ローカル開発用)

3. **代替案: Cloudflare Workers でプロキシ API を作成**
   - より安全な方法として、API キーをサーバーサイドで管理
   - フロントエンドからはプロキシ経由で呼び出し

## 🎯 デプロイ後の URL

- **GitHub Pages**: https://OzzyWorks.github.io/menu-roulette/
- **開発サーバー**: https://3000-ir5dw8a81deqz2nu7mn4i-3844e1b6.sandbox.novita.ai

---

**最終更新**: 2026-01-10
