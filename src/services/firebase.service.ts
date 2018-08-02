import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase/app";

@Injectable()
export class FirebaseService {
  constructor(public afAuth: AngularFireAuth) {}

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/users/${userId}`)
      .off();
    return this.afAuth.auth.signOut();
  }

  registerUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      newEmail,
      newPassword
    );
  }
}
