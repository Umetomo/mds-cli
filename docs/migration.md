# 移行可能な項目と移行できない項目

## 移行可能な項目

- Publicチャンネル
- アーカイブされたチャンネル
- チャンネルのトピック
- チャンネルのメッセージ
- チャンネルのピン留めアイテム
- チャンネルのリプライメッセージ
- メッセージの添付ファイル <span style="color:crimson;">※1</span>

<span style="color:crimson;">※2</span> 基本的にメッセージの添付ファイルはそのままDiscordに移行されますが、  
Discordの最大ファイルアップロードサイズを超えたメッセージの添付ファイルはファイルURLとして移行されます  

## 移行できない項目

- **Privateチャンネル** <span style="color:crimson;">※1</span>
- チャンネルの関連ページ
- チャンネルの説明
- カスタムセクション <span style="color:crimson;">※2</span>
- ユーザー
- ユーザーのDM(ダイレクトメッセージ)
- Bot
- リンク付き文字列 <span style="color:crimson;">※3</span>

<span style="color:crimson;">※1</span> 通常のエクスポートデータはPrivateチャンネルには含まれていないため、基本的にPrivateチャンネルの移行ができません  
Slackに申請して審査を受け、全てのチャンネルのエクスポートデータを取得できた場合、移行できる可能性がありますが、  
SlackからDiscordへの移行を理由に申請をしても審査が通らなかったため、未検証です  

<span style="color:crimson;">※2</span> Slackには[カスタムセクション](https://slack.com/intl/ja-jp/help/articles/360043207674-%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%82%BB%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%82%B5%E3%82%A4%E3%83%89%E3%83%90%E3%83%BC%E3%82%92%E6%95%B4%E7%90%86%E3%81%99%E3%82%8B)という個人単位でチャンネルのカテゴライズを行える機能があります  
Discordでは現在個人単位でチャンネルのカテゴライズを行える機能がないため、移行できません  

<span style="color:crimson;">※3</span> Discordではリンク付き文字列を表現できないため、単なるURLのリンクに置換されます  
