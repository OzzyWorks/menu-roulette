# デバッグ手順：API キーが正しく設定されているか確認

## 🔍 問題の特定

「ネットワークエラー」が表示されていますが、実際の原因は以下のいずれかです：

1. **API キーが空文字列** - ビルド時に埋め込まれていない
2. **CORS エラー** - ブラウザが API 呼び出しをブロック
3. **API キーが無効** - 認証エラー

## 📝 確認手順

### ステップ 1: GitHub Actions のビルドログを確認

1. https://github.com/OzzyWorks/menu-roulette/actions にアクセス
2. 最新のワークフロー実行をクリック
3. **build** ジョブをクリック
4. **Build** ステップを展開
5. ログに以下が表示されているか確認：

```
Build-time API keys:
- GEMINI_API_KEY: Set (39 chars)  ← これが表示されるべき
- OPENAI_API_KEY: Set (51 chars)  ← これが表示されるべき
```

**もし「Not set」と表示されている場合**:
- GitHub Secrets が正しく設定されていない
- ワークフローファイルで環境変数が渡されていない

### ステップ 2: ブラウザコンソールで API キーを確認

1. https://ozzyworks.github.io/menu-roulette/ にアクセス
2. F12 でコンソールを開く
3. 画像をアップロード
4. コンソールに表示されるログを確認：

```javascript
API Keys check:
- Gemini: Found (39 chars)  ← または "Not found"
- OpenAI: Found (51 chars)  ← または "Not found"
```

**もし "Not found" が表示される場合**:
- ビルド時に API キーが埋め込まれていない
- GitHub Actions のビルドログを確認

### ステップ 3: GitHub Secrets を再確認

1. https://github.com/OzzyWorks/menu-roulette/settings/secrets/actions にアクセス
2. 以下の2つの Secret が存在するか確認：
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`

**もし存在しない、または名前が違う場合**:
- 正しい名前で Secret を作成し直す
- 完全一致が必要（大文字小文字も含む）

### ステップ 4: 詳細なエラー情報を確認

ブラウザコンソールで以下の情報を確認してください：

```javascript
// Gemini エラー時
❌ Gemini API エラー: [詳細なエラーメッセージ]

// OpenAI エラー時
OpenAI API 詳細エラー: [詳細なエラーメッセージ]
Error type: [エラータイプ]
Error message: [エラーメッセージ]
Full error: [完全なエラー情報]
```

## 🔧 解決方法

### 解決策 1: GitHub Secrets の確認と再設定

1. **Secrets を削除**:
   - https://github.com/OzzyWorks/menu-roulette/settings/secrets/actions
   - `GEMINI_API_KEY` と `OPENAI_API_KEY` を削除

2. **Secrets を再作成**:
   - 「New repository secret」をクリック
   - Name: `GEMINI_API_KEY`
   - Secret: [あなたの Gemini API キー]
   - 「Add secret」をクリック
   - 同様に `OPENAI_API_KEY` も追加

3. **再デプロイ**:
   - リポジトリの Code タブに移動
   - 任意のファイル（README.md など）を編集
   - コミットして main ブランチにプッシュ
   - GitHub Actions が自動的に再ビルド・デプロイ

### 解決策 2: API キーをローカルストレージに設定（一時的）

もし GitHub Secrets の設定に問題がある場合、一時的にブラウザで API キーを設定できます：

1. https://ozzyworks.github.io/menu-roulette/ にアクセス
2. F12 でコンソールを開く
3. 以下を実行：

```javascript
// Gemini API キーを設定
localStorage.setItem('gemini_api_key', 'あなたのGemini APIキー');

// OpenAI API キーを設定
localStorage.setItem('openai_api_key', 'あなたのOpenAI APIキー');

// 確認
console.log('Gemini:', localStorage.getItem('gemini_api_key') ? 'Set' : 'Not set');
console.log('OpenAI:', localStorage.getItem('openai_api_key') ? 'Set' : 'Not set');
```

4. ページをリロード
5. 画像をアップロード

**注意**: この方法は一時的な解決策です。ページをリロードすると消えます。

### 解決策 3: ワークフローを手動でトリガー

1. https://github.com/OzzyWorks/menu-roulette/actions にアクセス
2. 左側の「Deploy to GitHub Pages」をクリック
3. 右上の「Run workflow」ボタンをクリック
4. 「Run workflow」を再度クリック
5. ビルドが完了するまで待つ（2-3分）

## 📊 現在の状況を教えてください

以下の情報を教えていただけますか？

1. **GitHub Actions のビルドログ**に何が表示されていますか？
   - `GEMINI_API_KEY: Set (XX chars)` または `Not set`？
   - `OPENAI_API_KEY: Set (XX chars)` または `Not set`？

2. **ブラウザコンソール**に何が表示されていますか？
   - `API Keys check:` の結果は？
   - 詳細なエラーメッセージは？

3. **GitHub Secrets**は正しく設定されていますか？
   - 2つの Secret が存在しますか？
   - 名前は完全一致していますか？

この情報があれば、正確に問題を特定できます！
