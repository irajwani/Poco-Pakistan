import firebase from '../cloud/firebase.js';
import {database} from '../cloud/database';
import {storage} from '../cloud/storage';


function getProducts() {
    
    const keys = [];
    database.then( (d) => {
      //get list of uids for all users
      var uids = Object.keys(d.Users);
      var keys = [];
      //get all keys for each product iteratively across each user
      for(uid of uids) {
        Object.keys(d.Users[uid].products).forEach( (key) => keys.push(key));
      }
      var products = [];
      
      for(const uid of uids) {
        for(const key of keys) {

          if( Object.keys(d.Users[uid].products).includes(key)  ) {

            storage.child(`${uid}/${key}`).getDownloadURL()
            .then( (uri) => {
              products.push( {key: key, uid: uid, uri: uri, text: d.Users[uid].products[key] } )
            } )


          }

          
          
        }
      }

      
      // this.setState({ products })
      return products;
    })
    .catch( (err) => {console.log(err) })
    
}

const products = getProducts();

export default products;

