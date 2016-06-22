Meteor.methods({
  getMarkerArray: function() {
    return Markers.find({}).fetch();
  },
  addMarker: function(marker) {
    var newId = Markers.insert(marker);
    return Markers.findOne({_id: newId});
  }
});
