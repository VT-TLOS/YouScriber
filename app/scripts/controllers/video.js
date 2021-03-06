/* global angular */
'use strict'

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  var seconds = sec_num - (hours * 3600) - (minutes * 60)

  if (hours < 10) { hours = '0' + hours }
  if (minutes < 10) { minutes = '0' + minutes }
  if (seconds < 10) { seconds = '0' + seconds }
  var time = hours + ':' + minutes + ':' + seconds
  return time
}

angular.module('youScriberApp').controller('VideoCtrl', function ($scope, $window, $stateParams, $location, $rootScope, Videos, User, Player, $state, $timeout) {
  $scope.videoId = $stateParams.videoId // this is the video's id in OUR database
  // $scope.videoYTId
  $scope.videoIdInProgress = $scope.videoId
  // $scope.videoMetadata = {}

  $scope.userService = User

  $scope.editorInitialized = false

  $scope.Math = window.Math

  if ($stateParams.hasOwnProperty('videoId')) {
    console.log('found video id:', $stateParams.videoId)
    $scope.videoId = $stateParams.videoId
    Videos.getVideo($scope.videoId)
      .then((result) => {
        console.log('result', result)
      }, (err) => {
        console.log('error', err)
      })
  } // if we go in here, everything else needs to wait... have a race problem here?

  $scope.videosService = Videos
  console.log(Videos.currentVideo)
  $scope.videoYTId = Videos.currentVideo.ytid
  console.log($scope.videoYTId)

  $scope.comments = {}

  $scope.playerId = Player.playerId
  $scope.newComment = ''
  // $scope.player = false
  $scope.playerService = Player

  $scope.thumbnails = function () {
    var thumbs = []
    // for (var i=0; i<$scope.videoMetadata.entry.media$group.media$thumbnail.length; i++) {
    $scope.videoMetadata.entry.media$group.media$thumbnail.forEach(function (item) {
      thumbs.push(item.url)
    })
    return thumbs
  }

  $scope.maybeCancel = function (keyEvent) {
    if (keyEvent.keyCode === 27) {
      $scope.newComment = ''
      $scope.playerService.playVideo()
    }
  }

  $scope.commentData = {
    htmlComment: ''
  }

  $scope.post = function () {
    console.log($scope.playerService)
    $scope.playerService.playVideo()
    // var scp = $scope
    // $timeout(function () {
    // console.log('POOOOOOOSTT', '|', $scope.commentData.htmlComment, '|', $scope)
    var theNewComment = {
      time: $scope.playerService.getCurrentTime(),
      comment: $scope.commentData.htmlComment
    }

    Videos.addComment(theNewComment)

    $scope.commentData.htmlComment = ''
  }

  $scope.keyUp = function () {
    if ($scope.playerService.isPlaying()) {
      console.log('pause video')
      $scope.playerService.pauseVideo()
    }
  }

  $scope.typing = function () {
    console.log('typing')
    $scope.playerService.pauseVideo()
  }

  $scope.videoTime = 0

  // $timeout(function() { // some horrible hacking to autofocus the editor: https://github.com/fraywing/textAngular/issues/74
  //   var editor = textAngularManager.retrieveEditor('editor1')
  //   console.log('editor', editor)
  //   var editorScope = editor.scope
  //   window.editorScope = editorScope
  //   $timeout(function() {
  //     editorScope.displayElements.text[0].focus()
  //     $scope.editorInitialized = true
  //   })
  // })

  $scope.$on('$destroy', function () {
    // TODO: cancel timer(s) created by yt directive!
    Videos.currentVideo = {}
  })

  $scope.settings = function () {
    console.log('about to state.go video.comments.settings')
    $state.go('video.comments.settings')
  }

  console.log('video js scope', $scope)
}).filter('timefilter', function () {
  return function (input) {
    if (Array.isArray(input)) {
      input.sort(function (a, b) { return a.time - b.time })
    }
    return input
  }
}).filter('secondsfilter', function () {
  return function (input) {
    if (input) {
      input = input.toString()
      return input.toHHMMSS()
    }
    return input
  }
})
