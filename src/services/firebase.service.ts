import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase/app";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class FirebaseService {
  hasSession$ = new BehaviorSubject<boolean>(false);

  constructor(public afAuth: AngularFireAuth) {
    firebase.auth().onAuthStateChanged(user => {
      if (user.uid) {
        this.hasSession$.next(true);
      } else {
        this.hasSession$.next(false);
      }
    });
  }

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
