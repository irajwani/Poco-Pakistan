import { createStackNavigator } from 'react-navigation';
import ProfilePage from '../views/ProfilePage';
import EditProfile from '../views/EditProfile';
import MultiplePictureCamera from '../components/MultiplePictureCamera';
import MultipleAddButton from '../components/MultipleAddButton';

export const profileToEditProfileStack = createStackNavigator({
    ProfilePage: ProfilePage,
    EditProfile: EditProfile,
    MultipleAddButton: MultipleAddButton,
    MultiplePictureCamera: MultiplePictureCamera,
},
{
    initialRouteName: 'ProfilePage',
})

