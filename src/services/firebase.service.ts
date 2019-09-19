import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from "firebase/app";
import { BehaviorSubject } from "rxjs";
import { User } from "../interfaces/user";

@Injectable()
export class FirebaseService {
  private dbPath = "users";
  hasSession$ = new BehaviorSubject<boolean>(false);
  profilesRef: AngularFireList<User> = null;

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.uid) {
        this.hasSession$.next(true);
      } else {
        this.hasSession$.next(false);
      }
    });
    this.profilesRef = this.db.list(this.dbPath);
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

  getUserProfiles(): AngularFireList<User> {
    return this.profilesRef;
  }
}
