enyo.kind({
	name: "Snowfall",
	kind: enyo.VFlexBox,
	components: [ {
            kind: "Canvas",
            name: "scene",
            width: 1024,
            height: 768,
            className: "scene"
        }, {
            kind: "Canvas",
            name: "snow",
            width: 1024,
            height: 768,
            className: "snow",
            onmousedown: "startTapWait",
            onmouseup: "endTapWait",
            onmouseout: "endTapWait"
        }, {
            name: "clock",
            className: "clock bottomleft",
            onmousedown: "startTapWait",
            onmouseup: "endTapWait",
            onmouseout: "endTapWait"
        }, {
            kind: "ApplicationEvents",
            onWindowActivated: "startSnowfall",
            onWindowDeactivated: "pauseSnowfall"
        }, {
            kind: "SnowfallSettings",
            name: "snowSettings",
            lazy: false
        }, {
            name: "startPopup",
            kind: "Popup",
            modal: true,
            dismissWithClick: true,
            style: "width: 50%;",
            components: [ {
                    content: "<p>Thanks for purchasing Snowfall! Snowfall is an exhibition app which displays snow falling over a variety of backgrounds.</p>"
                           + "<p>You can switch to the next background by tapping on the screen.  If you tap and hold on the screen, a Preferences dialog will pop up and let you change how the app looks and behaves.</p>",
                    allowHtml: true
                }, {
                    kind: "Button",
                    onclick: "closeStartPopup",
                    caption: "Let it Snow!",
                    className: "enyo-button-affirmative"
                }
            ]
        }
	],
    
    // builtins
    snowflakeMinSpeed: 15,
    snowflakeSpeed: 40,
    framerate: 20,
    snowflakeImage: false,
    groundLevel: 737,
    
    snowflakes: [],
    
    // operational variables
    scene: 0,
    animationHandle: false,
    swapHandle: false,
    tapWaitTimeout: false,
    running: false,
    clockHandle: false,
    accumulation: 0,
    
    // settings
    wind: 0,
    activeScenes: [0, 1],
    refreshRate: 5,
    clockLocation: "bottomleft",
    clockType: 12,
    
    startSnowfall: function() {
        if(!this.animationHandle) {
            this.animationHandle = setInterval(function() {
                if(!this.running) {
                    this.running = true;
                    try {
                        this.snowfall();
                    }
                    catch(e) {
                        this.running = false;
                        throw e;
                    }
                    
                    this.running = false;
                }
                else {
                    enyo.log('Skipping frame.');
                }
            }.bind(this), 1000 / this.framerate);
            
            if(this.refreshRate !== 0)
                this.swapHandle = setInterval(this.swapScene.bind(this, false), this.refreshRate * 60 * 1000);
            
            this.clockHandle = setInterval(this.setClock.bind(this), 500);
        }
    },
    
    pauseSnowfall: function() {
        if(this.animationHandle) {
            clearInterval(this.animationHandle);
            this.animationHandle = false;
        }
        
        if(this.swapHandle) {
            clearInterval(this.swapHandle);
            this.swapHandle = false;
        }
        
        if(this.clockHandle) {
            clearInterval(this.clockHandle);
            this.clockHandle = false;
        }
        
        this.endTapWait();
    },
    
    setClock: function() {
        var date = new Date();
        
        var hours = date.getHours();
        var time = (this.clockType == 24 ? hours : (hours % 12 == 0 ? 12 : hours % 12))
                 + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        
        this.$.clock.setContent(time);
    },
    
    startTapWait: function() {
        this.tapWaitTimeout = setTimeout(function() {
            this.tapWaitTimeout = false;
            this.showSettings();
        }.bind(this), 1000);
    },
    
    endTapWait: function() {
        if(this.tapWaitTimeout) {
            clearTimeout(this.tapWaitTimeout);
            this.tapWaitTimeout = false;
            this.swapScene(false);
            
            if(this.swapHandle) {
                clearInterval(this.swapHandle);
                this.swapHandle = false;
            }
            
            if(this.refreshRate !== 0)
                this.swapHandle = setInterval(this.swapScene.bind(this, false), this.refreshRate * 60 * 1000);
        }
    },
    
    rendered: function() {
        this.snowflakeImage = new Image();
        this.snowflakeImage.src = 'images/snowflake.png';
        
        var settings = enyo.getCookie('settings');
        
        if(settings) {
            settings = enyo.json.parse(settings);
            
            this.wind = settings.wind;
            this.activeScenes = settings.activeScenes;
            this.refreshRate = settings.refreshRate;
            this.clockLocation = settings.clockLocation ? settings.clockLocation : 'bottomleft';
            this.clockType = settings.clockType ? settings.clockType : 12;
        }
        else {
            this.activeScenes = [];
            
            for(var i = 0; i < window.scenes.length; i++)
                this.activeScenes.push(i);
            
            this.wind = 0;
            this.refreshRate = 5;
            this.clockLocation = "bottomleft";
            this.clockType = 12;
            
            enyo.setCookie('settings', enyo.json.stringify({
                wind: this.wind,
                activeScenes: this.activeScenes,
                refreshRate: this.refreshRate,
                clockLocation: this.clockLocation,
                clockType: this.clockType,
                settingsVersion: 1
            }));
            
            this.$.startPopup.openAtCenter();
        }
        
        this.$.clock.removeClass('topleft');
        this.$.clock.removeClass('topright');
        this.$.clock.removeClass('bottomleft');
        this.$.clock.removeClass('bottomright');
        this.$.clock.removeClass('center');
        this.$.clock.removeClass('hidden');
        this.$.clock.addClass(this.clockLocation);
        
        enyo.setAllowedOrientation('landscape');
        
        this.swapScene(true);
    },
    
    snowfall: function() {
        if(Math.random() > .4 && this.snowflakes.length < 250) {
            this.snowflakes.push({
                x: Math.random() * 1040 - 16,
                y: -32,
                scale: Math.random() * .75 + .25,
                speed: (Math.random() * (this.snowflakeSpeed - this.snowflakeMinSpeed) + this.snowflakeMinSpeed) / this.framerate
            });
        }
        
        var context = this.$.snow.getContext('2d');
        context.clearRect(0, 0, this.$.snow.getWidth(), this.$.snow.getHeight());
        
        for(var i = 0; i < this.snowflakes.length; i++) {
            this.snowflakes[i].y += this.snowflakes[i].speed;
            
            this.snowflakes[i].x += this.wind;
            
            while(this.snowflakes[i].x < -16)
                this.snowflakes[i].x += 1040;
            
            while(this.snowflakes[i].x > 1024)
                this.snowflakes[i].x -= 1040;
            
            if(this.stopAt(this.snowflakes[i].x, this.snowflakes[i].y)) {
                var scene = this.$.scene.getContext('2d');
                
                scene.drawImage(this.snowflakeImage, 0, 0, this.snowflakeImage.width, this.snowflakeImage.height,
                                this.snowflakes[i].x,
                                this.snowflakes[i].y,
                                this.snowflakeImage.width * this.snowflakes[i].scale,
                                this.snowflakeImage.height * this.snowflakes[i].scale);
                
                this.snowflakes.splice(i, 1);
                i--;
            }
            else {
                context.drawImage(this.snowflakeImage, 0, 0, this.snowflakeImage.width, this.snowflakeImage.height,
                                  this.snowflakes[i].x,
                                  this.snowflakes[i].y,
                                  this.snowflakeImage.width * this.snowflakes[i].scale,
                                  this.snowflakeImage.height * this.snowflakes[i].scale);
            }
        }
    },
    
    stopAt: function(x, y) {
        if(y > this.groundLevel - this.accumulation) {
            this.accumulation += 1.0 / 1040.0;
            
            if(this.groundLevel - this.accumulation < 0)
                this.swapScene(false);
            
            return true;
        }
        else
            return false;
    },
    
    swapScene: function(reset) {
        if(reset)
            this.scene = 0;
        else {
            this.scene++;
            if(this.scene == this.activeScenes.length)
                this.scene = 0;
        }
        
        this.accumulation = 0;
        
        this.$.clock.removeClass('clock-light');
        this.$.clock.removeClass('clock-dark');
        this.$.clock.addClass('clock-' + window.scenes[this.activeScenes[this.scene]].scenetype);
        
        var img = new Image();
        
        img.addEventListener('load', function() {
            var context = this.$.scene.getContext('2d');
            context.drawImage(img, 0, 0, 1024, 768);
        }.bind(this), false);
        
        img.src = window.scenes[this.activeScenes[this.scene]].image;
    },
    
    showSettings: function() {
        this.pauseSnowfall();
        this.$.snowSettings.saveCallback = this.setOptions.bind(this);
        this.$.snowSettings.cancelCallback = this.startSnowfall.bind(this);
        this.$.snowSettings.showSettingsPopup(this.wind, this.refreshRate, this.activeScenes, this.clockLocation, this.clockType);
    },
    
    setOptions: function(windSpeed, refresh, scenes, clockLocation, clockType) {
        this.wind = windSpeed;
        this.refreshRate = refresh;
        this.activeScenes = scenes;
        this.clockLocation = clockLocation;
        this.clockType = clockType;
        this.swapScene(true);
        
        this.$.clock.removeClass('topleft');
        this.$.clock.removeClass('topright');
        this.$.clock.removeClass('bottomleft');
        this.$.clock.removeClass('bottomright');
        this.$.clock.removeClass('center');
        this.$.clock.removeClass('hidden');
        this.$.clock.addClass(clockLocation);
        
        enyo.setCookie('settings', enyo.json.stringify({
            wind: windSpeed,
            activeScenes: scenes,
            refreshRate: refresh,
            clockLocation: clockLocation,
            clockType: clockType,
            settingsVersion: 1
        }));
        
        this.startSnowfall();
    },
    
    closeStartPopup: function() {
        this.$.startPopup.close();
    }
});
