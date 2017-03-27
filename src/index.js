require(['./assets/index.html']);

require(['gojs'], function(go) {
    require('./diagram')(go, require('./GenogramLayout')(go));
});