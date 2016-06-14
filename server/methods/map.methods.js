Meteor.methods({
  updateMarkers: function(markerIcons) {
    Markers.find({}).forEach((marker) => {
      Markers.update({_id: marker._id}, {$set: {options: {icon: markerIcons[marker.icon]}, id: marker._id}});
    });
    return Markers.find({}).fetch();
  },
  getMarkerArray: function() {
    return Markers.find({}).fetch();
  },
  addMarker: function(marker) {
    var newId = Markers.insert(marker);
    return Markers.findOne({_id: newId});
  },
  addMap: function(map) {
    if (Maps.find({name: map.name}).fetch().length == 0) {
      var id = Maps.insert(map);
      var recMap = Maps.findOne({_id: id});
      recMap.map.markers = Markers.find({mapId: id}).fetch();
      return recMap;
    }
    var recMap = Maps.findOne({name: map.name});
    recMap.map.markers = Markers.find({mapId: recMap._id}).fetch();
    return recMap;
  },
  getMap: function(name) {
    var recMap = Maps.findOne({name: name});
    recMap.map.markers = Markers.find({mapId: recMap._id}).fetch();
    return recMap;
  },
  sendVerificationEmail: function(userId) {
    Accounts.sendVerificationEmail(userId);
    return Meteor.users.findOne({_id: userId});
  }
});
