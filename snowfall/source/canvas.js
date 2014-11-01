enyo.kind({
    name: "Canvas",
    kind: "Control",
    nodeTag: "canvas",
    
    published: {
        width: 1,
        height: 1
    },
    
    create: function() {
        this.inherited(arguments);
        this.widthChanged();
        this.heightChanged();
    },
    
    rendered: function() {
        this.hasNode();
    },
    
    widthChanged: function() {
        this.setAttribute('width', this.width + 'px');
    },
    
    heightChanged: function() {
        this.setAttribute('height', this.height + 'px');
    },
    
    getContext: function(contextType) {
        this.hasNode();
        return this.node.getContext(contextType);
    },
    
    toDataURL: function() {
        return this.node.toDataURL();
    }
});
