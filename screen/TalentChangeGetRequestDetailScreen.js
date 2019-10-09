import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, TouchableHighlight,AsyncStorage ,TouchableOpacity} from 'react-native'

import { Server_IP,ONLINESubServer_IP,SubServer_IP } from '../common/serverIP';

import firebase from 'react-native-firebase'

export default class TalentChangeGetRequestDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: '받은요청 상세페이지',
        }
    };


    state = {
        result : [],
        isLoaded : true,
        imgLoading : false,
        requestPopup : false,
        ticketBuy : false,
        userId : 0,
        token : "",
        userTicket : ""
    }

    componentDidMount() {

        firebase.analytics().setCurrentScreen('재능교환 요청');


        let datas = this.props.navigation.state.params.datas;


        AsyncStorage.getItem('user_id').then((userId)=> {

            fetch(
                `${SubServer_IP}/log/screen` ,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId : userId,
                    screen : '받은요청 상세 화면',
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
                    `${Server_IP}/userinfo/${userId}`,
                    {
                      method: 'GET',
                      headers: {
                        'Authorization': token.replace(/"/g,'')
                      }
                  } 
                )
                .then(response => response.json())  
                .then(json => { 
                    this.setState({  
                        userTicket : json.result[0].userTicket,
                        userId,
                        token
                    });
                
                });


                fetch( 
                    `${ONLINESubServer_IP}/see/rq/${datas.requesttalentId}`,
                    {
                      method: 'GET',
                      headers: {
                        'Authorization': token.replace(/"/g,'')
                      }
                  } 
                )
                .then(response => response.json())  
                .then(json => { 
                   
                
                });
            });
            
        });

        this.setState({
            result : datas,
            isLoaded : true
        })
    }

    requestOk() {


        AsyncStorage.getItem('user_id').then((userId)=> {
            AsyncStorage.getItem('token').then((token)=>{

                fetch( 
                    `${Server_IP}/userinfo/${userId}`,
                    {
                      method: 'GET',
                      headers: {
                        'Authorization': token.replace(/"/g,'')
                      }
                  } 
                )
                .then(response => response.json())  
                .then(json => { 
                    
                    if(json.result[0].userTicket > 0) {
                       fetch( 
            `${Server_IP}/request/talent/status`,
            {
              method: 'POST',
              
              headers: {
                'Authorization': this.state.token.replace(/"/g,'')
              },
              body: JSON.stringify({
                "requesttalentId" : this.state.result.requesttalentId,
                "myId" : Number(this.state.userId),
                "youId" : this.state.result.requestuserId,
                "type" : "ok"
            }),
          }
          )
          .then(response => response.json())  
          .then(json => {
            if(json.status === 0) {
                alert("재능교환중 메뉴에서 연락처를 확인할 수 있습니다.")
                this.props.navigation.goBack(null);
            } else {
              
              alert("승인 실패 - 관리자에게 문의해주세요.");
            }
            
          });
                    } else {
                        alert("이용권 구매후 이용가능합니다.")
                    }
                
                });
            });
            
        });

           

        
    }


    ticketBuy() {
        this.props.navigation.navigate('BuyTicketScreen', {screenTitle : '이용권 구매'});
    }


    RequestPupop(){
        let ticket = this.state.userTicket;

        if(ticket === "" || Number(ticket) <= 0) {
            this.setState({ticketBuy : true})
        } else {
            this.setState({requestPopup : true})
        }
    }

   

    

    render() {

        if(!this.state.isLoaded) {
            return null;
        }


        return(
            <View  style={styles.TalentChangeGetRequestDetailScreen}>
                <ScrollView >
            
                    <View style={{width : '100%', alignItems : 'center', justifyContent : 'center', marginTop : 20, marginBottom : 20}}>
                        <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>{this.state.result.name}님에게 재능교환 요청이 도착했습니다. ♥</Text>
                    </View>

                
                    <View style={{width : '100%', height : 330, alignItems : 'center', position : 'relative'}}>
                        <View style={{width : "90%", height : 200}}>
                            <Image
                                resizeMode='stretch'
                                style={{width : "100%", height : 200, borderRadius : 5}}
                                source={{uri: "https://firebasestorage.googleapis.com/v0/b/fromeapp.appspot.com/o/common%2Fimage4.jpg?alt=media&token=503f2138-cdef-4ef5-8ae9-8225e1c18043"}}
                                onLoadEnd={() => {
                                    this.setState({imgLoading: true})
                                }}  
                            />
                        </View>
                        <View style ={{width : '100%', position : 'absolute', left : 0 ,top : 135, justifyContent : 'center',  alignItems: 'center'}}>
                            <Image
                                resizeMode='cover'
                                style={{width : 120, height : 120 , borderRadius : 120/2, borderWidth : 0.1, borderColor : '#000' }}
                                source={{uri: this.state.result.image}}
                                
                            />
                            <Text style={{color : '#333', fontFamily: 'NanumSquareB', paddingTop : 15, fontSize : 18 }}>{this.state.result.name}</Text>
                            <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginTop : 10}}>
                                <Image
                                    resizeMode='cover'
                                    style={{width : 20, height : 20 }}
                                    source={{uri: 'https://image.flaticon.com/icons/png/128/148/148836.png'}}
                                    
                                />
                                <Text  style={{color : '#333', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 14 }}>0명이 좋아합니다.</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{width : '100%',  margin : 30}}>

                        <View style={{width : '100%', flexDirection : 'row', alignItems : 'center'}}>
                            <Image
                                resizeMode='contain'
                                style={{width : 22, height : 22 }}
                                source={{uri: 'https://i.imgur.com/UFrCH4d.png'}}
                                
                            />
                            <View style={{paddingLeft : 5, width : 100}}>
                                <Text  style={{color : '#333', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 16 }}>가진 재능</Text>
                            </View>
                            <View style={{paddingLeft : 15, width : 220}}>
                                <Text style={{color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 16 }}>{this.state.result.hadTalent}</Text>
                            </View>

                        </View>

                        <View style={{width : '100%', flexDirection : 'row', alignItems : 'center', marginTop : 20}}>
                            <Image
                                resizeMode='contain'
                                style={{width : 22, height : 22 }}
                                source={{uri: 'https://i.imgur.com/hvmlRYQ.png'}}
                                
                            />
                            <View style={{paddingLeft : 5, width : 100}}>
                                <Text  style={{color : '#333', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 16 }}>원하는 재능</Text>
                            </View>
                            <View style={{paddingLeft : 15, width : 220}}>
                                <Text style={{color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 16 }}>{this.state.result.wantTalent}</Text>
                            </View>

                        </View>


                    </View>

                    <View style={{width : '100%', height : 400, margin : 30}}>
                        <Text style={{color : '#000', fontFamily: 'NanumSquareEB', fontSize : 18}}>같이 재능교환 하고 싶은 이유</Text>
                        <View style={{ marginTop :10}}>
                            <Text style={{color : '#333', fontFamily: 'NanumSquareB', fontSize : 14,lineHeight : 30, paddingRight : 50 }}>{this.state.result.requestText}</Text>
                        </View>
                    </View>


                </ScrollView>

                <TouchableHighlight onPress={()=> {this.RequestPupop()}}
                style={styles.TalentChangeGetRequestDetailScreenBottomButton}   >

                    <View style={{width : '100%', height : 70, justifyContent :"center", alignItems : "center"}}>
                        <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>재능교환 수락하기</Text>
                        <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff", marginTop : 10}}>(이용권 {this.state.userTicket}개 보유중)</Text>

                    </View>
                </TouchableHighlight>



                {this.state.requestPopup && (
                    <View style={{width : '100%', height : '100%', position:'absolute', alignItems : 'center', justifyContent :'center'}}>
                        <View style={{backgroundColor : '#333',opacity: 0.8,width : '100%', height : '100%', position : 'absolute', top: 0, left : 0}}>
                            
                        </View>
                        
                        <View style={{ width : '70%', height : 150, borderWidth : 1, borderColor : '#ededed', backgroundColor : '#fff'}}>
                            <View style={{padding : 15, height : '70%', justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>소유중인 이용권 : {this.state.userTicket}개</Text>
                                <Text style={{fontSize : 12, fontFamily: 'NanumSquareB', color : "#8c8c8c", marginTop : 10, lineHeight : 20}}>( 이용권을 사용하여 수락하면 상대방의 연락처를 볼 수 있습니다. )</Text>

                            </View>
                            
                            <View style={{width : '100%',  height : '30%', flexDirection : 'row'}}>
                                <TouchableOpacity onPress={()=> {this.setState({requestPopup : false})}}
                                style={{backgroundColor : '#bfbfbf', width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#333"}}>취소</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>{this.requestOk()}}
                                style={{backgroundColor : '#b2f', width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>사용하기</Text>
                                </TouchableOpacity>
                            </View>
                        </View> 
                    </View>
                )}


                {this.state.ticketBuy && (
                    <View style={{width : '100%', height : '100%', position:'absolute', alignItems : 'center', justifyContent :'center'}}>
                        <View style={{backgroundColor : '#333',opacity: 0.8,width : '100%', height : '100%', position : 'absolute', top: 0, left : 0}}>
                            
                        </View>
                        
                        <View style={{ width : '70%', height : 150, borderWidth : 1, borderColor : '#ededed', backgroundColor : '#fff'}}>
                            <View style={{padding : 15, height : '70%', justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>이용권을 구매하러 가시겠습니까?</Text>
                                <Text style={{fontSize : 12, fontFamily: 'NanumSquareB', color : "#8c8c8c", marginTop : 10, lineHeight : 20}}>( 이용권을 사용하여 수락하면 상대방의 연락처를 볼 수 있습니다. )</Text>
                            </View>
                            
                            <View style={{width : '100%',  height : '30%', flexDirection : 'row'}}>
                                <TouchableOpacity onPress={()=> {this.setState({ticketBuy : false})}}
                                style={{backgroundColor : '#bfbfbf', width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#333"}}>취소</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>{this.ticketBuy()}}
                                style={{backgroundColor : '#b2f', width : '50%', justifyContent : 'center', alignItems : 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>구매하기</Text>
                                </TouchableOpacity>
                            </View>
                        </View> 
                    </View>
                )}
            </View>
        );
    };
}



const styles = StyleSheet.create({
    TalentChangeGetRequestDetailScreen: {
      flex: 1,
      backgroundColor: '#fff',
      position : 'relative'
    },



    TalentChangeGetRequestDetailScreenBottomButton : {
        width : "100%",
        height : 70,
        alignItems: 'center',
        justifyContent: 'center',
        position : "absolute",
        left : 0,
        bottom : 0,
        borderTopWidth : 1,
        borderTopColor : "#bfbfbf",
        backgroundColor: '#b2f',
      },
  
});
  