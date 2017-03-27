require(['./assets/index.html', './styles/index.less']);

require(['gojs'], function(go) {
    jQuery('#diagram').height(jQuery(window).height() - jQuery('nav').height() - 2);
    require('./diagram')(go, require('./GenogramLayout')(go));
});