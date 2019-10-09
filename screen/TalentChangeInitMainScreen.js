
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text,Image, TextInput, ScrollView, Keyboard, AsyncStorage} from 'react-native';
import { Server_IP,SubServer_IP } from '../common/serverIP';


import firebase from 'react-native-firebase'



export default class TalentChangeInitMainScreen extends Component {

    state = {
        requestText : '',
    }


    static navigationOptions = {    
        header: null,
    };

 
    componentDidMount() {
      this.didFocusListener = this.props.navigation.addListener(
        'didFocus',
        () => { 

          firebase.analytics().setCurrentScreen('재능등록 메인');


          AsyncStorage.getItem('user_id')
          .then((user_id)=> {
            
            fetch(
              `${SubServer_IP}/log/screen` ,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId : user_id,
                  screen : '재능등록 메인 화면',
                  nextScreen : '',
                  screenTime : '',
                  time : new Date()
                }),
            })
            .then(response => response.json())  
            .then(json => {
      
            });

            AsyncStorage.getItem('token').then((token)=>{
                fetch( 
                  `${Server_IP}/userinfo/${user_id}`,
                  {
                    method: 'GET',
                    headers: {
                      'Authorization': token.replace(/"/g,'')
                    }
                  }
                )
                .then(response => response.json())  
                .then(json => {
            
                  if(json.status == 0) {

                    if(Number(json.result[0].talentCount) === 0) {
                        this.props.navigation.navigate('TalentChangeInitScreen', {screenTitle : '재능 등록'})
                    }
                    
                  } 
            
                });

            });
          })

      })
    }


  render() {

    return (
      <View style={{width : '100%', height : '100%', justifyContent : 'center', alignItems : 'center'}}>
       
       <View  style={styles.container}>
            <View style={{width : '100%', height : '80%' , justifyContent : 'center', alignItems : 'center'}}>
                <Text style={{fontSize : 24, fontFamily: 'NanumSquareB', color : "#fff"}}>재능등록을 하시면, </Text>
                <Text style={{fontSize : 24, fontFamily: 'NanumSquareB', color : "#fff", marginTop : 15}}>원하는 재능을 배울 수 있습니다. </Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('TalentChangeInitScreen', {screenTitle : '재능 등록', type : 1})}  
                style={{width : 140, height : 50, marginTop : 30, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center', borderRadius : 100}}>
                    <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#b2f"}}>재능 등록</Text>
                </TouchableOpacity>
            </View>

       </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width : '100%',
    height : '100%',
    
    backgroundColor: '#b2f',
    position : 'relative'
  },

 


});
