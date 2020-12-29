     function resizeMoveListener(event){
        var target = event.target,
      		x = (parseFloat(target.dataset.x) || 0),
      		y = (parseFloat(target.dataset.y) || 0);
    
	        // update the element's style
	        target.style.width  = event.rect.width + 'px';
	        target.style.height = event.rect.height + 'px';
	    
	        // translate when resizing from top or left edges
	        x += event.deltaRect.left;
	        y += event.deltaRect.top;
	        updateTranslate(target,x,y);
      }
      
      function dragMoveListener (event) {
        var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.dataset.x) || 0) + event.dx,
        y = (parseFloat(target.dataset.y) || 0) + event.dy;
        updateTranslate(target,x,y);
      }
      
      function updateTranslate(target, x, y){
        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';
    
        // update the position attributes
        target.dataset.x = x;
        target.dataset.y =  y;
      }
 
    function insertImage(){
      var $img = document.createElement('img');
      $img.setAttribute('src','http://www.nationalprayerchapel.com/wp-content/uploads/2012/02/apple-logo-64x64.gif?294f74');
      $img.setAttribute('class','resize-drag');
      document.querySelector(".container-wrap").appendChild($img);
      
      var rect = document.querySelector(".container-wrap").getBoundingClientRect();
      $img.style.left =  rect.left;
      $img.style.top = rect.top;
    }
    function dataTransfer(){
      
      //cleanup
      var $out = document.querySelector(".out-container-wrap");
      while ($out.hasChildNodes()) {
          $out.removeChild($out.lastChild);
      }
      
      //get source
      var source = document.querySelector('.container-wrap')
      
      //get data
      var data = getSource(source);
      
      //add data to target
      setSource($out,data);
    
    }
    
    /**
     * Get data from source div
     */
    function getSource(source){
      var images = source.querySelectorAll('img');
      var text = source.querySelector('div').textContent;
      
      //build the js object and return it.
      var data = {};
      data.text = text;
      
      data.image = [];
      
      for(var i=0;i<images.length;i++){
        var img = {}
        img.url = images[i].src
        img.x = images[i].dataset.x;
        img.y = images[i].dataset.y;
        img.h = images[i].height;
        img.w = images[i].width;
        
        data.image.push(img)
      }
      return data;
    }
    
    function setSource(target, data){
      
      //set the images.
       for(var i=0;i<data.image.length;i++){
         
        var d = data.image[i];
        
        //build a new image
        var $img = document.createElement('img');
        $img.src = d.url;
        $img.setAttribute('class','resize-drag');
        $img.width = d.w;
        $img.height = d.h;
        $img.dataset.x = d.x;
        $img.dataset.y = d.y;
        
        
        var rect = target.getBoundingClientRect();
        $img.style.left =  parseInt(rect.left);
        $img.style.top = parseInt(rect.top);
        //transform: translate(82px, 52px)
        $img.style.webkitTransform =  $img.style.transform =  'translate('+$img.dataset.x+'px,'+$img.dataset.y+'px)';
        //$img.style.setProperty('-webkit-transform', 'translate('+$img.dataset.x+'px,'+$img.dataset.y+'px)');
        target.appendChild($img);
      }
      
      //make a fresh div with text content
      var $outContent = document.createElement('div')
      $outContent.setAttribute('class','out-container-content');
      $outContent.setAttribute('contenteditable','true');
      $outContent.textContent = data.text;
      
      target.appendChild($outContent);
    }
    
    interact('.resize-drag')
      .draggable({
        onmove: dragMoveListener,
        inertia:true,
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        onmove:resizeMoveListener
      })


       $(function() {
    $('textarea').froalaEditor()
  });
