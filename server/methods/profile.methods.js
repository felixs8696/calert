Meteor.methods({
  setProfile: function(profileObj) {
    Meteor.users.update({_id: Meteor.userId()}, {$set: {profile: profileObj}});
    return Meteor.users.findOne({_id: Meteor.userId()});
  }
});
