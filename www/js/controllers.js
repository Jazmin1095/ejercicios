angular.module('starter.controllers', ['ngCordova'])

.controller('SignatureCtrl', function($scope) {
  var canvas = document.getElementById('signatureCanvas');
  var signaturePad = new SignaturePad(canvas);

  $scope.clearCanvas = function() {
      signaturePad.clear();
  }

  $scope.saveCanvas = function() {
      var sigImg = signaturePad.toDataURL();
      $scope.signature = sigImg;
  }
})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state){
  $scope.data = {};

  $scope.login = function(){
    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data){
      $state.go('tab.dash');
    }).error(function(data){
      var alertPopup = $ionicPopup.alert({
        title: 'Login failes!',
        template: 'Please check your credentials!'
      });
    });
  //  console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
  }
})

.controller('MediaCtrl', function($scope, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
	$scope.allImages = [{
		src : 'img/pic1.jpg'
	}, {
		src : 'img/pic2.jpg'
	}, {
		src : 'img/pic3.jpg'
	}, {
		src : 'img/pic4.jpg'
  }];

  //zoom
  $scope.zoomMin = 1;
    
  $scope.clipSrc = 'img/coffee.MOV';
  
 $scope.playVideo = function() {
   $scope.showModal('templates/video-popover.html');
 }

	$scope.showImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/image-popover.html');
	};
 
	$scope.showModal = function(templateUrl) {
		$ionicModal.fromTemplateUrl(templateUrl, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show();
		});
	}
 
	// Close the modal
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove()
  };
  
  $scope.updateSlideStatus = function(slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
})

.controller('VideoCtrl', function($scope, $cordovaCapture, VideoService) {
    
  $scope.clip = '';
 
  
 $scope.captureVideo = function() {
  var options = {
    limit: 1,
    duration: 10
 };

   $cordovaCapture.captureVideo(Options).then(function(videoData) {
     VideoService.saveVideo(videoData).success(function(data) {
       $scope.clip = data;
       $scope.$apply();
     }).error(function(data) {
       console.log('ERROR: ' + data);
     });
   });
 };
$scope.urlForClipThumb = function(clipUrl) {
	var name = clipUrl.substr(clipUrl.lastIndexOf('/') + 1);
	var trueOrigin = cordova.file.dataDirectory + name;
	var sliced = trueOrigin.slice(0, -4);
	return sliced + '.png';
}
 
$scope.showClip = function(clip) {
	console.log("show clip: " + clip);
}



function createFileEntry(fileURI) {
  window.resolveLocalFileSystemURL(fileURI, function (entry) {
    return copyFile(entry);
  }, fail);
}

function copyFile(fileEntry) {
  var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
  var newName = makeid() + name;

  window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
    fileEntry.copyTo(fileSystem2, newName, function (succ) {
      return onCopySuccess(succ);
    }, fail);
  },
    fail
  );
}

function onCopySuccess(entry) {
  var name = entry.nativeURL.slice(0, -4);
  window.PKVideoThumbnail.createThumbnail(entry.nativeURL, name + '.png', function (prevSucc) {
    return prevImageSuccess(prevSucc);
  }, fail);
}

function prevImageSuccess(succ) {
  var correctUrl = succ.slice(0, -4);
  correctUrl += '.MOV';
  deferred.resolve(correctUrl);
}

function fail(error) {
  console.log('FAIL: ' + error.code);
  deferred.reject('ERROR');
}

// Function to make a unique filename
function makeid() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// The object and functions returned from the Service
return {
  
  saveVideo: function (data) {
    createFileEntry(data[0].localURL);
    return promise;
  }
}

})
.controller('imageController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService) {
 $scope.images = [];
   $scope.addImage = function() {
 
   var options = {
   destinationType : Camera.DestinationType.FILE_URI,
   sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
     allowEdit: true,
     //allowEdit : false,
     encodingType: Camera.EncodingType.JPEG,
     popoverOptions: CameraPopoverOptions,
     saveToPhotoAlbum: true
   };
   
   $cordovaCamera.getPicture(options).then(function(imageData) {
    onImageSuccess(imageData);
    
       function onImageSuccess(fileURI) {
         createFileEntry(fileURI);
       }
       
      function createFileEntry(fileURI) {
       window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
     }

     function copyFile(fileEntry) {
      var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
      var newName = makeid() + name;
 
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
        fileEntry.copyTo(
          fileSystem2,
          newName,
          onCopySuccess,
          fail
        );
      },
      fail);
    }
    
     function onCopySuccess(entry) {
       $scope.$apply(function () {
         $scope.images.push(entry.nativeURL);
       });
     }
     
     function fail(error) {
       console.log("fail: " + error.code);
     }
     
     function makeid() {
       var text = "";
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
       for (var i=0; i < 5; i++) {
         text += possible.charAt(Math.floor(Math.random() * possible.length));
       }
       return text;
     }
    
    }, function(err) {
     console.log(err);
   });
 } 
 $scope.urlForImage = function(imageName) {
  var name = imageName.substr(imageName.lastIndexOf('/') + 1);
  var trueOrigin = cordova.file.dataDirectory + name;
  return trueOrigin;
}
});