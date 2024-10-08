# 仕様

## Slackのデータの取得

下記の理由でメッセージの取得をSlackWebAPIからではなく、エクスポートデータから参照する仕様となっています  

- メッセージの総数によってはAPIを叩く回数が膨大になるため、できるだけAPIを叩く回数を減らして、移行時間を短縮するため
- メッセージのデータ取得が途中で失敗した場合、一から取得し直さなければいけないAll or Nothingになる手間を無くすため
- メッセージにユーザーID以外のユーザー情報が含まれないため、ユーザー情報を取得するためにAPIを叩く回数が増えるため <span style="color:crimson;">※1</span>

<span style="color:crimson;">※1</span> [conversations.history](https://api.slack.com/methods/conversations.history)のAPIで取得できるメッセージは、ユーザー情報がユーザーIDのみのため、ユーザー名などのユーザー情報を取得するためには[users.info](https://api.slack.com/methods/users.info)のAPIで取得する必要があります  

## SlackBotによるユーザー情報の取得

SlackBotはユーザー情報を取得し、メッセージの送信者情報を照合するために使用されています  
これはエクスポートデータの`users.json`のユーザのIDと、メッセージに記載されているユーザーのIDが異なり、  
エクスポートデータだけではメッセージの送信者情報が照合できない可能性があるためです  
特にBotは雛形となるアプリから生成されるため、ワークスペースにデプロイし直すとBotとしては別扱いとなるのか、新しいIDが振られるようになっています  
未確認ですが、ユーザーも解除済みユーザーの[アカウントを復活させる](https://slack.com/intl/ja-jp/help/articles/360002061747-%E3%83%A1%E3%83%B3%E3%83%90%E3%83%BC%E3%81%AE%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E3%82%92%E5%BE%A9%E6%B4%BB%E3%81%95%E3%81%9B%E3%82%8B)と、IDが新しく振られる可能性があります  

## 移行のオプション機能

移行のオプション機能として、下記の機能があります  
メッセージファイルをビルドする前に、`.dist/user.json`ファイルにDiscordのユーザーIDやユーザー名を手動で設定することで機能します  

- メッセージ内のメンションなどのユーザ名の変更
- 移行したPrivateチャンネルへのユーザーの自動join

## Privateチャンネルの移行

Privateチャンネルの移行は、全てのチャンネルのエクスポートデータから移行した場合のみ可能です  
通常のエクスポートデータにはPrivateチャンネルは含まれていないため、Slackに[全てのチャンネルと会話のデータエクスポートを申請する](https://slack.com/intl/ja-jp/help/articles/1500001548241-%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E4%BC%9A%E8%A9%B1%E3%81%AE%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88%E3%82%92%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%81%99%E3%82%8B)必要があります  
申請を行うためには、申請者がSlackのビジネスプラス以上のプランかつ**ワークスペースのオーナーの権限**である必要があります  
Slackは[後からPrivate→Publicチャンネルに変更不可](https://slack.com/intl/ja-jp/help/articles/213185467-%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E3%82%92%E3%83%97%E3%83%A9%E3%82%A4%E3%83%99%E3%83%BC%E3%83%88%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B)となっており、実質的にSlackのプロ以下のプランではPrivateチャンネルのエクスポートはできません  

## Discordにアップロードできる最大ファイルサイズを超えるSlackの添付ファイル

[Slackにアップロードできる最大ファイルサイズは最大1GB](https://slack.com/intl/ja-jp/help/articles/201330736-%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92-Slack-%E3%81%AB%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B)ですが、[Discordにアップロードできる最大ファイルサイズは最大100MB](https://support.discord.com/hc/ja/articles/360028038352-%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%83%96%E3%83%BC%E3%82%B9%E3%83%88-)で、サーバーブーストレベルに応じて変わります  

そのため、Slackのメッセージの添付ファイルのサイズによっては、Discordにアップロードできないファイルが存在する可能性があります  
回避策として、Discordのアップロードできる最大ファイルサイズを超える添付ファイルはファイルURLをメッセージに記載し、それ以外のファイルはDiscordにアップロードする仕様となっています  

なお、Slackのワークスペースを削除した場合、添付ファイルのファイルURLにアクセスできなくなると思われますので、注意してください  
メッセージファイルをビルド時もしくはメッセージをデプロイ時に、メッセージにDiscordにアップロードできる最大ファイルサイズを超える添付ファイルがある場合、下記の警告を出力します  
より多くの添付ファイルを移行したい場合は、Discordにアップロードできる最大ファイルサイズの上限を解放するために、[サーバーのブースト](https://support.discord.com/hc/ja/articles/360028038352-%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%83%96%E3%83%BC%E3%82%B9%E3%83%88-)を検討してください  

```text
⚠️ Message has attachments that exceed Discord's maximum file size.
Attachments that exceed Discord's maximum file size will be appended to the message as a file URL.
Consider releasing the maximum file upload size limit with Discord's server boost.
```

## アーカイブされたチャンネルの移行

Discordにはチャンネルのアーカイブ機能がないため、アーカイブされたチャンネルはARCHIVEカテゴリーにまとめ、それ以外のチャンネルはCHANNELカテゴリーにまとめる仕様となっています  

## メッセージの形式

Discordに表示されるメッセージの形式は下記のようになっています  

```text
<画像アイコン> <絵文字アイコン><ユーザー名(Bot名)> <メッセージの投稿時間(HH:mm)>
------------------------------------------------\n
<メッセージ内容>
<メッセージの投稿日時(YYYY/MM/DD HH:mm)>
```

絵文字アイコンは下記のようにメッセージを送信したSlackユーザーのユーザータイプを示します  

| 絵文字アイコン | ユーザータイプ     |
|:------------:|:----------------|
| 🟢           | アクティブユーザー |
| 🔵           | 解除済みユーザー   |
| 🤖           | Bot             |

メッセージは見やすいように、Discordの[埋め込み](https://discordjs.guide/popular-topics/embeds.html#embed-preview)の機能を利用した形となっています  
埋め込みのカラーはSlackのユーザーカラーを反映しています  

## 添付ファイルの表示位置

Discordの埋め込み機能の仕様上、添付ファイルと埋め込みを同じメッセージで送信した場合、添付ファイルは埋め込みの上に表示されます  
そのため添付ファイルは、埋め込みのメッセージの次に新しいメッセージとして送信することで、埋め込みのメッセージ下に表示させるようにしています  

## ユーザーの画像アイコンのアップロード

メッセージに含まれるユーザーの画像アイコンは、Discordにユーザー情報を出力するチャンネル`#mds-user`を作成し、そのチャンネルにユーザーの画像ファイルをアップロードしてURLを参照させる仕様になっています  
Slackのユーザーの画像ファイルのURLを参照させるのではなく、Discordのチャンネルにユーザーの画像ファイルをホストさせることで、  
Slackに依存せず、何らかの問題でSlackのユーザーの画像ファイルが参照できなくなった場合に、ユーザーの画像アイコンが表示されないなどの問題を回避するためです  

チャンネル`#mds-user`は、Discordの仕様上、[CDNにアップロードされたファイルを消えない](https://support.discord.com/hc/en-us/community/posts/360061593771-Privacy-for-CDN-attachements))ようなので、移行完了後は削除しても問題ありません  
