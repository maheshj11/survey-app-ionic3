import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ImagePicker } from '@ionic-native/image-picker';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { MediaCapture } from '@ionic-native/media-capture';
import { Deeplinks } from '@ionic-native/deeplinks';
import { GooglePlus } from '@ionic-native/google-plus';
import { Base64 } from '@ionic-native/base64';
import { AdMobFree } from '@ionic-native/admob-free';

import { MyApp } from './app.component';

import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CREDENTIALS } from './firebase.credentials';
import { AuthService } from '../providers/auth/auth.service';
import { DataService } from '../providers/data/data.service';

import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CREDENTIALS),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ChartsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    MediaCapture,
    ImagePicker,
    YoutubeVideoPlayer,
    DataService,
    SocialSharing,
    Deeplinks,
    Facebook,
    Base64,
    AdMobFree,
    GooglePlus
  ]
})
export class AppModule {}
