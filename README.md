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

### 🌐 언어 감지
`papago.detectLanguage(target) -> string`

- **target** 감지할 대상  
- **반환값** 언어 코드

### 🌎 번역
`papago.translate(text, source, target) -> TranslationResult`

- **text** 번역 대상
- **source** 시작 언어 코드
- **target** 결과 언어 코드
- **반환값** `TranslationResult`

### 🔖 타입

`언어 코드`

| 값 | 언어 |
|:---:|:---:|
| `ko` | 한국어 |
| `ja` | 일본어 |
| `zh-cn` | 중국어 간체 |
| `zh-tw` | 중국어 번체 |
| `hi` | 힌디어 |
| `en` | 영어 |
| `es` | 스페인어 |
| `fr` | 프랑스어 |
| `de` | 독일어 |
| `pt` | 포르투칼어 |
| `vi` | 베트남어 |
| `id` | 인도네시아어 |
| `fa` | 페르시아어 |
| `ar` | 아랍어 |
| `mm` | 미얀마어 |
| `th` | 태국어 |
| `ru` | 러시사어 |
| `it` | 이탈리아어 |

[공식 문서](https://developers.naver.com/docs/papago/papago-detectlangs-overview.md#%EC%96%B8%EC%96%B4-%EA%B0%90%EC%A7%80-%EA%B0%9C%EC%9A%94) 참조

`TranslationResult`

| 값 | 타입 | 의미 |
|:---|:---:|:---|
| `translated` | `string` | 번역 결과 |
| `source` | `string` | 시작 언어 코드 |
| `target` | `string` | 결과 언어 코드 |
| `sound` | `string` | 번역 결과 발음 |
| `sourceSound` | `string` | 번역 대상 발음 |

## 📋 예제
```javascript
const Papago = require('papago');
const papago = new Papago();

function response(room, msg, sender, isGroupChat, replier) {
    if(msg.split(' ')[0] === '/번역') {

        try {

            // 번역 대상 잘라내기
            const query = msg.split(' ').slice(1).join(' ');
    
            // 언어 가져오기
            const language = papago.detectLanguage(query);
    
            if(language === null) {
                replier.reply('무슨 언어인지 잘 모르겠어요.');
                return false;
            }
    
            if(language === 'ko') {
                replier.reply('외국어 -> 한국어 번역만 가능해요.');
                return false;
            }
    
            // 외국어를 한글로 번역하기
            const translation = papago.translate(query, language, 'ko');
            replier.reply('번역 결과이에요.\n\n' + translation.translated + '\n[ ' + translation.sound + ' ]');
        
            return true;

        } catch(e) {
        
            replier.reply('오류가 발생했어요.');

            GlobalLog.error(e);
            return false;

        }
    }
}
```
