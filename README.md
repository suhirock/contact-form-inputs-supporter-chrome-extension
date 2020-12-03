# Mail Tester

Mail test by for chrome extension.
This extension get the value of the form once entered, and set

## Script build

```
# Module install
npm install

# Build
npm run build
```

Generates product files in the dist directory.

## License

MIT License.

## Memo

scripts.js::chrome.storage.local
    chromeのストレージ（sync/local/managed がある）
    localを利用
    利用には permissions に "storage" を追加

scripts.js::chrome.extension.onMessage.addListener
    メッセージを受け取ったタイミングで実行
    今回はbrowserActionから受け取った文字を元にイベントを実行

background.js::chrome.browserAction.onClicked.addListener
    chrome extensionをクリックした際の動作を書く
    