const functions = require('firebase-functions');
const Chatkit = require('@pusher/chatkit-server');


const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/7a5d48bb-1cda-4129-88fc-a7339330f5eb/token";
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:7a5d48bb-1cda-4129-88fc-a7339330f5eb";

const chatkit = new Chatkit.default({
    instanceLocator: CHATKIT_INSTANCE_LOCATOR,
    key: CHATKIT_SECRET_KEY,
});
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();





// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//FUNCTION NUMBAH 1 :
exports.createNewUser = functions.database.ref('/Users/{uid}/{profile}/uri/').onUpdate( 
    (snapshot, context) => { 
    console.log('User edited profile and added name');
    var uri = snapshot.after.val();
    var name = context.params.profile.name;
    var uid = context.params.uid;
    console.log(uri, name, uid);
    
    
    chatkit.createUser({
        id: uid,
        name: name,
        avatarURL: uri})
        .then( () => {
            console.log('success');
            return null})
        .catch( () => {console.log('user already exists')});
    //and if the user doesn't already have a room, right now the promise will be rejected 
    //and this function will update the user's properties.
    chatkit.updateUser({
        id: uid,
        name: name,
        avatarURL: uri
      }).then(() => {
          console.log('User updated successfully');
          return null
        }).catch((err) => {
          console.log(err);
        });
        
    chatkit.getUsers()
        .then((res) => {
            console.log(res);
            return null
        }).catch((err) => {
            console.log(err);
        });    
    
    return null;
} );
