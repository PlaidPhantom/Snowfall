enyo.kind({
    name: "SnowfallWithMenu",
    kind: "HFlexBox",
    components: [ {
            kind: "AppMenu",
            components: [ {
                    caption: "Preferences",
                    onclick: "openPreferences"
                }, {
                    caption: "Using Exhibition",
                    onclick: "openUsingExhibition"
                }, {
                    caption: "About",
                    onclick: "openAbout"
                }
            ]
        }, {
            kind: "Snowfall",
            name: "snowfall"
        }, {
            kind: "Popup",
            name: "about",
            modal: true,
            dismissWithClick: true,
            style: "width: 50%",
            components: [ {
                    kind: "HFlexBox",
                    align: "center",
                    components: [ {
                            content: "Snowfall",
                            style: "font-size: 1.5em"
                        }, {
                            flex: 1
                        }, {
                            kind: "Image",
                            src: "images/phantomhat.png"
                        }
                    ]
                }, {
                    kind: "HFlexBox",
                    pack: "right",
                    components: [ {
                            content: "version 1.0.1"
                        }, {
                            flex: 1
                        }, {
                            content: "by Phantom Hat"
                        }
                    ]
                }, {
                    kind: "HFlexBox",
                    components: [ {
                            kind: "Button",
                            caption: "Phantom Hat<br />Website",
                            onclick: "goToPhantomHat",
                            allowHtml: true,
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "@Phantom_Hat<br />on Twitter",
                            onclick: "openTwitter",
                            allowHtml: true,
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Phantom Hat<br />Email Support",
                            onclick: "contactSupport",
                            allowHtml: true,
                            flex: 1
                        }
                    ]
                }, {
                    content: "Photos courtesy of <a href=\"http://morguefile.com/\">morgueFile</a>.",
                    allowHtml: true
                }
            ]
        }, {
            kind: "Popup",
            name: "usingExhibition",
            modal: true,
            dismissWithClick: true,
            style: "width: 50%",
            components: [ {
                    content: "Using Exhibition",
                    style: "font-size: 2em;"
                }, {
                    allowHtml: true,
                    content: "<p>To set Snowfall as your active Exhibition app, first you need to go into the \"Exhibition\" settings app. "
                           + "A list of installed Exhibition apps will display.  "
                           + "Select the checkbox by \"Snowfall\" to enable Snowfall for Exhibition.</p>"
                }, {
                    kind: "Button",
                    caption: "Open Exhibition Settings",
                    onclick: "openExhibitionSettings",
                    className: "enyo-button-gray"
                }, {
                    allowHtml: true,
                    content: "<p>To enter Exhibition, you can either press the \"Start Exhibition\" button in the Exhibition app "
                           + "or simply set the TouchPad on a Touchstone.  Your currently selected Exhibition app will start, "
                           + "and you can select Snowfall from the Application Menu to run Snowfall in Exhibition Mode.</p>"
                }
            ]
        }, {
            name : "exhibitionLauncher",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "launch"
        }, {
            name : "urlOpener",
            kind : "PalmService",
            service : "palm://com.palm.applicationManager",
            method : "open"
        }
    ],
    
    openPreferences: function() {
        this.$.snowfall.showSettings();
    },
    
    openAbout: function() {
        this.$.about.openAtCenter();
    },
    
    goToPhantomHat: function() {
        this.$.urlOpener.call({ target: "http://www.phantomhat.com/" });
    },
    
    openTwitter: function() {
        this.$.urlOpener.call({ target: "http://twitter.com/Phantom_Hat" });
    },
    
    contactSupport: function() {
        this.$.urlOpener.call({ target: "mailto:support@phantomhat.com?Subject=[Snowfall] Support" });
    },
    
    openUsingExhibition: function() {
        this.$.usingExhibition.openAtCenter();
    },
    
    openExhibitionSettings: function() {
        this.$.exhibitionLauncher.call({ id: "com.palm.app.exhibitionpreferences" });
    }
});
