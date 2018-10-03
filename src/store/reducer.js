import firebase from '../cloud/firebase'

const initialState = {
    
    showSignIn: false,
    loading: false,
    loggedIn: false,

}

//Taking the state and modifying it with some sort of action
const reducer = (state = initialState, action) => {
    const newState = {...state};

    switch(action.type) {
        case 'onSignInPress' :

            newState.loading = true;
            //hopefully this forcibly renders pacman:
            setTimeout(() => {
                firebase.auth().signInWithEmailAndPassword(action.email, action.pass);
                newState.loading = false;
                newState.loggedIn = true;
            }, 2000);
            //newState.uid = firebase.auth().currentUser.uid
            // var {uid} = newState;
            // promiseToGetData(uid, newState)
            // .then( (fromResolve) => { newState.data = fromResolve; newState.paths = getPaths(fromResolve); console.log(newState)  })
            break;
        case 'showSignIn':

            newState.showSignIn = true;
            break;
            
        // firebase.auth().signInWithEmailAndPassword(action.email, action.pass)
            //     .then( () => {
                    
            //         var bool = false;
            //         firebase.auth().onAuthStateChanged(
            //             (user) => {
            //                 if(user) { newState.loggedIn = true; newState.loading = false; return newState} 
            //                 else {console.log('no user found')}
            //             }
            //         )
                    
            //     })
            // return newState;
        
        
    }

    return newState;
    
}

export default reducer;