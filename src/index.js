require(['./assets/index.html', './styles/index.less']);

require(['gojs', 'knockout'], function(go, ko) {
    require('imports-loader?UIkit=uikit!uikit/src/js/components/form-select');
    require('imports-loader?UIkit=uikit!uikit/src/js/components/datepicker');
    require('imports-loader?UIkit=uikit!uikit/src/js/components/tooltip');

    // n: name, s: sex, m: mother, f: father, p: partner, b: date of birth, d: date of death
    var data = [
        {key: 0, n: 'Aaron', s: 'M', m: -10, f: -11, p: 1, b: '', d: ''},
        {key: 1, n: 'Alice', s: 'F', m: -12, f: -13, b: '', d: ''},
        {key: 2, n: 'Bob', s: 'M', m: 1, f: 0, p: 3, b: '', d: ''},
        {key: 3, n: 'Barbara', s: 'F', b: '', d: ''},
        {key: 4, n: 'Bill', s: 'M', m: 1, f: 0, p: [5, 6], b: '', d: ''},
        {key: 5, n: 'Brooke', s: 'F', b: '', d: ''},
        {key: 6, n: 'Claire', s: 'F', b: '', d: ''},
        {key: 7, n: 'Carol', s: 'F', m: 6, f: 4, b: '', d: ''},
        {key: 8, n: 'Chloe', s: 'F', m: 1, f: 0, p: 9, b: '', d: ''},
        {key: 9, n: 'Chris', s: 'M', b: '', d: ''},
        {key: 10, n: 'Ellie', s: 'F', m: 3, f: 2, b: '', d: ''},
        {key: 11, n: 'Dan', s: 'M', m: 3, f: 2, b: '', d: ''},
        {key: 12, n: 'Elizabeth', s: 'F', p: 13, b: '', d: ''},
        {key: 13, n: 'David', s: 'M', m: 5, f: 4, b: '', d: ''},
        {key: 14, n: 'Emma', s: 'F', m: 5, f: 4, b: '', d: ''},
        {key: 15, n: 'Evan', s: 'M', m: 8, f: 9, b: '', d: ''},
        {key: 16, n: 'Ethan', s: 'M', m: 8, f: 9, b: '', d: ''},
        {key: 17, n: 'Eve', s: 'F', p: 16, b: '', d: ''},
        {key: 18, n: 'Emily', s: 'F', m: 8, f: 9, b: '', d: ''},
        {key: 19, n: 'Fred', s: 'M', m: 17, f: 16, b: '', d: ''},
        {key: 20, n: 'Faith', s: 'F', m: 17, f: 16, b: '', d: ''},
        {key: 21, n: 'Felicia', s: 'F', m: 12, f: 13, b: '', d: ''},
        {key: 22, n: 'Frank', s: 'M', m: 12, f: 13, b: '', d: ''},
        // "Aaron"'s ancestors
        {key: -10, n: 'Paternal Grandfather', s: 'M', m: -33, f: -32, p: -11, b: '', d: ' '},
        {key: -11, n: 'Paternal Grandmother', s: 'F', b: '', d: ' '},
        {key: -32, n: 'Paternal Great', s: 'M', p: -33, b: '', d: ' '},
        {key: -33, n: 'Paternal Great', s: 'F', b: '', d: ' '},
        {key: -40, n: 'Great Uncle', s: 'M', m: -33, f: -32, b: '', d: ' '},
        {key: -41, n: 'Great Aunt', s: 'F', m: -33, f: -32, b: '', d: ' '},
        {key: -20, n: 'Uncle', s: 'M', m: -11, f: -10, b: '', d: ' '},
        // "Alice"'s ancestors
        {key: -12, n: 'Maternal Grandfather', s: 'M', p: -13, b: '', d: ' '},
        {key: -13, n: 'Maternal Grandmother', s: 'F', m: -31, f: -30, b: '', d: ' '},
        {key: -21, n: 'Aunt', s: 'F', m: -13, f: -12, b: '', d: ''},
        {key: -22, n: 'Uncle', s: 'M', p: -21, b: '', d: ''},
        {key: -23, n: 'Cousin', s: 'M', m: -21, f: -22, b: '', d: ''},
        {key: -30, n: 'Maternal Great', s: 'M', p: -31, b: '', d: ' '},
        {key: -31, n: 'Maternal Great', s: 'F', m: -50, f: -51, b: '', d: ' '},
        {key: -42, n: 'Great Uncle', s: 'M', m: -30, f: -31, b: '', d: ' '},
        {key: -43, n: 'Great Aunt', s: 'F', m: -30, f: -31, b: '', d: ' '},
        {key: -50, n: 'Maternal Great Great', s: 'F', p: -51, b: '', d: ' '},
        {key: -51, n: 'Maternal Great Great', s: 'M', b: '', d: ' '}
    ];

    jQuery('#diagram').height(jQuery(window).height() - jQuery('nav').height() - 2);
    require('./diagram')(go, require('./GenogramLayout')(go))(data);

    require('./form')(ko)(data);
});