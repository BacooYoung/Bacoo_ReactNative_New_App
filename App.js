
import React, {Component} from 'react';
import {Platform, StyleSheet, PermissionsAndroid, AsyncStorage} from 'react-native';
import AppNavigator from './router/AppNavigator';
import {createAppContainer, NavigationActions} from "react-navigation";
import firebases from 'react-native-firebase';

import {APPServer_IP} from "./common/serverIP"

import codePush from "react-native-code-push";

import SplashScreen from "./screen/SplashScreen"







type Props = {};
class App extends Component<Props> {
 
  state = {
    splash  : true,
    fcm : false,
    navigator : ""
  }

  


  
  

  codePushStatusDidChange(status) {
      switch(status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              (("Checking for updates.");
              break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              (("Downloading package.");
              break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
              (("Installing update.");
              break;
          case codePush.SyncStatus.UP_TO_DATE:
              (("Up-to-date.");
              break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
              (("Update installed.");
              break;
      }
  }

  

  codePushDownloadDidProgress(progress) {
      ((progress.receivedBytes + " of " + progress.totalBytes + " received.");
  }

  async _checkPermission(){
    const enabled = await firebases.messaging().hasPermission();
    if (enabled) {

        ((enabled);
        this._updateTokenToServer();

    } else {

        this._requestPermission();
    }
  }

  async _requestPermission(){
    try {

      await firebases.messaging().requestPermission();
      await this._updateTokenToServer();

    } catch (error) {

        alert("you can't handle push notification");
    }
  }

  async _updateTokenToServer(){
    // fcmToken - 기기 고유 토큰 = 이걸로 타겟 알람
    const fcmToken = await firebases.messaging().getToken();

    AsyncStorage.getItem('user_id')
      .then((user_id)=> {
          if(user_id) {

            
            fetch(
              `${APPServer_IP}/notif/token/` ,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user_id,
                    Token: fcmToken,
                }),
            })
            .then(response => response.json())  
            .then(json => {
              
            });
            
            
          } 
      });
   
  }

 

  async _listenForNotifications(){
    // onNotificationDisplayed - ios only

    this.notificationListener = firebases.notifications().onNotification((notification) => {
      (('onNotification', notification);
      
    });

    this.notificationOpenedListener = firebases.notifications().onNotificationOpened((notificationOpen) => {
        (('onNotificationOpened', notificationOpen);
    });

    const notificationOpen = await firebases.notifications().getInitialNotification();
    if (notificationOpen) {
        if(notificationOpen.notification._data.type.split('-')[0] === "rcm") {
          this.setState({
          fcm : true
        });
           
        this.navigator.dispatch(NavigationActions.navigate({ routeName: 'RcmScreen', params: {
          type  : notificationOpen.notification._data.type.split('-')[1]
        } }));
      }
            
    }
        
  }
  
  componentWillUnmount(){
    this.notificationListener();
    this.notificationOpenedListener();
  }
  

  componentDidMount() {

    
    this._checkPermission();
    this._listenForNotifications();

    const self = this;

    if(this.state.fcm) {
     this.navigator.dispatch(NavigationActions.navigate({ routeName: 'SplashScreen' }));

    setTimeout(function() {

       self.navigator.dispatch(NavigationActions.navigate({ routeName: 'Home' }));

      
      }, 1000);
    }


    this.setState({
      fcm : false
    })
    
      
  }
  
  render() {
    
      return (
          <AppNavigator 
            ref={nav => {
            this.navigator = nav;
          }}/>
      );

    
  }
}


export default codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_START, installMode: codePush.InstallMode.IMMEDIATE  })(App);
//export default App;sds
