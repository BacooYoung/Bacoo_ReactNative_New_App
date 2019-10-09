import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, TouchableHighlight,TextInput ,TouchableOpacity} from 'react-native'

import { Server_IP,ONLINEServer_IP } from '../common/serverIP';


export default class PasswordFind extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: '검색',
        }
    };


    state = {
        result : [],
        sendCode : false,
        TextCode : "",
        number : "",
        email : ""
    }

    checkCode () {
        const number = this.state.number;
        const TextCode = this.state.TextCode;

        if(Number(number) === Number(TextCode)) {
            this.props.navigation.navigate('PasswordFindDetail', {screenTitle : '비밀번호 변경', email : this.state.email})
        } else {
            alert("인증번호가 일치하지않습니다.")
        }
    }

    sendCode () {
        const email = this.state.email;

        if(email !== "") {
            fetch(
                `${Server_IP}/forgot` ,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                }),
            })
            .then(response => response.json())  
            .then(json => {
        
                if(json.status === 0) {
                    alert('해당 이메일로 인증번호가 전송되었습니다.');
                    this.setState({
                        number : json.result,
                        sendCode : true
                    })
                }
              
              
            }); 
        } else {
            alert("이메일을 입력해주세요.")
        }
    }
    

    render() {


        return(

            <View  style={styles.PasswordFind}>
                
                <View style={{width : '100%', marginTop : 70, flexDirection : 'row', paddingLeft : 10}}>
                    <View style={{width : '77%'}}>
                        <TextInput
                            placeholder="이메일을 입력해주세요."
                            style={{height: 45,width: '100%',borderRadius : 5,paddingLeft : 10,  borderColor: 'gray', borderWidth: 1}}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                    </View>

                    <View  style={{width : '23%', alignItems : 'center'}}>
                        <TouchableOpacity onPress={()=> {this.sendCode()}}
                             style={{width : '80%', height : 45, borderRadius : 5 ,borderColor : "#b2f", borderWidth : 1, justifyContent : 'center', alignItems : 'center'}}>
                            <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB',  color : '#b2f'}}>인증 받기</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {this.state.sendCode && (
                    <View style={{width : '100%', marginTop : 20, flexDirection : 'row', paddingLeft : 10}}>
                        <View style={{width : '77%'}}>
                            <TextInput
                                placeholder="인증번호를 입력해주세요."
                                style={{height: 45,width: '100%',borderRadius : 5,paddingLeft : 10, borderColor: 'gray', borderWidth: 1}}
                                onChangeText={(TextCode) => this.setState({TextCode})}
                                value={this.state.TextCode}
                            />
                        </View>

                        <View  style={{width : '23%', alignItems : 'center'}}>
                            <TouchableOpacity onPress={()=> {this.checkCode()}}
                                style={{width : '80%', height : 45, borderRadius : 5 ,borderColor : "#b2f", borderWidth : 1, justifyContent : 'center', alignItems : 'center'}}>
                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB',  color : '#b2f'}}>확인</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

                

            </View>

        );

    };
}



const styles = StyleSheet.create({
    PasswordFind: {
      flex: 1,
      backgroundColor: '#fff',
    },


});
  