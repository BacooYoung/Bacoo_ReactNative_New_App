import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, AsyncStorage, Keyboard,TextInput,ScrollView ,TouchableOpacity} from 'react-native'

import { Server_IP,SubServer_IP } from '../common/serverIP';


export default class RequestEventScreen extends Component {
     static navigationOptions = {    
    header: null,
  };


    state = {
        result : [],
        phoneState : false,
        phoneDone : false,
        phone : '',
        authNumber : "",
        status : false,
    }


    EventClose() {
        this.props.navigation.navigate('Home', {type : '1'} );

        AsyncStorage.setItem('requestEvent', '1');
    }


    render() {


        return(

            <View  style={styles.RequestEventScreen}>
                <ScrollView  style={{
                    flex: 1,
                    paddingTop : 50,
                    paddingBottom: 50
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize : 32, fontFamily: 'NanumSquareEB', color : '#b2f'}}>'재능교환 요청' </Text>
                        <Text style={{fontSize : 32, fontFamily: 'NanumSquareEB', color : '#b2f', marginTop : 10}}>하면 이용권이 </Text>
                        <Text style={{fontSize : 32, fontFamily: 'NanumSquareEB', color : '#8c8c8c', marginTop : 10}}>팡팡팡!</Text>

                        <Image
                            resizeMode='cover'
                            style={{width : 175, height : 175, marginTop : 40}}
                            source={{uri: 'https://i.imgur.com/PlAy6FQ.png' }} 
                        /> 

                        <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : '#333', marginTop :40}}>방법 : 마음에 드는 재능인에게 재능교환 요청을 보내보세요.</Text>
                        <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : '#333', marginTop :10}}>(5명에게 보내면 매칭이용권 1개를 드립니다.)</Text>


                    </View>

                    
                    <View style={{width : '100%', height : 56,   marginTop : 30}}>
                        <TouchableOpacity  onPress={() => this.EventClose()}   
                        
                         style={{width : '100%', height  :56, backgroundColor : '#b2f', justifyContent : 'center', alignItems : 'center'}}>
                            <Text style={{fontSize : 22, fontFamily: 'NanumSquareB', color : '#fff'}}>
                                재능요청 하러가기
                            </Text>
                        </TouchableOpacity>

                        
                    </View>

                    <Text style={{fontSize : 13, fontFamily: 'NanumSquareB', color : '#8c8c8c', marginTop :10}}>이벤트 기간은 7/23 - 9/30까지입니다. </Text>
                    <Text style={{fontSize : 13, fontFamily: 'NanumSquareB', color : '#8c8c8c', marginTop :5}}>이벤트 기간안에 보내진 재능요청만 해당됩니다.</Text>
                    
                    <View style={{marginBottom : 100}}>
                    </View>
                </ScrollView>

            
            </View>

        );

    };
}



const styles = StyleSheet.create({
    RequestEventScreen: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent : 'center',
      alignItems : 'center'
    },


});
  