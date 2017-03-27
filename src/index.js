require(['./assets/index.html', './styles/index.less']);

require(['gojs', 'knockout', 'firebase'], function(go, ko, firebase) {
    require('imports-loader?UIkit=uikit!uikit/src/js/components/form-select');
    require('imports-loader?UIkit=uikit!uikit/src/js/components/datepicker');
    require('imports-loader?UIkit=uikit!uikit/src/js/components/tooltip');

    jQuery('#diagram').height(jQuery(window).height() - jQuery('nav').height() - 2);

    firebase.initializeApp({
        apiKey: "AIzaSyAZOIpF0a3ab58CUqGth6sl4ESj9jc8LG0",
        databaseURL: "https://genogram-b151c.firebaseio.com"
    });
    firebase.auth().signInAnonymously().catch(function(error) {
        console.log(error.code + ' ' + error.message);
    });
    firebase.database().ref('sample').once('value', function(snapshot) {
        require('./form')(ko, firebase)(jQuery.map(snapshot.val(), function(data, id) {
            data['id'] = id;

            return data;
        }));
    });
    firebase.database().ref('sample').on('value', function(snapshot) {
        require('./diagram')(go, require('./GenogramLayout')(go))(snapshot.val());
    });
});