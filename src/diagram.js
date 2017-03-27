module.exports = function(go, GenogramLayout) {
    var $ = go.GraphObject.make;

    diagram = $(go.Diagram, 'diagram', {
        initialContentAlignment: go.Spot.Center,
        // use a custom layout, defined below
        layout: $(GenogramLayout, {
            columnSpacing: 10,
            layerSpacing: 50,
            direction: 90
        }),
        isReadOnly: true
    });

    var person = function() {
        return $(go.Node, 'Vertical', {
            locationSpot: go.Spot.Center
        }, $(go.Panel, {
            margin: new go.Margin(0, 0, 5, 0)
        }, $(go.Picture, {
            background: 'lightblue',
            height: 70,
            width: 70
        }, new go.Binding('source')), $(go.Shape, {
            geometry: go.Geometry.parse('F M68 0 L70 0 70 2 2 70 0 70 0 68z'),
            strokeWidth: 0,
            stroke: null,
            fill: 'red'
        }, new go.Binding('visible', 'd', function(d) {
            return d !== '';
        }))), $(go.Panel, 'Vertical', {
            margin: new go.Margin(0, 0, 5, 0)
        }, $(go.TextBlock, {
            maxSize: new go.Size(40, NaN),
            wrap: go.TextBlock.None,
            textAlign: 'center'
        }, new go.Binding('text', 'fn')), $(go.TextBlock, {
            maxSize: new go.Size(40, NaN),
            wrap: go.TextBlock.None,
            textAlign: 'center'
        }, new go.Binding('text', 'ln')), $(go.TextBlock, {
            maxSize: new go.Size(40, NaN),
            wrap: go.TextBlock.None,
            textAlign: 'center'
        }, new go.Binding('text', 'b')), $(go.TextBlock, {
            maxSize: new go.Size(40, NaN),
            wrap: go.TextBlock.None,
            textAlign: 'center'
        }, new go.Binding('text', 'd'))));
    };

    // two different node templates, one for each sex,
    // named by the category value in the node data object
    diagram.nodeTemplateMap.add('F', person()); // Female
    diagram.nodeTemplateMap.add('M', person()); // Male

    // the representation of each label node -- nothing shows on a Marriage Link
    diagram.nodeTemplateMap.add('LinkLabel', $(go.Node, {
        fromEndSegmentLength: 20,
        selectable: false,
        height: 1,
        width: 1
    }));

    // for parent-child relationships
    diagram.linkTemplate = $(go.Link, {
        routing: go.Link.Orthogonal,
        selectable: false
    }, $(go.Shape, {
        strokeWidth: 2
    }));

    // for marriage relationships
    diagram.linkTemplateMap.add('Marriage', $(go.Link, {
        selectable: false
    }, $(go.Shape, {
        strokeWidth: 2,
        stroke: 'blue'
    })));

    // create and initialize the Diagram.model given an array of node data representing people
    diagram.model = $(go.GraphLinksModel, {
        // declare support for link label nodes
        linkLabelKeysProperty: 'labelKeys',
        // this property determines which template is used
        nodeCategoryProperty: 's'
    });

    var findMarriage = function(diagram, a, b) {  // A and B are node keys
        var nodeA = diagram.findNodeForKey(a);
        var nodeB = diagram.findNodeForKey(b);
        if (nodeA !== null && nodeB !== null) {
            var it = nodeA.findLinksBetween(nodeB);  // in either direction
            while (it.next()) {
                var link = it.value;
                // Link.data.category === 'Marriage' means it's a marriage relationship
                if (link.data !== null && link.data.category === 'Marriage')
                    return link;
            }
        }
        return null;
    };

    return function(array) {
        diagram.clear();

        jQuery.map(array, function(data) {
            diagram.model.addNodeData(data);
        });

        jQuery.map(array, function(data) {
            // now process the node data to determine marriages
            var ps = data.p;
            if (ps !== undefined) {
                if (typeof ps === 'number')
                    ps = [ps];
                for (var j = 0; j < ps.length; j++) {
                    var spouse = ps[j];
                    if (data.key === spouse) {
                        continue; // or warn no reflexive marriages
                    }
                    var link = findMarriage(diagram, data.key, spouse);
                    if (link === null) {
                        // add a label node for the marriage link
                        var mlab = {s: 'LinkLabel'};
                        diagram.model.addNodeData(mlab);
                        // add the marriage link itself, also referring to the label node
                        diagram.model.addLinkData({
                            from: data.key,
                            to: spouse,
                            labelKeys: [mlab.key],
                            category: 'Marriage'
                        });
                    }
                }
            }
        });

        jQuery.map(array, function(data) {
            // process parent-child relationships once all marriages are known
            if (data.m !== undefined && data.f !== undefined) {
                var link = findMarriage(diagram, data.m, data.f);
                if (link === null) {
                    return array; // or warn no known mother/father/marriage between them
                }
                diagram.model.addLinkData({
                    from: link.data.labelKeys[0],
                    to: data.key
                });
            }
        });
    };
};