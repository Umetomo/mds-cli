# 初回設定

下記の初回設定を順番に進めてください  
下記の設定は**移行元のSlackのワークスペース、移行先のDiscordのサーバーがあること**が前提です  

1. [direnvのインストール](#install-direnv)
2. [Voltaのインストール](#install-volta)
3. [DiscordBotの作成](#create-discord-bot)
4. [SlackBotの作成](#create-slack-bot)
5. [Slackのデータのエクスポート](#export-slack-data)
6. [環境変数の設定](#setting-environment-variables)
7. [実行環境の設定](#setting-execution-environment)

<h2 id="install-direnv">direnvのインストール</h2>

Node.jsの[OpenSSLのバージョンアップ](https://nodejs.org/ja/blog/vulnerability/mar-2022-security-releases/)に伴い、まだ動かないライブラリがあるため、OpenSSL3をレガシープロパイダーに戻す環境変数のオプションを有効にさせる必要がある  
[公式サイトのインストールガイド](https://github.com/direnv/direnv/blob/master/docs/installation.md)に沿って、direnvのインストールを行い、下記コマンドを実行することで、プロジェクトのディレクトリを開いた際に環境変数を自動有効化するようにする  

```zsh
direnv allow
```

<h2 id="install-volta">Voltaのインストール</h2>

Node.jsのバージョン管理のため、[公式サイトのスタートガイド](https://docs.volta.sh/guide/getting-started)に沿ってVoltaをインストールする

<h2 id="create-discord-bot">DiscordBotの作成</h2>

1. [DiscordのDeveloper Portalのページ](https://discord.com/developers/applications)で、「[公式サイトのスタートガイド](https://discord.com/developers/docs/getting-started)」などの記事を参考に任意の名前のBotを作成
2. Public Botのチェックを外し、DiscordBotを公開にしておく
3. OAuth2 > URL GeneratorでSCOPESの項目では「Bot」を、Bot Permissionsの項目では「Send Messages」、「Manage Channels」、「Manage Messages」にチェックを入れる
4. GENERATED URLの項目で生成されたURLを開いて、移行先のDiscordサーバーにDiscordBotを追加する
5. Bot > Build A Botの項目からDiscordBotのトークンを控えておく
6. Discordのアプリで、DiscordのサーバーIDを表示させるために、Discordのアプリの設定 > 詳細設定で開発者モードを有効化にする
7. Discordのアプリで、サーバーを右クリックで表示される「IDをコピー」の項目をクリックしてDiscordのサーバーIDを控えておく

<h2 id="create-slack-bot">SlackBotの作成</h2>

1. [Your Appsのページ](https://api.slack.com/apps)で、「[公式サイトのヘルプガイド](https://slack.com/intl/ja-jp/help/articles/115005265703-%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E3%81%A7%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B%E3%83%9C%E3%83%83%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90)」などの記事を参考に任意の名前のSlackBotを作成
2. Features > OAuth & Permissions > ScopesでBot Token Scopesの項目に「users:read」を追加する
3. Install Appで移行元のワークスペースにSlackBotを追加する
4. Bot User OAuth Tokenの項目にあるSlackBotのトークンを控えておく

<h2 id="export-slack-data">Slackのデータのエクスポート</h2>

1. [Slackのデータのエクスポートのページ](https://slack.com/services/export)で、「[ワークスペースのデータをエクスポートする](https://slack.com/intl/ja-jp/help/articles/201658943-%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88%E3%81%99%E3%82%8B)」などの記事を参考に、**ワークスペースのオーナー権限**でSlackのデータをエクスポートし、zipファイルをダウンロードする
2. zipファイルを解凍し、解凍したフォルダを「.src」にリネームしてこのリポジトリのトップに配置する

<h2 id="setting-environment-variables">環境変数の設定</h2>

下記のコマンドで、環境変数の設定ファイル`.env`を作成する  

```zsh
cp .env.sample .env
```

`.env`ファイルの環境変数の値に、SlackBotのトークン、DiscordBotのトークン、DiscordのサーバーIDなどの情報を設定する  

```zsh
export SLACK_BOT_TOKEN="" # SlackBotのトークン
export DISCORD_BOT_TOKEN="" # DiscordBotのトークン
export DISCORD_SERVER_ID="" # DiscordのサーバーID
```

<h2 id="setting-execution-environment">実行環境の設定</h2>

下記のコマンドで、VoltaでNode.jsとnpmをインストールする  

```zsh
volta install node@18.7.0 npm@8.15.1

npm install
```
