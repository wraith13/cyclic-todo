# Cyclic ToDo

🚧 This static web application is under development. / この Static Web アプリは開発中です。

## Features

- ✅️ Lifelog as ToDo List. / ToDo リストとしてのライフログ。
- ✅️ Automatically predict task cycle. / タスク周期を自動予測。
- 🚧 Sublists and tags. / サブリストとタグ。
- ✅️ Static Single Page Web Application. / 静的シングルページウェブアプリケーション。
- ✅️ Supports PCs and smartphones. / PCとスマフォをサポート。
- 🚫 OneDrive sync. / OneDrive 同期。
- ✅️ Data import and export in JSON / JSON でのデータインポートとエクスポート。
- ✅️ ダークモード対応
- ✅️ 多言語対応

## Concepts

- Don't blame the user. / ユーザーを責めない。
- Encourage users. / ユーザーを勇気づける。
- Just record the log and display it. / ひたすらログを記録しそれを表示するだけ。

## Development environment construction

0. Install [Visual Studio Code](https://code.visualstudio.com/) ( Not required, but recommended. )
1. Install [Node.js](https://nodejs.org/ja/)
2. Execute `npm install`.

## Build commands

- `npm run-script "build all"`
- `npm run-script "build html"`
- `npm run-script "build style"`
- `npm run-script "build script"`
- `npm run-script "debug build all"`
- `npm run-script "debug build style"`
- `npm run-script "debug build script"`
- `npm run-script "watch script"`

Debug builds embed map files.

## Files

|path|description|
|---|---|
|[`./build.js`](./build.js)|build command script.|
|[`./build.json`](./build.json)|build settings.|
|[`./index.html`](./index.html)|TBD|
|[`./index.template.html`](./index.template.html)|TBD|
|[`./resource/images.json`](./resource/images.json)|TBD|
|[`./resource/lang.en.json`](./resource/lang.en.json)|TBD|
|[`./resource/lang.ja.json`](./resource/lang.ja.json)|TBD|
|[`./style/index.less`](./style/index.less)|TBD|
|[`./script/index.ts`](./script/index.ts)|TBD|

## How to publish

1. Fork [this repository](https://github.com/wraith13/cyclic-todo/) on GitHub.
2. Go `Settings`(→`Options`)→`GitHub Pages`, select `master branch` from drop down list, and click `Save`.

## License

[Boost Software License](./LICENSE_1_0.txt)
