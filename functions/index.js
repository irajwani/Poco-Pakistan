const functions = require('firebase-functions');
const Chatkit = require('@pusher/chatkit-server');
const {CHATKIT_SECRET_KEY, CHATKIT_INSTANCE_LOCATOR} = require('./keys.js')
///Users/{uid}/{profile}/uri/
const chatkit = new Chatkit.default({
    instanceLocator: CHATKIT_INSTANCE_LOCATOR,
    key: CHATKIT_SECRET_KEY,
});
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


//local functions:
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds/86400);
    
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//FUNCTION NUMBAH 0:
exports.deleteConversation = functions.database.ref('/Users/{uid}/conversations/{roomId}/').onDelete( 
    (snapshot, context) => {
    
    var roomId = context.params.roomId;
    
    chatkit.deleteRoom({
        id: roomId
    })
    .then(() => {

        return null
    })
    .catch((err) => console.log(`failed to delete room: ${roomId} because of: ${err}`))

    }
)

//FUNCTION NUMBAH 1 :
exports.createNewUser = functions.database.ref('/Users/{uid}/profile/').onCreate( 
    (snapshot, context) => {
        //maybe do on oncreate for profile and then access uri and name 
    // console.log('User edited profile and added name');
    var profile = snapshot.val();
    var name = profile.name;
    var uri = profile.uri;
    var uid = context.params.uid;
    // console.log(context.params.profile);
    // console.log(name);
    // console.log(uri, name, uid);
    
    
    chatkit.createUser({
        id: uid,
        name: name,
        })
        .then( () => {
            console.log('success');
            return null})
        .catch( () => {console.log('user already exists or failed to create new user')});
    //and if the user doesn't already have a room, right now the promise will be rejected 
    //and this function will update the user's properties.
    // chatkit.updateUser({
    //     id: uid,
    //     name: name,
    //     avatarURL: uri
    //   }).then(() => {
    //       console.log('User updated successfully');
    //       return null
    //     }).catch((err) => {
    //       console.log(err);
    //     });
        
    // chatkit.getUsers()
    //     .then((res) => {
    //         console.log(res);
    //         return null
    //     }).catch((err) => {
    //         console.log(err);
    //     });    
    
    return null;
} );
//FUNCTION NUMBAH 2
//Going to assume people will only change their pictures, and not their names
exports.updateOldUser = functions.database.ref('/Users/{uid}/{profile}/uri').onWrite( 
    (snapshot, context) => { 
    // console.log('User updated profile picture');
    var uri = snapshot.after.val();
    var uid = context.params.uid;
    // console.log(uri, uid);
    
    chatkit.updateUser({
        id: uid,
        avatarURL: uri
      }).then(() => {
          console.log('User updated successfully');
          return null
        }).catch((err) => {
          console.log(err);
        });
        
    
    return null;
} );

//FUNCTION NUMBAH 3
//Problem: When user deletes all products, it wipes away the whole products branch. 
//Fix: This func creates an empty products branch for the user.
// exports.updateEmptyProducts = functions.database.ref('/Users/{uid}/products').onDelete(
//     (snapshot, context) => {
//         console.log(`User: ${context.params.uid} deleted all products`);
//         var updates = {};
        
//         updates['/Users/' + context.params.uid + '/products/'] = '';
//         admin.database().ref().update(updates);

//         return null;
//     }
// )

//FUNCTION NUMBAH 4
//TODO: need to add another wildcard of room Id
exports.populateConversations = functions.database.ref('Users/{uid}/lastMessage/{roomId}/').onWrite(
    (snapshot, context) => {
        var lastMessage = snapshot.after.val();
        var roomId = context.params.uid;
        var uid = context.params.uid;
        console.log(lastMessage, uid);
        admin.database().ref().once("value", (snapshot) => {
            var d = snapshot.val();
            chatkit.getRoomMessages({
                roomId: roomId,
                direction: "newer",
                limit: 1
            })
            .then( (roomMessages) => {
                console.log(roomMessages);
                // var lastMessageText = false, lastMessageSenderIdentification = false, lastMessageDate = false;
                // if(roomMessages.length > 0) {
                //   lastMessageText = (roomMessages['0'].text).substr(0,40);
                //   lastMessageDate = new Date(roomMessages['0'].updated_at).getDay();
                //   lastMessageSenderIdentification = roomMessages['0'].user_id;
                // }
                // var buyerIdentification = room.created_by_id;
                // var buyer = d.Users[buyerIdentification].profile.name;
                // var buyerAvatar = d.Users[buyerIdentification].profile.uri;
                // var sellerIdentification = room.member_user_ids.filter( (id) => id !== buyerIdentification )[0];
                // var seller = d.Users[sellerIdentification].profile.name;
                // var sellerAvatar = d.Users[sellerIdentification].profile.uri;
                // var productIdentification = room.name.split(".")[0];
                // var productImageURL = d.Users[sellerIdentification].products[productIdentification].uris[0]
                // var obj = { 
                //   productSellerId: sellerIdentification, productImageURL: productImageURL, 
                //   createdByUserId: buyerIdentification, name: room.name, id: room.id, 
                //   buyerIdentification, sellerIdentification,
                //   seller: seller, sellerAvatar: sellerAvatar, 
                //   buyer: buyer, buyerAvatar: buyerAvatar,
                //   lastMessageText, lastMessageDate, lastMessageSenderIdentification
                // };
                // var updates = {};
                // updates['Users/' + buyerIdentification + '/conversations/' + room.id + '/' ] = obj
                // admin.database().ref().update(updates);
                // updates['Users/' + sellerIdentification + '/conversations/' + room.id + '/' ] = obj
                // admin.database().ref().update(updates);
                return null
            })
            .catch( (e) => console.log(e));
            // return null
         } )
        
        }
)
        



        // admin.database().ref().once("value", (snapshot) => {
        //     var d = snapshot.val();
        //     var users = Object.keys(d.Users);
        //     //TODO: remove the nested promises by getting all require properties with one chatkit.someMethod
        //     users.forEach((user_id) => {
        //         chatkit.getUserRooms({
        //           userId: user_id,
        //         })
        //           .then((rooms) => {
          
        //             if(rooms.length < 1) {
        //               console.log('user does not have rooms');
        //             }
          
        //             else {
        //               rooms.forEach( (room, index) => {
        //                 if(!index) {
        //                   console.log('skipping Users Room')
        //                 }
        //                 else {
            
        //                   chatkit.getRoomMessages({
        //                     roomId: room.id,
        //                     direction: "newer",
        //                     limit: 1
        //                   })
        //                   .then( (roomMessages) => {
        //                     var lastMessageText = false, lastMessageSenderIdentification = false, lastMessageDate = false;
        //                     if(roomMessages.length > 0) {
        //                       lastMessageText = (roomMessages['0'].text).substr(0,40);
        //                       lastMessageDate = new Date(roomMessages['0'].updated_at).getDay();
        //                       lastMessageSenderIdentification = roomMessages['0'].user_id;
        //                     }
        //                     var buyerIdentification = room.created_by_id;
        //                     var buyer = d.Users[buyerIdentification].profile.name;
        //                     var buyerAvatar = d.Users[buyerIdentification].profile.uri;
        //                     var sellerIdentification = room.member_user_ids.filter( (id) => id !== buyerIdentification )[0];
        //                     var seller = d.Users[sellerIdentification].profile.name;
        //                     var sellerAvatar = d.Users[sellerIdentification].profile.uri;
        //                     var productIdentification = room.name.split(".")[0];
        //                     var productImageURL = d.Users[sellerIdentification].products[productIdentification].uris[0]
        //                     var obj = { 
        //                       productSellerId: sellerIdentification, productImageURL: productImageURL, 
        //                       createdByUserId: buyerIdentification, name: room.name, id: room.id, 
        //                       buyerIdentification, sellerIdentification,
        //                       seller: seller, sellerAvatar: sellerAvatar, 
        //                       buyer: buyer, buyerAvatar: buyerAvatar,
        //                       lastMessageText, lastMessageDate, lastMessageSenderIdentification
        //                     };
        //                     var updates = {};
        //                     updates['Users/' + buyerIdentification + '/conversations/' + room.id + '/' ] = obj
        //                     admin.database().ref().update(updates);
        //                     updates['Users/' + sellerIdentification + '/conversations/' + room.id + '/' ] = obj
        //                     admin.database().ref().update(updates);
        //                     return null;
        //                   })
        //                   .catch( err => {
        //                       console.log(err);
        //                       return null
        //                   } )
            
                          
            
        //                 }
                        
                        
        //               }
            
        //               )
        //             }
                    
                    
          
          
        //             return null;
        //             // console.log(rooms);
        //           })
        //           .catch((err) => {
        //             console.error(err);
        //           });
        //       } )
        //     return null;
        // })
        // return null;



//FUNCTION NUMBAH 5 ?
exports.updateProducts = functions.database.ref('Users/{uid}/{products}').onWrite(
    (snapshot, context) => {
        // console.log('Initializing Reconstruction of Products Branch');
        // console.log(`Before: ${snapshot.before.val()}`)
        // console.log(`After: ${snapshot.after.val()}`)
        admin.database().ref().once("value", (dataFromReference) => {
            var d = dataFromReference.val();
            var uids = Object.keys(d.Users);
            console.log(uids)
            var keys = [];
            //get all keys for each product iteratively across each user
            for(uid of uids) {
                if(Object.keys(d.Users[uid]).includes('products') ) {
                Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
                }
            }
            // console.log(keys.length);
            var products = [];
            var updates;
            var chatUpdates = {};
            var postData;
            var i = 0;
            //go through all products in each user's branch and update the Products section of the database
            for(const uid of uids) {
                for(const key of keys) {

                  

                if( !(i > keys.length - 1) && (i <= keys.length - 1)  && (Object.keys(d.Users[uid]).includes('products')) && (Object.keys(d.Users[uid].products).includes(key)) ) {
                    
                    // console.log(key, uid, i, keys.length);
                            
                    var daysElapsed;
                    var currentProduct = d.Users[uid].products[key];

                    daysElapsed = timeSince(d.Users[uid].products[key].time);
                        
                    postData = {
                        key: key, uid: uid, uris: d.Users[uid].products[key].uris, 
                        text: d.Users[uid].products[key], daysElapsed: daysElapsed, 
                        shouldReducePrice: (daysElapsed >= 10) && (d.Users[uid].products[key].sold === false) ? true : false,
                    }
                        
                        
                    updates = {};    
                    updates['/Products/' + i + '/'] = postData;
                    admin.database().ref().update(updates);
                    i++;
                    // console.log(i);
    
                            
    
                        
                    
                    
                }

                

                

                
                
                }
            }
            
            
            return null;
        })

        return null;
    }
)
