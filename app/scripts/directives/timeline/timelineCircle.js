angular.module('youScriberApp').directive('timelineCircle', function($document, Player) {
  return {
    restrict: 'E',
    scope: { 
      time: '=',    
      duration: '=',
      width: '='
    },
    replace: true,
    templateUrl: 'views/directives/timelineCircle.html',
    link: function (scope, iElement, iAttrs, controller) {

      var startX = 0, x = 0;

      var isDragging = false;

      scope.style = {
        top: 0,
        left: '50px',
      };

      iElement.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      isDragging = true;
        event.preventDefault();
        startX = event.pageX - x;
        // startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        // y = event.pageY - startY;
        x = event.pageX - startX;
        iElement.css({
          // top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        isDragging=false;
        
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);



        console.log(iElement.position());
      }

      // iElement.on('click', function(){

      // })
      // scope.Math = window.Math;
      // scope.seekToComment = function(t, evt) {
      //   evt.preventDefault();
      //   $rootScope.$emit('seek-to', t);
      // };

      // scope.seekToPosition = function(evt){
      //   console.log(evt);

      // };

      // scope.isCurrentComment = function(comment){
      //   var delta = scope.time - comment.time;
      //   var result = 0<=delta && delta < 1.3;
      //   return result;
      // };
      scope.$watch('time', function(newValue, oldValue) {
        // console.log(newValue);
        // console.log(scope.duration);
        // console.log(newValue/scope.duration);
        // console.log(iElement.position());
        // iElement.position(newValue, 0);
        if (!isDragging) {
          scope.style.left=newValue/scope.duration*scope.width+'px';
        }
      });
    }
  };
});