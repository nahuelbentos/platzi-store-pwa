import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

interface Token {
  token: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private tokensCollections: AngularFirestoreCollection<Token>;
  constructor(
    private swUpdate: SwUpdate,
    private messaging: AngularFireMessaging,
    private database: AngularFirestore
  ) {
    this.tokensCollections = this.database.collection<Token>('tokens');
  }

  ngOnInit() {
    this.updatePWA();
    this.requestPermission();
    this.listenNotifications();
  }

  updatePWA() {
    this.swUpdate.available.subscribe(value => {
      console.log(' update:', value);
      window.location.reload();
    });
  }

  requestPermission() {
    this.messaging.requestToken
      .subscribe(token => {
        console.log('token: ', token);
        this.tokensCollections.add({ token });
      });
  }

  listenNotifications() {
    this.messaging.messages
      .subscribe(message => {
        console.log('message: ', message);
      });
  }
  allowNotifications() {

  }

}

