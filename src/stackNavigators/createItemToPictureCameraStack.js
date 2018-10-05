import { createStackNavigator } from 'react-navigation';
import CreateItem from '../views/CreateItem';
import MultipleAddButton from '../components/MultipleAddButton'
import MultiplePictureCamera from '../components/MultiplePictureCamera'


export const multipleAddButtonToMultiplePictureCameraToCreateItemStack = createStackNavigator({

    CreateItem: CreateItem,
    MultiplePictureCamera: MultiplePictureCamera,
    MultipleAddButton: MultipleAddButton,

}, {
    initialRouteName: 'CreateItem'
}
)
