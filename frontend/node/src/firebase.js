import firebase from 'firebase/app';
import '@firebase/auth'
import '@firebase/firestore'
import "firebase/auth";
/*
export const firebaseConfig = {
    user Firebase api key 입력부분 
  };
*/
const app = firebase.initializeApp(firebaseConfig);

const Auth = app.auth();

export const signin = async ({email, password}) => {
    const { user } = await Auth.signInWithEmailAndPassword(email, password);
    return user;
};

const uploadImage = async uri => {
    if(uri.startsWith('https')){
        return uri;
    }
console.log(uri);
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () { resolve(xhr.response) }
        xhr.onerror = function () { reject(new TypeError('Network request failed')) }
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const user = Auth.currentUser;
    const ref = app.storage().ref(`/profile/${user.uid}/photo.png`);
    const snapshot = await ref.put(blob, {contentType: 'image/png'});
    blob.close();

    return await snapshot.ref.getDownloadURL();
};

export const signup = async ({name, email, password, photo}) => {
    const {user} = await Auth.createUserWithEmailAndPassword(email, password);
    const photoURL = await uploadImage(photo);
    await user.updateProfile({displayName: name, photoURL});
    return user;
};