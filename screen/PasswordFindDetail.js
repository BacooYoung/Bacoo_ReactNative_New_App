import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, TouchableHighlight,TextInput ,TouchableOpacity} from 'react-native'

import { Server_IP,ONLINEServer_IP } from '../common/serverIP';

import firebase from 'react-native-firebase'

export default class PasswordFindDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: '검색',
        }
    };


    state = {
        email : "",
        password : "",
        passwordCheck : ""
    }


    changePassword() {
        const email = this.props.navigation.state.params.email;
        const password = this.state.password;
        const passwordCheck = this.state.passwordCheck;

        if(password === "") {
            alert("비밀번호를 입력해주세요.")
        } else if(passwordCheck === "") {
            alert("비밀번호를 다시 입력해주세요.")
        } else if(password !== passwordCheck) {
            alert("비밀번호를 서로 일치하지않습니다.")
        } else {


            fetch(
                `${Server_IP}/forgot/pw` ,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password : password
                }),
            })
            .then(response => response.json())  
            .then(json => {
        
                if(json.status === 0) {
                    alert('비밀번호 변경 완료');
                    
                    this.props.navigation.navigate('LoginScreen')
                }
              
              
            }); 

        }
    }

    componentDidMount(){
        
        firebase.analytics().setCurrentScreen('비밀번호 찾기');
    }
    

    render() {


        return(

            <View  style={styles.PasswordFindDetail}>
                
                <View style={{width : '100%', marginTop : 70,  paddingLeft : 20,paddingRight : 20}}>
                    <View style={{width : '100%'}}>
                        <TextInput
                        
                            textContentType = {"password"}
                            secureTextEntry   
                            underlineColorAndroid='transparent'
                            placeholder="비밀번호를 입력해주세요."
                            style={{height: 45,width: '100%',borderRadius : 5,paddingLeft : 10,  borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                        />
                    </View>


                    <View style={{width : '100%', marginTop : 20}}>
                        <TextInput
                        
                            textContentType = {"password"}
                            secureTextEntry   
                            underlineColorAndroid='transparent'
                            placeholder="비밀번호를 다시 입력해주세요."
                            style={{height: 45,width: '100%',borderRadius : 5,paddingLeft : 10,  borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(passwordCheck) => this.setState({passwordCheck})}
                            value={this.state.passwordCheck}
                        />
                    </View>

                    <TouchableOpacity onPress={()=>{this.changePassword()}}
                     style={{width : '100%', height : 45, marginTop : 20, justifyContent : 'center' , alignItems : 'center', backgroundColor : '#b2f', borderRadius : 5}}>
                        <Text style={{fontSize : 18, fontFamily: 'NanumSquareB',  color : '#fff'}}>변경하기</Text>
                    </TouchableOpacity>


                </View>

                

            </View>

        );

    };
}



const styles = StyleSheet.create({
    PasswordFindDetail: {
      flex: 1,
      backgroundColor: '#fff',
    },


});
  