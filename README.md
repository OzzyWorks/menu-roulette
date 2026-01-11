# メニュールーレット 🍲

AIがメニュー画像を解析して、ルーレットで選んでくれるWebアプリケーションです。

## 🌐 デモ

- **開発サーバー**: https://3000-ir5dw8a81deqz2nu7mn4i-3844e1b6.sandbox.novita.ai
- **GitHub Pages**: Coming soon
- **Cloudflare Pages**: Coming soon (オプション)

## ✨ 主な機能

### 現在実装済みの機能
- ✅ **AIメニュー解析（3段階フォールバック）**: 
  1. **Gemini API**: Google Gemini API（最高精度、API キー必要）
  2. **OpenAI GPT-4o-mini**: OpenAI API（高精度、API キー必要）
  3. **Tesseract OCR**: 完全無料の OCR（API キー不要、最終手段）
- ✅ **ルーレット抽選**: カラフルなルーレットアニメーションでランダム選択
- ✅ **メニュー管理**: 手動でメニューの追加・編集・削除が可能
- ✅ **ローカルストレージ**: メニューリストを自動保存
- ✅ **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- ✅ **サウンドエフェクト**: ルーレット回転時とストップ時の効果音
- ✅ **サンプルデータ**: デモ用のサンプルメニュー読み込み機能
- ✅ **インテリジェントフォールバック**: API 制限時に自動で次の API へ切り替え

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
- **AI/OCR**（3段階フォールバック）: 
  1. Google Gemini API (優先 - 最高精度)
  2. OpenAI GPT-4o-mini (フォールバック - 高精度)
  3. Tesseract.js (最終手段 - 完全無料)
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

### 画像解析の3段階フォールバック

このアプリは**3つの方法**で画像を解析し、自動的にフォールバックします：

#### 優先順位 1: **Gemini API（最高精度）**
- 最も高精度な AI 画像解析
- API キーが必要
- 無料枠: 15リクエスト/分、1,500リクエスト/日
- API キー: https://aistudio.google.com/apikey
- 制限に達すると自動的に OpenAI にフォールバック

#### 優先順位 2: **OpenAI GPT-4o-mini（高精度）**
- 高精度な AI 画像解析
- API キーが必要
- 料金: 画像解析 $0.15/100万トークン（非常に安価）
- API キー: https://platform.openai.com/api-keys
- 無料クレジット: $5（初回登録時）
- Gemini が制限に達した場合に自動使用

#### 優先順位 3: **Tesseract OCR（完全無料）**
- API キー不要
- ブラウザ内で動作
- 全ての API が制限に達した場合に自動使用
- 手書き文字の認識精度は AI より低い

### フォールバックの動作

```
画像アップロード
    ↓
[1] Gemini API を試行
    ├─ 成功 → メニュー抽出完了 ✅
    └─ 失敗/制限 → [2] へ
         ↓
[2] OpenAI API を試行
    ├─ 成功 → メニュー抽出完了 ✅
    └─ 失敗/制限 → [3] へ
         ↓
[3] Tesseract OCR を使用
    └─ メニュー抽出完了 ✅
```

### API キーの設定（両方推奨）

#### GitHub Secrets で設定（推奨）
1. GitHub リポジトリの **Settings** → **Secrets and variables** → **Actions**
2. 以下の2つのシークレットを追加：
   - `GEMINI_API_KEY`: Gemini API キー
   - `OPENAI_API_KEY`: OpenAI API キー
3. 両方設定することで、一方が制限に達しても継続使用可能

#### ローカル開発時
`.env.local` ファイルを作成：
```bash
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 推奨設定

| シナリオ | 推奨設定 | 理由 |
|---------|---------|------|
| **個人利用** | Gemini のみ | 無料枠で十分 |
| **頻繁に使用** | Gemini + OpenAI | 制限時も継続使用可能 |
| **完全無料** | API キーなし | Tesseract のみ使用 |

## 📄 ライセンス

MIT License

## 🙏 クレジット

元のリポジトリ: [OzzyWorks/menu-roulette](https://github.com/OzzyWorks/menu-roulette)

---

**最終更新**: 2026-01-10
**ステータス**: ✅ 開発環境で動作確認済み | ✅ GitHub Pages 対応完了

