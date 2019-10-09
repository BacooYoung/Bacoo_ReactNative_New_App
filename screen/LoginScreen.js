
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Text,Keyboard, ScrollView, TouchableOpacity, Platform,PermissionsAndroid} from 'react-native';
import { Server_IP , SubServer_IP} from '../common/serverIP';
import {SetLogin} from '../common/login'

import firebase from 'react-native-firebase'



export default class LoginScreen extends Component {

    state = {
        email : '',
        password : '',
        keyboard : false
    }

    static navigationOptions = {    
        header: null,
    };

    constructor(props) {
        super(props);
        // call it again if items count changes
    }


    componentDidMount() {



      firebase.analytics().setCurrentScreen('로그인');


      fetch(
        `${SubServer_IP}/log/screen` ,
      {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId : 'guest',
            screen : '로그인 화면-'+Platform.OS,
            nextScreen : '',
            screenTime : '',
            time : new Date()
          }),
      })
      .then(response => response.json())  
      .then(json => {

      });
    }


    login() {
      fetch(
          `${Server_IP}/login` ,
      {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: this.state.email,
              password: this.state.password,
          }),
      })
      .then(response => response.json())  
      .then(json => {
  
          if(json.status === 1) {
            alert("아이디 또는 비밀번호가 틀렸습니다.");
          } else if(json.status === 2) {
  
            alert("아이디 또는 비밀번호가 틀렸습니다.");
          } else if(json.status === 0) {
              
              if(SetLogin(json.result.user_id, json.result.token, json.result.admin )) {

                fetch(
                  `${SubServer_IP}/log/action` ,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId : json.result.user_id,
                        action : '로그인',
                        platform : Platform.OS,
                        actionTime : new Date()
                    }),
                })
                .then(response => response.json())  
                .then(json => {
          
                });
                
                Keyboard.dismiss();
                
                this.props.navigation.navigate('Home', {screenTitle : '로그인'})

                /*
                fetch(
                  `${SubServer_IP}/log/action` ,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId : json.result.user_id,
                        action : '로그인',
                        platform : 'APP',
                        actionTime : new Date()
                    }),
                })
                .then(response => response.json())  
                .then(json => {
                    
                });*/
  
              }
          }
        
        
        
      }); 
    }





  render() {

    return (
      <View style={styles.container} >

        <ScrollView keyboardShouldPersistTaps='always'>
         
            <View style={{width : '100%', marginTop : 110, alignItems : 'center', justifyContent : 'center'}}>
                <Text style={{fontSize : 18, fontFamily: 'NanumSquareB', color : '#b2f'}}>나의 재능이 특별해지는 순간</Text>

                <Text style={{fontSize : 26, fontFamily: 'NanumSquareEB', marginTop : 15, color : '#b2f'}}>바꾸</Text>
            </View>

            <View style={{width : '100%', marginTop : 70, alignItems : 'center'}}>
                <View style={{width : '80%'}}>
                    <TextInput
                    onSubmitEditing={Keyboard.dismiss}
                        placeholder="이메일"
                        style={{height: 45,width: '100%',borderRadius : 5,paddingLeft : 10, paddingTop : 7, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                    />
                </View>

                <View style={{width : '80%', marginTop : 25}}>
                    <TextInput
                      onSubmitEditing={Keyboard.dismiss}
                      
                      textContentType = {"password"}
                      secureTextEntry   
                      underlineColorAndroid='transparent'
                        placeholder="비밀번호"
                        style={{height: 45,width: '100%',borderRadius : 5,paddingLeft : 10, paddingTop : 7, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />
                </View>

                <TouchableOpacity onPress={()=>{this.login()}}
                style={{width : '80%', marginTop : 25, height : 45, backgroundColor: "#b2f", alignItems : 'center', justifyContent : 'center'}}>
                   <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : '#fff'}}>로그인</Text>
                </TouchableOpacity>



                <TouchableOpacity onPress={() => this.props.navigation.navigate('PasswordFind', {screenTitle : '비밀번호 찾기'})}
                  style={{width : '80%', marginTop : 10, alignItems : 'flex-end', justifyContent : 'flex-end'}}>
                   <Text  style={{fontSize : 15, fontFamily: 'NanumSquareEB', color : '#8c8c8c'}}>비밀번호 찾기</Text>
                </TouchableOpacity>



                <View style={{width : '80%', marginTop : 90, alignItems : 'center', justifyContent : 'center', flexDirection : 'row'}}>
                   <Text  style={{fontSize : 15, fontFamily: 'NanumSquareB', color : '#000'}}>아직도 회원이 아니세요?</Text>
                   <TouchableOpacity onPress={() => this.props.navigation.navigate('SignupScreen', {screenTitle : '데힛'})}>
                    <Text  style={{fontSize : 15, fontFamily: 'NanumSquareEB', color : '#b2f', paddingLeft : 15}}>바꾸 회원가입</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </ScrollView>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }



});
