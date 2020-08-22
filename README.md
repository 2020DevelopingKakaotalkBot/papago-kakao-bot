# 🐦 papago-kakao-bot

```javascript
const Papago = require('papago');
const papago = new Papago();

const translation = papago.translate('hello', 'en', 'ko');
translation.translated // 안녕하십니까
translation.sound // annyonghasimnikka

const language = papago.detectLanguage('한글을 사랑합시다');
language // ko
```

## 📕 사용법

- `global_modules` 폴더에 `papago.js` 파일 설치
- `require('papago')` 로 모듈 불러오기

## 📋 예제
```javascript
const Papago = require('papago');
const papago = new Papago();

function response(room, msg, sender, isGroupChat, replier) {
    if(msg.split(' ')[0] === '/번역') {
        const query = msg.split(' ').slice(1).join(' ');
        const language = papago.detectLanguage(query);
        if(language === null) {
            replier.reply('알 수 없는 언어이에요.');
            return false;
        }
        if(language === 'ko') {
            replier.reply('외국어 -> 한국어 번역만 가능해요.');
            return false;
        }
        const translation = papago.translate(query, language, 'ko');
        replier.reply('번역 결과이에요\n\n' + translation.translated + '\n[ ' + translation.sound + ' ]');
        return true;
    }
}
```
