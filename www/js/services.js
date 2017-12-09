angular.module('starter.services', [])

  .service('LoginService', function ($q) {
    return {
      loginUser: function (name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        if (name == 'Jazmin' && pw == '123') {
          deferred.resolve('Welcome ' + name + '!');
        } else {
          deferred.reject('Wrong credentials.');
        }
        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        }
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        }
        return promise;
      }
    }
  })

  .service('VideoService', function ($q) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    promise.success = function (fn) {
      promise.then(fn);
      return promise;
    }
    promise.error = function (fn) {
      promise.then(null, fn);
      return promise;
    }
  })

  .factory('FileService', function () {
    var images;
    var IMAGE_STORAGE_KEY = 'images';

    function getImages() {
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
      if (img) {
        images = JSON.parse(img);
      } else {
        images = [];
      }
      return images;
    };

    function addImage(img) {
      images.push(img);
      window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
    };

    return {
      storeImage: addImage,
      images: getImages
    }
  })

  
.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {
  
   function makeid() {
     var text = '';
     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
     for (var i = 0; i < 5; i++) {
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     }
     return text;
   };
  
   function optionsForType(type) {
     var source;
     switch (type) {
       case 0:
         source = Camera.PictureSourceType.CAMERA;
         break;
       case 1:
         source = Camera.PictureSourceType.PHOTOLIBRARY;
         break;
     }
     return {
       destinationType: Camera.DestinationType.FILE_URI,
       sourceType: source,
       allowEdit: false,
       encodingType: Camera.EncodingType.JPEG,
       popoverOptions: CameraPopoverOptions,
       saveToPhotoAlbum: false
     };
   }
  
   function saveMedia(type) {
     return $q(function(resolve, reject) {
       var options = optionsForType(type);
  
       $cordovaCamera.getPicture(options).then(function(imageUrl) {
         var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
         var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
         var newName = makeid() + name;
         $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
           .then(function(info) {
             FileService.storeImage(newName);
             resolve();
           }, function(e) {
             reject();
           });
       });
     })
   }
   return {
     handleMediaDialog: saveMedia
   }
 })


.factory('Chats', function () {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function () {
      return chats;
    },
    remove: function (chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function (chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
