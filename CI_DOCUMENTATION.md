# CI/CD Documentation

このプロジェクトでは、複数のGitHub Actionsワークフローを使用してベンチマークの自動実行と監視を行っています。

## ワークフロー概要

### 1. ZIP Library Benchmark (`benchmark.yml`)
**メインのベンチマークワークフロー**

- **トリガー**: 
  - Push to main/develop branches
  - Pull requests to main
  - 週次スケジュール (日曜日 2:00 UTC)
  - 手動実行

- **機能**:
  - 複数のNode.jsバージョン (18, 20, 22) でベンチマーク実行
  - 結果の統合とレポート生成
  - READMEの自動更新
  - GitHub Pagesでの結果公開
  - 結果のアーカイブ保存

### 2. PR Benchmark Test (`pr-benchmark.yml`)
**プルリクエスト用の軽量テスト**

- **トリガー**: 
  - Pull requests (ベンチマーク関連ファイルの変更時)

- **機能**:
  - 高速な動作確認 (2回のイテレーション)
  - PRコメントでの結果通知
  - 基本的な機能テスト

### 3. Benchmark Health Check (`health-check.yml`)
**システムの健全性監視**

- **トリガー**: 
  - 日次スケジュール (毎日 6:00 UTC)
  - 手動実行

- **機能**:
  - 必要ファイルの存在確認
  - 基本ベンチマークの実行テスト
  - 障害時のIssue自動作成
  - 復旧時のIssue自動クローズ

### 4. Performance Regression Check (`regression-check.yml`)
**パフォーマンス回帰の検出**

- **トリガー**: 
  - 週次スケジュール (水曜日 3:00 UTC)
  - 手動実行

- **機能**:
  - 詳細なベンチマーク実行 (10回のイテレーション)
  - パフォーマンス閾値チェック
  - 回帰検出時のIssue作成
  - 回帰レポートの生成

## 設定されたPermissions

すべてのワークフローで適切な権限が設定されています：

- `contents: write` - ファイルの読み書き
- `pull-requests: write` - PRコメントの投稿
- `pages: write` - GitHub Pagesへのデプロイ
- `id-token: write` - OIDC認証
- `issues: write` - Issue作成・更新

## セキュリティ設定

- タイムアウト設定によるリソース保護
- エラーハンドリングと適切な終了コード
- 機密情報の漏洩防止
- 最小限の権限設定

## 監視とアラート

### 自動Issue作成
以下の場合に自動的にIssueが作成されます：

1. **Health Check失敗**: `benchmark-health` ラベル
2. **Performance Regression**: `performance-regression` ラベル

### 通知機能
- PRでのベンチマーク結果コメント
- 週次レポートの自動生成
- GitHub Pagesでの結果公開

## トラブルシューティング

### よくある問題

1. **ベンチマークがタイムアウトする**
   - 25分のタイムアウトが設定されています
   - イテレーション数を減らして再実行してください

2. **結果ファイルが生成されない**
   - `results/` ディレクトリの権限を確認
   - ベンチマークスクリプトのエラーログを確認

3. **GitHub Pages デプロイが失敗する**
   - リポジトリ設定でPagesが有効になっているか確認
   - 必要な権限が設定されているか確認

### ログの確認方法

1. GitHub Actions タブでワークフロー実行を確認
2. 失敗したステップのログを詳細に確認
3. Artifacts から生成されたレポートをダウンロード

## カスタマイズ

### イテレーション数の変更
手動実行時にイテレーション数を指定できます：

```yaml
inputs:
  iterations:
    description: 'Number of benchmark iterations'
    required: false
    default: '5'
```

### スケジュールの変更
各ワークフローのcron設定を変更できます：

```yaml
schedule:
  - cron: '0 2 * * 0'  # 毎週日曜日 2:00 UTC
```

### 新しいライブラリの追加
1. `benchmark/index.js` にライブラリを追加
2. `package.json` に依存関係を追加
3. テストを実行して動作確認

## メンテナンス

### 定期的な確認事項
- [ ] 週次レポートの内容確認
- [ ] Health Check の状態確認
- [ ] アーカイブされた結果の容量確認
- [ ] 依存関係の更新確認

### アップデート手順
1. 新機能のテスト実装
2. PR作成とレビュー
3. メインブランチへのマージ
4. 自動ベンチマーク実行の確認

## リソース

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Node.js ベンチマークベストプラクティス](https://nodejs.org/en/docs/guides/simple-profiling/)
- [ZIP ライブラリ比較資料](./README.md#libraries-tested)
