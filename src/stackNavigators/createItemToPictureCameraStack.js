import { createStackNavigator } from 'react-navigation';
import CreateItem from '../views/CreateItem';
import MultipleAddButton from '../components/MultipleAddButton'



export const multipleAddButtonToMultiplePictureCameraToCreateItemStack = createStackNavigator({

    CreateItem: CreateItem,
    PictureCamera: MultiplePictureCamera,
    MultipleAddButton: MultipleAddButton,

}, {
    initialRouteName: 'CreateItem'
}
)
