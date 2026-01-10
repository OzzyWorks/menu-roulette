# メニュールーレット 🍲

AIがメニュー画像を解析して、ルーレットで選んでくれるWebアプリケーションです。

## 🌐 デモ

- **開発サーバー**: https://3000-ir5dw8a81deqz2nu7mn4i-3844e1b6.sandbox.novita.ai
- **本番デプロイ**: Coming soon (Cloudflare Pages)

## ✨ 主な機能

### 現在実装済みの機能
- ✅ **AIメニュー解析**: Gemini AI を使用してメニュー写真から料理名を自動抽出
- ✅ **ルーレット抽選**: カラフルなルーレットアニメーションでランダム選択
- ✅ **メニュー管理**: 手動でメニューの追加・編集・削除が可能
- ✅ **ローカルストレージ**: メニューリストを自動保存
- ✅ **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- ✅ **サウンドエフェクト**: ルーレット回転時とストップ時の効果音
- ✅ **サンプルデータ**: デモ用のサンプルメニュー読み込み機能

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
- **AI**: Google Gemini API
- **デプロイ**: Cloudflare Pages (予定)

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

### Cloudflare Pages へのデプロイ (予定)

```bash
# ビルドしてデプロイ
npm run deploy:prod
```

### 環境変数の設定
Cloudflare Pages のダッシュボードで以下の環境変数を設定してください：
- `GEMINI_API_KEY`: Google Gemini API キー

## 🎯 次のステップ

1. **GitHub へのプッシュ** - コードをリポジトリに保存
2. **Cloudflare Pages デプロイ** - 本番環境へデプロイ
3. **メニュー履歴機能** - 過去の抽選結果を保存
4. **カテゴリ機能** - メニューをカテゴリ分け
5. **画像プレビュー** - アップロードした画像を表示

## 📝 プロジェクト構造

```
webapp/
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
├── wrangler.jsonc          # Cloudflare 設定
├── package.json            # 依存関係
└── ecosystem.config.cjs    # PM2 設定
```

## 📄 ライセンス

MIT License

## 🙏 クレジット

元のリポジトリ: [OzzyWorks/menu-roulette](https://github.com/OzzyWorks/menu-roulette)

---

**最終更新**: 2026-01-10
**ステータス**: ✅ 開発環境で動作確認済み | ⏳ 本番デプロイ待ち
