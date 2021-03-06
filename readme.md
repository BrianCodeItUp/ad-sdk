## 給電獺看此repo的前輩
> 測試方法

拉下 repo 後，cd 進入repo目錄，輸入 `docker-compose up` 即可到 localhost:3050 進行測試，廣告為隨機顯示，
所以可能會沒有，請多refresh幾次就看得到了

在看之前我想先說明我沒做好的地方：

  1. 沒有特別寫給 SPA 的 API
  2. 沒有寫 test
  2. onAdImpression 的定義我一直沒有看懂，所以我用自己的想法去定義，並且在呼叫 impression_url 的時候會出現 cors 的問題

以上，謝謝你的 review

## AD-SDK 使用導覽

### 使用方法

使用非同步載入後呼叫 `AD.init` 方法來進行使用者驗證, 在驗證成功後會隨即載入和顯示廣告

注意： `AD.Init` 方法只接受物件

```html
<script> 
  (function (d, s, id) {
    var js, 
        script = d.getElementsByTagName(s)[0]

    if (d.getElementById(id)) { return }
    js = d.createElement(s)
    js.id = id
    js.src = 'http://localhost:8080/sdk/sdk.js'
    js.onload = adInit
    script.parentNode.insertBefore(js, script)
  })(document, 'script', 'ad-sdk')

  function adInit () {
    AD.init({
      clientId: 'Client123'
    })
  }
</script>
```

> 加入事件監聽

AD-SDK 提供三個事件供使用者監聽

1. `onAdLoaded` : 廣告載入成功 
2. `onAdFailed` : 廣告載入失敗
3. `onAdImpression` : 當廣告在畫面中，超過1秒才關閉，視為者用者曾經看過此廣告

將你想監聽的事件傳入 `AD.Init()` 裡
```html
<script> 
  (function (d, s, id) {
    var js, 
        script = d.getElementsByTagName(s)[0]

    if (d.getElementById(id)) { return }
    js = d.createElement(s)
    js.id = id
    js.src = 'http://localhost:8080/sdk/bundle.js'
    js.onload = adInit
    script.parentNode.insertBefore(js, script)
  })(document, 'script', 'ad-sdk')

  function adInit () {
    AD.init({
      clientId: 'Client123',
      onAdLoaded,
      onAdFailed,
      onAdImpression
    })
  }

  function onAdLoaded () {
    console.log('廣告載入成功！')
  }

  function onAdFailed (error) {
    console.log('廣告載入失敗！')
    console.log(error)
  }

  function onAdImpression () {
    console.log('訪客已經看過廣告！')
  }
</script>
```

**1. onAdLoaded**

將 `onAdLoaded` 加入 `AD.Init()` 後，當廣告資料載入成功後便會呼叫此 function

```js
function onAdLoaded () {
  // ...do what you want after ad loaded 
}
```

**2. onAdFailed**

將 `onAdLoaded` 加入 `AD.Init()` 後，當廣告資料載入失敗便會呼叫此 function，並提供錯誤訊息

物件 `error`

```js
function onAdFailed (error) {
  console.log(error.errMsg)
  // ...do what you want after ad fail loaded
}
```
**3. onAdImpression**

將 `onAdLoaded` 加入 `AD.Init()` 後，當廣告在使用者畫面超過一秒後才關閉，則會呼叫此 function

```js
function onAdImpression () {
  // ...do what you want after user close AD and AD stays on screen over 1 second
}
```

> 調整廣吿自動顯示

在 `AD.Init()`  加入 `isAutoLoaded` 改為 false，即可成功在廣告資料載入後停止自動顯示，若無此參數預設為 `true`，若想要控制廣告顯示時機，

可以透過 `onAdOloaded` 事件取得 `showAd` 方法，決定何時顯示廣告

注意： 只有在 `isAutoLoaded` 為 `false` 時，onAdLoaded 才會得到 `showAd` 方法

```js
function adInit () {
  AD.init({
    clientId: 'Client123',
    isAutoLoaded: false,
    onAdLoaded
  })
}

function onAdOloaded (showAd) {
  // ...do what you want after ad loaded and show AD
  showAD()
}
```

> 設定廣告為特定種類

目前有提供 `VIDEO` , `BANNER` 選項，預設為任意廣告

在 `AD.Init()`  加入 `adType` 參數，即可設定想要廣告類型, 若載入廣告非設定類型，則不顯示
```js
function adInit () {
  AD.init({
    clientId: 'Client123',
    adType: 'VIDEO'
  })
}
```
