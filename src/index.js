require(['./assets/index.html', './styles/index.less']);

require(['gojs', 'knockout', 'async', 'firebase'], function(go, ko, async, firebase) {
    require('imports-loader?UIkit=uikit!uikit/src/js/components/form-select');
    require('imports-loader?UIkit=uikit!uikit/src/js/components/datepicker');
    require('imports-loader?UIkit=uikit!uikit/src/js/components/tooltip');

    jQuery('#diagram').height(jQuery(window).height() - jQuery('nav').height() - 2);
    var diagram = require('./diagram')(go, require('./GenogramLayout')(go));
    require('./form')(ko, async, firebase, diagram)([]);

    firebase.initializeApp({
        apiKey: "AIzaSyAZOIpF0a3ab58CUqGth6sl4ESj9jc8LG0",
        databaseURL: "https://genogram-b151c.firebaseio.com",
        storageBucket: "genogram-b151c.appspot.com"
    });
    firebase.auth().signInAnonymously().catch(function(error) {
        console.log(error.code + ' ' + error.message);
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            jQuery('#btn-load').click();
        }
    });
});