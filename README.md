# メニュールーレット 🍲

AIがメニュー画像を解析して、ルーレットで選んでくれるWebアプリケーションです。

## 🌐 デモ

- **開発サーバー**: https://3000-ir5dw8a81deqz2nu7mn4i-3844e1b6.sandbox.novita.ai
- **GitHub Pages**: Coming soon
- **Cloudflare Pages**: Coming soon (オプション)

## ✨ 主な機能

### 現在実装済みの機能
- ✅ **AIメニュー解析**: 
  - **Gemini AI**: Google Gemini API を使用（API キー必要）
  - **Tesseract OCR**: 完全無料の OCR（API キー不要、フォールバック機能）
- ✅ **ルーレット抽選**: カラフルなルーレットアニメーションでランダム選択
- ✅ **メニュー管理**: 手動でメニューの追加・編集・削除が可能
- ✅ **ローカルストレージ**: メニューリストを自動保存
- ✅ **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- ✅ **サウンドエフェクト**: ルーレット回転時とストップ時の効果音
- ✅ **サンプルデータ**: デモ用のサンプルメニュー読み込み機能
- ✅ **自動フォールバック**: API 制限時に無料 OCR へ自動切り替え

### 機能エントリポイント (URI)

| パス | 説明 |
|------|------|
| `/` | メインアプリケーション画面 |

### まだ実装されていない機能
- ⏳ メニュー画像のプレビュー表示
- ⏳ 過去の抽選履歴機能
- ⏳ メニューカテゴリ分類
- ⏳ お気に入りメニュー機能
- ⏳ 複数メニューリストの保存・切り替え

## 🏗️ 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite 6
- **スタイリング**: TailwindCSS (CDN)
- **アイコン**: Lucide React
- **AI/OCR**: 
  - Google Gemini API (オプション - API キー必要)
  - Tesseract.js (完全無料 - API キー不要)
- **デプロイ**: GitHub Pages / Cloudflare Pages

## 📊 データモデル

### MenuItem
```typescript
interface MenuItem {
  id: string;        // UUID
  name: string;      // メニュー名
}
```

### RouletteState
```typescript
type RouletteState = 'idle' | 'spinning' | 'slowing' | 'finished';
```

### ストレージ
- **LocalStorage**: `menu_roulette_items_v5` キーでメニューリストを保存
- **永続化**: メニューリストの変更時に自動保存

## 🚀 使い方

### 1. メニューを読み込む
- **写真スキャン**: メニュー写真をアップロードして AI に解析させる
- **手動入力**: メニュー名を入力して追加
- **サンプルデータ**: デモ用のサンプルメニューを読み込む

### 2. ルーレットを回す
1. 「スタート！」ボタンをクリック
2. ルーレットが回り始める
3. 「ストップ！」ボタンで停止
4. 選ばれたメニューが表示される

### 3. メニューを編集
- 各メニュー項目にマウスオーバーで編集・削除ボタンが表示
- メニューリストは自動保存される

## 🔧 ローカル開発

### 前提条件
- Node.js 18+
- Gemini API キー ([こちら](https://aistudio.google.com/apikey)で取得)

### セットアップ

```bash
# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.local に GEMINI_API_KEY を設定

# 開発サーバーを起動
npm run dev
```

### ビルド

```bash
# プロダクションビルド
npm run build

# プレビュー
npm run preview
```

## 📦 デプロイ

### オプション 1: GitHub Pages (推奨)

#### 自動デプロイ (GitHub Actions)

1. **リポジトリを作成してプッシュ**
```bash
git remote add origin https://github.com/YOUR_USERNAME/menu-roulette.git
git push -u origin main
```

2. **GitHub Secrets を設定**
   - GitHub リポジトリの Settings → Secrets and variables → Actions
   - `GEMINI_API_KEY` を追加（あなたの Gemini API キー）

3. **GitHub Pages を有効化**
   - Settings → Pages
   - Source: "GitHub Actions" を選択

4. **自動デプロイ**
   - main ブランチにプッシュすると自動的にデプロイされます
   - デプロイ先: `https://YOUR_USERNAME.github.io/menu-roulette/`

#### 手動デプロイ

```bash
# gh-pages パッケージをインストール (初回のみ)
npm install

# ビルドして GitHub Pages にデプロイ
npm run deploy:github
```

### オプション 2: Cloudflare Pages

```bash
# ビルドしてデプロイ
npm run deploy:cloudflare:prod
```

Cloudflare Pages のダッシュボードで `GEMINI_API_KEY` 環境変数を設定してください。

## 🎯 次のステップ

1. **GitHub へのプッシュ** - コードをリポジトリに保存
2. **GitHub Pages デプロイ** - 無料で公開
3. **メニュー履歴機能** - 過去の抽選結果を保存
4. **カテゴリ機能** - メニューをカテゴリ分け
5. **画像プレビュー** - アップロードした画像を表示

## 📝 プロジェクト構造

```
webapp/
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions デプロイ設定
├── src/
│   ├── App.tsx              # メインアプリケーション
│   ├── index.tsx            # エントリポイント
│   ├── types.ts             # TypeScript 型定義
│   ├── components/
│   │   ├── MenuManager.tsx  # メニュー管理コンポーネント
│   │   └── Roulette.tsx     # ルーレットコンポーネント
│   └── services/
│       ├── geminiService.ts # Gemini API 連携
│       └── audioService.ts  # サウンドエフェクト
├── public/                  # 静的ファイル
├── index.html              # HTML テンプレート
├── vite.config.ts          # Vite 設定
├── wrangler.jsonc          # Cloudflare 設定 (オプション)
├── package.json            # 依存関係
└── ecosystem.config.cjs    # PM2 設定
```

## ⚠️ 重要な注意事項

### 画像解析について
このアプリは2つの方法で画像を解析します：

#### 1. **Gemini API（推奨 - 高精度）**
- 高精度な AI 画像解析
- API キーが必要（無料枠: 15リクエスト/分）
- API キー: https://aistudio.google.com/apikey

#### 2. **Tesseract OCR（完全無料 - フォールバック）**
- API キー不要
- ブラウザ内で動作
- Gemini API の制限時に自動切り替え
- 手書き文字の認識精度は Gemini より低い

### API キーの設定（オプション）
- **GitHub Secrets** で `GEMINI_API_KEY` を設定すると Gemini API を使用
- 設定しない場合は自動的に Tesseract OCR を使用
- どちらも動作するので、API キーは任意です

### GitHub Pages の制約
- **静的サイトのみ**: サーバーサイド処理は不可
- **API 呼び出し**: ブラウザから直接 API を呼び出す
- **OCR 処理**: ブラウザ内で実行（Tesseract.js）

## 📄 ライセンス

MIT License

## 🙏 クレジット

元のリポジトリ: [OzzyWorks/menu-roulette](https://github.com/OzzyWorks/menu-roulette)

---

**最終更新**: 2026-01-10
**ステータス**: ✅ 開発環境で動作確認済み | ✅ GitHub Pages 対応完了

