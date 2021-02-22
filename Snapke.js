window.onload = function()
{
    var canvasWidth= 900;
    var canvasHeight= 570;
    var ctx;
    var delay = 100;
    var blockSize= 30;
    var cobra;
    var apple;
    var widthInBlocks= canvasWidth/blockSize;
    var heightInBlocks= canvasHeight/blockSize;
    var centerX= canvasWidth/2;
    var centerY= canvasHeight/2;
    var score;
    var timeout;
    init();
   
    function init()
    {
        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border="20px solid gray";
        canvas.style.margin= "0 auto";
        canvas.style.display= "block";
        canvas.style.backgroundColor= "#ddd";
        document.body.appendChild(canvas);  
        ctx = canvas.getContext('2d');
        cobra = new Snake([[6,4], [5,4], [4,4]], "right"); 
        apple= new Apple([10,10]);
        score= 0;
        refreshCanvas();
    }
    function refreshCanvas()
    {
        cobra.advance();
        if(cobra.checkCollision())
            {
                gameOver();
            }
        else
            {
              do{
                if(cobra.ateApple(apple)){
                    score++;
                    apple.setNewPosition();
                }
              }while(apple.isOnTheSnake0);
        ctx.clearRect(0 ,0 ,canvasWidth, canvasHeight);
        displayScore();
        cobra.draw();
        apple.draw(); 
        timeout= setTimeout(refreshCanvas,delay);
            }
    }
    function gameOver()
    {
        ctx.save();
        ctx.font= "bold 70px sans-serif";
        ctx.fillStyle= "#000";
        ctx.textAlign= "center";
        ctx.textBaseline= "middle";
        ctx.strokeStyle= "white";
        ctx.strokeText("GAME OVER", centerX, centerY-170)
        ctx.fillText("GAME OVER", centerX, centerY-170);
        ctx.font= "bold 30px sans-serif";
        ctx.strokeText("Press The Space bar To Restart", centerX, centerY-120);
        ctx.fillText("Press The Space bar To Restart", centerX, centerY-120);
        ctx.restore();
    }
    function restart()
    {
        cobra = new Snake([[6,4], [5,4], [4,4]], "right"); 
        apple= new Apple([10,10]);
        score= 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    function displayScore()
    {
        ctx.save();
        ctx.font= "bold 200px sans-serif";
        ctx.fillStyle= "gray";
        ctx.textAlign= "center";
        ctx.textBaseline= "middle";
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }
    function drawBlock(ctx, position)
    {
       var x= position[0]*blockSize;
       var y= position[1]*blockSize;
       ctx.fillRect(x ,y , blockSize, blockSize);
    }
    
    function Snake(body, direction)
    {
       this.body = body;
       this.direction= direction;
       this.draw = function()
       {
          ctx.save();
           ctx.fillStyle = "#ff0000";
           for(var i=0 ; i < this.body.length; i++){
               drawBlock(ctx, this.body[i]);
           }
           ctx.restore();
       };
     this.advance= function()
     {
         var nextPosition= this.body[0].slice();
         switch(this.direction)
         {
             case "left":
                  nextPosition[0]--;
                 break;
            case "right":
                  nextPosition[0]++;
                 break;
            case "down":
                  nextPosition[1]++;
                 break;
             case "up":
                  nextPosition[1]--;
                 break;
             default:
                 throw("undefined direction");
         }
         this.body.unshift(nextPosition);
         if(!this.ateApple(apple))
             this.body.pop();
     };
      this.setDirection = function(newDirection)
      {
         var allowedDirection;
          switch(this.direction)
         {
             case "left":
             case "right":
                 allowedDirection= ["up", "down"];
                 break;
             case "down":
             case "up":
                 allowedDirection= ["left", "right"];
                 break;
             default:
                 throw("undefined direction");
         }
          if(allowedDirection.indexOf(newDirection)> -1)
                 this.direction= newDirection;
           };
        this.checkCollision= function()
        {
            var wallsCollision= false;
            var bodyCollision= false;
            var head= this.body[0];
            var rest= this.body.slice(1);
            var headX= head[0];
            var headY= head[1];
            var minX=0;
            var minY=0;
            var maxX= widthInBlocks-1;
            var maxY= heightInBlocks-1;
            var beyondHorizontalWalls= headX>maxX || headX<minX;
            var beyondVerticalWalls= headY>maxY || headY<minY;
            
            if(beyondHorizontalWalls || beyondVerticalWalls)
                wallsCollision= true;
            for(var i=0; i<rest.length; i++){
                if(headX===rest[i][0] && headY===rest[i][1])
                    bodyCollision= true;
            }
                
            return wallsCollision || bodyCollision;
        };
        this.ateApple= function(appleToEat)
        {
            var head= this.body[0];
            if(head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1])
                return true;
            else
                return false;
        };
    }
    
 function Apple(position){
    
     this.position= position;
     this.draw= function()
     {
         var radius= (blockSize/2);
         var x= (this.position[0]*blockSize)+ radius;
         var y= (this.position[1]*blockSize)+ radius;
         ctx.save();
         ctx.fillStyle= "#33cc33";
         ctx.beginPath();
         ctx.arc(x,y, radius, 0, Math.PI*2, true);
         ctx.fill();
         ctx.restore(); 
     };
     this.setNewPosition= function()
     {
         var newX= Math.round(Math.random()* (widthInBlocks-1));
         var newY= Math.round(Math.random()* (heightInBlocks-1));
         this.position=[newX,newY];
     };
     this.isOnTheSnake= function(snake)
     {
         this.snake= snake;
        for(var i=0; i<snake.body.length; i++){
          if(this.position[0]== this.snake.body[i][0] && this.position[1]== this.snake.body[i][1])
              return true;
          else
             return false;
        }
     };
 }

document.onkeydown= function handlekeyDown(e)
{
    var key = e.keyCode;
    var newDirection;
    switch(key)
        {
            case 37:
                newDirection= "left";
                break;
            case 38:
                newDirection= "up";
                break;
            case 39:
                newDirection= "right";
                break;
            case 40:
                newDirection= "down";
                break;
            case 32:
                restart();
                break;
            default:
                return;
        }
    cobra.setDirection(newDirection);
}
                 
         }