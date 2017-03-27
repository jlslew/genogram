module.exports = function(ko, async, firebase, diagram) {
    return function(array) {
        function Form() {
            var self = this;

            self.gender = ko.observableArray([
                {v: 'M', t: 'Male'},
                {v: 'F', t: 'Female'}
            ]);
            self.persons = ko.observableArray(array);

            self.mothers = ko.computed(function() {
                return self.persons().filter(function(person) {
                    return person.s === 'F';
                });
            });
            self.fathers = ko.computed(function() {
                return self.persons().filter(function(person) {
                    return person.s === 'M';
                });
            });

            self.db = ko.observable('sample');
            self.ref = null;

            self.id = ko.observable('');
            self.key = ko.observable('');
            self.first = ko.observable('');
            self.last = ko.observable('');
            self.sex = ko.observable('');
            self.mother = ko.observable('');
            self.father = ko.observable('');
            self.spouse = ko.observable('');
            self.dob = ko.observable('');
            self.dead = ko.observable(false);
            self.dod = ko.observable('');

            self.id.subscribe(function(value) {
                if (value === undefined) {
                    self.reset();
                } else {
                    for (var i = 0; i < self.persons().length; i++) {
                        if (self.persons()[i].id === value) {
                            self.key(self.persons()[i].key);
                            self.first(self.persons()[i].fn);
                            self.last(self.persons()[i].ln);
                            self.sex(self.persons()[i].s);
                            self.mother(self.persons()[i].m);
                            self.father(self.persons()[i].f);
                            self.spouse(self.persons()[i].p);
                            self.dob(self.persons()[i].b);
                            self.dead(self.persons()[i].d !== '');
                            self.dod(self.persons()[i].d);
                        }
                    }
                }
            });

            self.db.subscribe(function() {
                self.load();
            });

            self.reset = function() {
                self.id('');
                self.key('');
                self.first('');
                self.last('');
                self.sex('');
                self.mother('');
                self.father('');
                self.spouse('');
                self.dob('');
                self.dead(false);
                self.dod('');
            };

            self.load = function() {
                if (self.ref !== null) {
                    self.ref.off();
                }

                self.ref = firebase.database().ref(self.db());

                self.ref.once('value', function(snapshot) {
                    if (snapshot.val() === null) {
                        self.db('sample');
                    } else {
                        self.ref.on('value', function(snapshot) {
                            jQuery('#modal :input').prop('disabled', true);

                            async.map(jQuery.map(snapshot.val(), function(data, id) {
                                data['n'] = data['fn'] + ' ' + data['ln'];
                                data['id'] = id;

                                return data;
                            }), function(data, callback) {
                                if (!data.hasOwnProperty('img')) {
                                    callback(null, data);
                                    return;
                                }

                                var ref = firebase.storage().ref(data['img']);
                                ref.getDownloadURL().then(function(url) {
                                    data['source'] = url;

                                    callback(null, data);
                                });
                            }, function(err, results) {
                                if (err) {
                                    console.error(err);
                                }

                                jQuery('#modal :input').prop('disabled', false);
                                self.persons(results);
                                diagram(results);
                            });
                        });
                    }
                });
            };

            self.save = function(form) {
                var person = {};
                person['key'] = self.key();
                person['fn'] = self.first();
                person['ln'] = self.last();
                person['s'] = self.sex();

                if (self.mother() !== undefined && self.father() !== undefined) {
                    person['m'] = self.mother();
                    person['f'] = self.father();
                }

                if (self.spouse() !== undefined) {
                    person['p'] = self.spouse();
                }

                person['b'] = jQuery(form).find('#input-birth').val();
                person['d'] = jQuery(form).find('#input-death').val();

                if (self.dead() && person['d'] === '') {
                    person['d'] = ' ';
                }
            };

            self.push = function(person) {
                var id = self.id();

                if (id === undefined || id === '') {
                    id = firebase.database().ref(self.db()).push().key;
                    person['key'] = (new Date()).getTime();
                } else {
                    for (var i = 0; i < self.persons().length; i++) {
                        if (self.persons()[i].key === person['key']) {
                            self.persons.replace(self.persons()[i], person);
                        }
                    }
                }

                firebase.database().ref(self.db() + '/' + id).set(person);
                self.reset();
            };
        }

        ko.applyBindings(new Form());
    };
};