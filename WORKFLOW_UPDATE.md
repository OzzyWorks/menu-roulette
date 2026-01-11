# GitHub Actions ワークフローの更新手順

## 🔧 問題
`OPENAI_API_KEY` が GitHub Actions のビルドプロセスに渡されていないため、OpenAI API が使用できません。

## ✅ 解決方法：GitHub Web UI で直接編集

### 手順

1. **GitHub リポジトリにアクセス**
   - https://github.com/OzzyWorks/menu-roulette

2. **ワークフローファイルを開く**
   - `.github/workflows/deploy.yml` をクリック

3. **編集ボタンをクリック**
   - 右上の鉛筆アイコン（✏️）をクリック

4. **34-37行目を以下に変更**

変更前:
```yaml
      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

変更後:
```yaml
      - name: Build
        run: npm run build
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

**重要**: `OPENAI_API_KEY` の行を追加してください。インデントは `GEMINI_API_KEY` と同じにします。

5. **変更をコミット**
   - 下の "Commit changes" ボタンをクリック
   - コミットメッセージ: `Add OPENAI_API_KEY to workflow`
   - "Commit directly to the main branch" を選択
   - "Commit changes" をクリック

6. **自動デプロイ開始**
   - コミット後、自動的に GitHub Actions が起動します
   - https://github.com/OzzyWorks/menu-roulette/actions で進行状況を確認

7. **デプロイ完了を待つ**
   - 通常 2-3 分で完了
   - 完了後: https://ozzyworks.github.io/menu-roulette/ で確認

## 🧪 動作確認

デプロイ完了後、以下を確認してください：

1. https://ozzyworks.github.io/menu-roulette/ にアクセス
2. F12 でコンソールを開く
3. 画像をアップロード
4. コンソールに以下が表示されるはず：

```
API Keys check:
- Gemini: Found (39 chars)
- OpenAI: Found (51 chars)  ← これが表示されれば成功！
🎯 Trying Gemini API...
```

Gemini が制限に達すると：
```
⚠️ Gemini API 制限に達しました。OpenAI にフォールバック中...
🎯 OpenAI API で画像解析中...
✅ 成功！
```

## 📝 補足

### なぜ直接プッシュできないのか？
- GitHub App の権限制限により、ワークフローファイル (`.github/workflows/*.yml`) は Web UI からのみ編集可能です
- これはセキュリティ上の理由です

### Secrets の確認
GitHub Secrets が正しく設定されているか確認：
1. Settings → Secrets and variables → Actions
2. 以下の2つがあることを確認：
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`

---

**この手順を完了すれば、OpenAI API が正しく動作します！**
