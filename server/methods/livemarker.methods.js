Meteor.methods({
  getLiveMarkerCursor: function() {
    return LiveMarkers.find();
  },
  getLiveMarkerArray: function() {
    return LiveMarkers.find({}).fetch();
  },
  addLiveMarker: function(livemarker) {
    var newId = LiveMarkers.insert(livemarker);
    return LiveMarkers.findOne({_id: newId});
  }
});
