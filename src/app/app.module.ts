import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../core/auth.guard';
import { IonicRatingModule } from 'ionic4-rating';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { RelativeTimePipeModule } from '../pipe/relative-time.pipe.module';
import { CalificationPageModule } from './calification/calification.module';
import { CancelOrderPageModule } from './cancel-order/cancel-order.module';
import { TutorialPageModule } from './tutorial/tutorial.module';
import { SignaturePageModule } from './signature/signature.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ZonesRegisterPageModule } from './zones-register/zones-register.module';
import { ZonesServicePageModule } from './zones-service/zones-service.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { CameraPreviewPageModule } from './camera-preview/camera-preview.module';
import { VerifyNumberPageModule } from './verify-number/verify-number.module';
import { Crop } from '@ionic-native/crop/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  entryComponents: [NotificationsComponent],
  imports: [
  BrowserModule, 
  IonicModule.forRoot(),
  IonicStorageModule.forRoot(),
  IonicRatingModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule, 
  AppRoutingModule,
  RelativeTimePipeModule,
  CalificationPageModule,
  CancelOrderPageModule,
  SignaturePageModule,
  TutorialPageModule,
  SignaturePadModule,
  ZonesRegisterPageModule,
  ZonesServicePageModule,
  VerifyNumberPageModule],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    OneSignal,
    AuthGuardService,
    Facebook,
    Camera,
    FilePath,
    File,
    FileTransfer,
    LaunchNavigator,
    Geolocation,
    Diagnostic,
    LocationAccuracy,
    FileOpener,
    Vibration,
    CallNumber,
    BackgroundGeolocation,
    InAppBrowser,
    BackgroundMode,
    CameraPreview,
    Crop,
    SignInWithApple,
    GoogleAnalytics,
    ImagePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
