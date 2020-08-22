importPackage(java.util);
importPackage(javax.crypto);
importPackage(javax.crypto.spec);
importPackage(org.jsoup);

const Util = {};
Util.getTime = function() { return new Date().getTime() };
Util.toJavaString = function(string) { return new java.lang.String(string) };
Util.toHmacMD5 = function(message, keyString) {

    message = Util.toJavaString(message);
    keyString = Util.toJavaString(keyString);

    const key = new SecretKeySpec(keyString.getBytes('utf-8'), 'HmacMD5');
    const mac = Mac.getInstance('HmacMD5');

    mac.init(key);
    const bytes = mac.doFinal(message.getBytes('ASCII'));

    const encoded = Base64.getEncoder().encode(bytes);
    const base64 = new java.lang.String(encoded);

    return base64;

};

const URL = {
    DETECT: 'https://papago.naver.com/apis/langs/dect',
    TRANSLATE: 'https://papago.naver.com/apis/n2mt/translate'
};

const Papago = (function() {

    function Papago() {

    }

    function generateKey(url) {

        const time = Util.getTime();
        let tower = Util.getTime();

        const version = 'v1.5.1_4dfe1d83c2';
        const base = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        const chip = base.replace(/[xy]/g, function(e) {
            const chip = ( tower + 16 * Math.random() ) % 16 | 0;
            tower = Math.floor( tower / 16 );
            return ( e === 'x' ? chip : 3 & chip | 8 ).toString(16);
        });

        const key = 'PPG ' + chip + ':' + Util.toHmacMD5(chip + '\n' + url + '\n' + time, version);

        return { time: time, key: key };

    }

    Papago.prototype.detectLanguage = function(string) {

        if(typeof string !== 'string') {
            throw new TypeError('Parameter type must be string');
        }

        const keySet = generateKey(URL.DETECT);
        const connection = Jsoup.connect(URL.DETECT);

        connection.method(Connection.Method.POST);
        connection.header('Authorization', keySet.key);
        connection.header('Timestamp', keySet.time);
        connection.data('query', string);

        connection.ignoreContentType(true);
        connection.ignoreHttpErrors(true);

        const response = connection.execute();

        if(response.statusCode() !== 200) {
            throw new Error('Language detection failed');
        }

        const body = response.body();
        const data = JSON.parse(body);
        let language = data.langCode;

        if(language === 'unk') language = null;

        return language;

    }

    Papago.prototype.translate = function(text, source, target) {

        if(typeof text !== 'string')
            throw new TypeError('Parameter text must be string');
        if(typeof source !== 'string')
            throw new TypeError('Parameter source must be string');
        if(typeof target !== 'string')
            throw new TypeError('Parameter target must be string');

        const keySet = generateKey(URL.TRANSLATE);
        const connection = Jsoup.connect(URL.TRANSLATE);

        connection.method(Connection.Method.POST);
        connection.header('Authorization', keySet.key);
        connection.header('Timestamp', keySet.time);
        connection.header('Accept-Language', 'ko');

        connection.data('locale', 'ko');
        connection.data('dict', true);
        connection.data('dictDisplay', 20);
        connection.data('honorific', false);
        connection.data('instant', false);
        connection.data('paging', false);
        connection.data('source', source);
        connection.data('target', target);
        connection.data('text', text);

        connection.ignoreContentType(true);
        connection.ignoreHttpErrors(true);

        const response = connection.execute();

        if(response.statusCode() !== 200) {
            throw new Error('Translation failed');
        }

        const body = response.body();
        const data = JSON.parse(body);

        let sound = null;
        let sourceSound = null;

        if(data.tlit) {
            sound = [];
            const tlits = data.tlit.message.tlitResult;
            for (let tlit of tlits) sound.push(tlit.phoneme);
            sound = sound.join(' ');
        }

        if(data.tlitSrc) {
            sourceSound = [];
            const srcTlits = data.tlitSrc.message.tlitResult;
            for (let tlit of srcTlits) sourceSound.push(tlit.phoneme);
            sourceSound = sourceSound.join(' ');
        }

        const result = {
            translated: data.translatedText,
            source: data.srcLangType,
            target: data.tarLangType,
            sound: sound,
            sourceSound: sourceSound
        };

        return result;

    }

    return Papago;

})();

module.exports = Papago;
