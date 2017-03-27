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
            self.img = ko.observable('');

            self.file = ko.observable(null);
            self.src = ko.observable('');

            jQuery('#file').change(function() {
                if (this.files && this.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function(e) {
                        self.src(e.target.result);
                    };

                    reader.readAsDataURL(this.files[0]);
                    self.file(this.files[0]);

                    self.img(self.db() + '/' + this.files[0].name);
                }
            });

            jQuery('#modal').on('show.uk.modal', function() {
                jQuery('#modal :input').prop('disabled', true);

                var ref = firebase.storage().ref('default-avatar.png');
                ref.getDownloadURL().then(function(url) {
                    jQuery('#modal :input').prop('disabled', false);
                    self.src(url);
                });
            });

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
                            self.img(self.persons()[i].img);

                            if (self.img()) {
                                jQuery('#modal :input').prop('disabled', true);

                                var ref = firebase.storage().ref(self.img());
                                ref.getDownloadURL().then(function(url) {
                                    jQuery('#modal :input').prop('disabled', false);
                                    self.src(url);
                                });
                            } else {
                                jQuery('#modal :input').prop('disabled', true);

                                var ref = firebase.storage().ref('default-avatar.png');
                                ref.getDownloadURL().then(function(url) {
                                    jQuery('#modal :input').prop('disabled', false);
                                    self.src(url);
                                });
                            }
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
                self.img('');

                jQuery('#modal :input').prop('disabled', true);
                self.file(null);

                try {
                    var ref = firebase.storage().ref('default-avatar.png');
                    ref.getDownloadURL().then(function(url) {
                        jQuery('#modal :input').prop('disabled', false);
                        self.src(url);
                    });
                } catch (err) {
//                    console.error(err);
                }
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
                                if (data.hasOwnProperty('img')) {
                                    var ref = firebase.storage().ref(data['img']);
                                    ref.getDownloadURL().then(function(url) {
                                        data['source'] = url;

                                        callback(null, data);
                                    });
                                } else {
                                    var ref = firebase.storage().ref('default-avatar.png');
                                    ref.getDownloadURL().then(function(url) {
                                        data['source'] = url;

                                        callback(null, data);
                                    });
                                }
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
                jQuery('#modal :input').prop('disabled', true);

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

                if (self.img()) {
                    person['img'] = self.img();
                }

                if (self.file()) {
                    var ref = firebase.storage().ref(self.img());
                    ref.put(self.file()).then(function() {
                        self.push(person);
                    }).catch(function(err) {
                        console.error(err);
                    });
                } else {
                    self.push(person);
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

                jQuery('#modal :input').prop('disabled', false);
            };
        }

        ko.applyBindings(new Form());
    };
};