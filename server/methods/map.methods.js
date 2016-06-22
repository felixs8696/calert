Meteor.methods({
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
