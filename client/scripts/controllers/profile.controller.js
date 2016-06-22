import { Controller } from '../entities';

export default class ProfileCtrl extends Controller {
  constructor(FormConstantsService, MarkerProfileService) {
    super(...arguments);
    this.pro_pic = 'http://felixsu.com/content/backgrounds/felix_guitar.jpg';
    this.cover_pic = 'https://s31.postimg.org/k33jcdhgr/stairs.jpg';
    this.user = Meteor.user();
    this.genders = FormConstantsService.genders;
    this.MarkerProfileService = MarkerProfileService;
    this.editMode = false;

    this.profile = this.user.profile;
    this.profile.emails = this.user.emails;
    this.profile.firstName = this.parseFirstName();
    this.profile.lastName = this.parseLastName();
  }

  parseFirstName() {
    var firstname = this.user.profile.firstName;
    if (firstname) return firstname;
    return this.user.profile.name.split(' ')[0];
  }

  parseLastName() {
    var lastname = this.user.profile.lastName;
    if (lastname) return lastname;
    return this.user.profile.name.split(' ')[1];
  }

  submitChanges() {
    console.log(this.profile);
    this.MarkerProfileService.setProfile(this.profile, (user) => {
      console.log(user);
    });
  }
}

ProfileCtrl.$inject = ['FormConstantsService', 'MarkerProfileService'];
