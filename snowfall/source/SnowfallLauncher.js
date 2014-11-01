enyo.kind({
    name: "SnowfallLauncher",
    kind: "HFlexBox",
    components: [ {
            kind: "ApplicationEvents",
            onLoad: "onload",
            onApplicationRelaunch: "onload"
        }
    ],
    
    onload: function() {
        if(enyo.windowParams.dockMode)
            enyo.windows.openWindow('exhibition.html', 'Snowfall Exhibition', {}, { window: "dockMode"});
        else
            enyo.windows.openWindow('app.html', 'Snowfall App', {}, {});
    }
});
