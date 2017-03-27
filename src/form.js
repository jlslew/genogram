module.exports = function(ko) {
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

            self.key.subscribe(function(value) {
                if (value === undefined) {
                    self.reset();
                } else {
                    for (var i = 0; i < self.persons().length; i++) {
                        if (self.persons()[i].id === value) {
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

            self.reset = function() {
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
        }

        ko.applyBindings(new Form());
    };
};