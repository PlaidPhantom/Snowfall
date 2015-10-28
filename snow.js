(function() {

    var startSnowfall = function() {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundAttachment = 'fixed';
        
        var bg = document.createElement('canvas');
        
        bg.width = window.screen.availWidth;
        bg.height = window.screen.availHeight;
        bg.id = 'snowfallCanvas';
        bg.style.position = 'fixed';
        bg.style.top = '0px';
        bg.style.left = '0px';
        bg.style.zIndex = 1;
        
        document.body.appendChild(bg);
        
        var snowfallContext = {
            // builtins
            snowflakeMinSpeed: 15,
            snowflakeSpeed: 40,
            snowflakeImage: new Image(),
            framerate: 20,
            
            snowflakes: [],
            
            animationHandle: false,
        };
        
        var snowfall = function() {
            var canvas = document.getElementById('snowfallCanvas');
            
            if(Math.random() > .5 && this.snowflakes.length < 250) {
                this.snowflakes.push({
                    x: Math.random() * canvas.width,
                    y: -32,
                    scale: Math.random() * .75 + .25,
                    speed: (Math.random() * (this.snowflakeSpeed - this.snowflakeMinSpeed) + this.snowflakeMinSpeed) / this.framerate
                });
            }
            
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            for(var i = 0; i < this.snowflakes.length; i++) {
                this.snowflakes[i].y += this.snowflakes[i].speed;
                
                if(this.snowflakes[i].y > canvas.height) {
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
        }
        
        var startAnimationLoop = function() {
            snowfallContext.animationHandle = setInterval(function() { snowfall.apply(snowfallContext); }, 1000 / snowfallContext.framerate);
        }
        
        try {
            snowfallContext.snowflakeImage.addEventListener('load', startAnimationLoop, false);
        }
        catch(e) {
            snowfallContext.snowflakeImage.attachEvent('onload', startAnimationLoop);
        }
        
        snowfallContext.snowflakeImage.src = 'images/snowflake.png';
    }
    
    //check for browser canvas support before starting snowfall.
    var canvas = document.createElement('canvas');
    
    if(canvas && canvas.getContext) {
        try {
            window.addEventListener('load', startSnowfall, false);
        }
        catch(e) {
            window.attachEvent('onload', startSnowfall);
        }
    }

})();
