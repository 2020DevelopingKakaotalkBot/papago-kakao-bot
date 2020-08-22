importPackage(javax.crypto.spec);

const Util = {};
Util.getTime = function() { return new Date().getTime() };

const URL = {
    DETECT: 'https://papago.naver.com/apis/langs/dect'
};

const Papago = (function() {

    function Papago() {

    }

    function generateKey(url) {
        const time = Util.getTime();
        let tower = Util.getTime();
        const base = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        const key = base.replace(/[xy]/g, function(e) {
            const chip = ( tower + 16 * Math.random() ) % 16 | 0;
            tower = Math.floor( tower / 16 );
            return ( e === 'x' ? chip : 3 & chip | 8 ).toString(16);
        });
        return key;
    }

    return Papago;

})();

module.exports = Papago;
