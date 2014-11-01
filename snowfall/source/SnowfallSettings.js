enyo.kind({
    name: "SnowfallSettings",
    kind: "Popup",
    dismissWithClick: false,
    modal: true,
    scrim: true,
    components: [ {
            kind: "HFlexBox",
            components: [ {
                    kind: "VFlexBox",
                    flex: 1,
                    components: [ {
                            kind: "RowGroup",
                            caption: "Settings",
                            components: [ {
                                    kind: "HFlexBox",
                                    align: "center",
                                    components: [ {
                                            content: "Wind Speed",
                                            flex: 1
                                        }, {
                                            name: "windSpeed",
                                            kind: "Picker",
                                            value: 0,
                                            items: [
                                                { value: 0, caption: "None" },
                                                { value: 1, caption: "Slow" },
                                                { value: 3, caption: "Medium" },
                                                { value: 5, caption: "Fast" },
                                                { value: 7, caption: "Blizzard" }
                                            ]
                                        }
                                    ]
                                }, {
                                    kind: "HFlexBox",
                                    align: "center",
                                    components: [ {
                                            content: "Scene Refresh",
                                            flex: 1
                                        }, {
                                            name: "refresh",
                                            kind: "Picker",
                                            value: 0,
                                            items: [
                                                { value: 0, caption: "Never" },
                                                { value: 5, caption: "5 Minutes" },
                                                { value: 10, caption: "10 Minutes" },
                                                { value: 30, caption: "30 Minutes" },
                                                { value: 60, caption: "60 Minutes" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }, {
                            kind: "RowGroup",
                            caption: "Clock",
                            components: [ {
                                    kind: "HFlexBox",
                                    align: "center",
                                    components: [ {
                                            content: "Location",
                                            flex: 1
                                        }, {
                                            name: "clockLocation",
                                            kind: "Picker",
                                            value: "bottomleft",
                                            items: [
                                                { value: "topleft", caption: "Top Left" },
                                                { value: "topright", caption: "Top Right" },
                                                { value: "bottomleft", caption: "Bottom Left" },
                                                { value: "bottomright", caption: "Bottom Right" },
                                                { value: "center", caption: "Center" },
                                                { value: "hidden", caption: "Hidden" }
                                            ]
                                        }
                                    ]
                                }, {
                                    kind: "HFlexBox",
                                    align: "center",
                                    components: [ {
                                            content: "Clock Type",
                                            flex: 1
                                        }, {
                                            name: "clockType",
                                            kind: "Picker",
                                            value: 12,
                                            items: [
                                                { value: 12, caption: "12 Hour" },
                                                { value: 24, caption: "24 Hour" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }, {
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Cancel",
                            onclick: "cancelSettings",
                            className: "enyo-button-negative"
                        }
                    ]
                }, {
                    kind: "VFlexBox",
                    flex: 1,
                    components: [ {
                            kind: "Group",
                            caption: "Scenes",
                            components: [ {
                                    kind: "VirtualList",
                                    name: "scenes",
                                    style: "height: 350px; width: 280px; margin: 2px 10px 2px 10px;",
                                    onSetupRow: "setupSceneRow",
                                    components: [ {
                                            kind: "Item",
                                            layoutKind: "HFlexLayout",
                                            style: "width: 250px",
                                            components: [ {
                                                    kind: "Image",
                                                    name: "scene"
                                                }, {
                                                    kind: "VFlexBox",
                                                    flex: 1,
                                                    components: [ {
                                                            flex: 1
                                                        }, {
                                                            kind: "HFlexBox",
                                                            components: [ {
                                                                    flex: 1
                                                                }, {
                                                                    kind: "StatefulCheckBox",
                                                                    name: "sceneIsActive",
                                                                    onChange: "sceneChecked"
                                                                }, {
                                                                    flex: 1
                                                                }
                                                            ]
                                                        }, {
                                                            flex: 1
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }, {
                            flex: 1
                        }, {
                            kind: "Button",
                            caption: "Save",
                            onclick: "saveSettings",
                            className: "enyo-button-affirmative"
                        }
                    ]
                }
            ]
        }
    ],
    
    active: false,
    
    saveCallback: function() {},
    cancelCallback: function() {},
    
    showSettingsPopup: function(wind, refreshRate, activeScenes, clockLocation, clockType) {
        this.$.windSpeed.setValue(wind);
        this.$.refresh.setValue(refreshRate);
        this.$.clockLocation.setValue(clockLocation);
        this.$.clockType.setValue(clockType);
        
        this.active = [];
        
        for(var i = 0; i < window.scenes.length; i++)
            this.active.push(false);
        
        for(var i = 0; i < activeScenes.length; i++)
            this.active[activeScenes[i]] = true;
        
        this.$.scenes.refresh();
        
        this.openAtCenter();
    },
    
    setupSceneRow: function(sender, index) {
        if(0 <= index && index < window.scenes.length) {
            this.$.scene.setSrc(window.scenes[index].thumbnail);
            this.$.sceneIsActive.setChecked(this.active[index]);
            this.$.sceneIsActive.setRowindex(index);
            return true;
        }
    },
    
    sceneChecked: function(sender) {
        this.active[sender.getRowindex()] = sender.checked;
    },
    
    saveSettings: function() {
        var scenes = [];
        
        for(var i = 0; i < this.active.length; i++)
            if(this.active[i])
                scenes.push(i);
        
        if(this.saveCallback)
            this.saveCallback(this.$.windSpeed.getValue(), this.$.refresh.getValue(), scenes, this.$.clockLocation.getValue(), this.$.clockType.getValue());
        
        this.close();
    },
    
    cancelSettings: function() {
        if(this.cancelCallback)
            this.cancelCallback();
            
        this.close();
    }
});
