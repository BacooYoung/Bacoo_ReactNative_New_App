import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, TouchableOpacity,TouchableHighlight,ActivityIndicator ,AsyncStorage} from 'react-native'

import TalentChangeType from "../components/TalentChangeType"
import { Server_IP,SubServer_IP,ONLINESubServer_IP } from '../common/serverIP';


import firebase from 'react-native-firebase'


export default class TalentChangeDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: 'Default Screen Title',
        }
    };


    state = {
        result : [],
        isLoaded : false,
        imgLoading : false,
        result_review : [],
        requestPopup : false,
        ticketBuy : false,
        resultPoint : 0,
        userTicket : "",
        userId : undefined
    }

    checkPoint() {
        if(this.state.result_review.length > 0) {
            let point = 0;
            this.state.result_review.map((content,i) => {
                point += Number(content.reviewPoint)
            });

            return point / this.state.result_review.length;

        } else {
            return 0;
        }
    }

    checkAge(num) {
        if(Number(num) === 1) {
            return '18~24살'
        } else if(Number(num) === 2) {
            return '25~34살'
        } else if(Number(num) === 3) {
            return '35~44살'
        }else if(Number(num) === 4) {
            return '45~54살'
        }else if(Number(num) === 5) {
            return '그 이상'
        }
    }

    ticketBuy() {
        this.props.navigation.navigate('BuyTicketScreen', {screenTitle : '이용권 구매'});
    }

    timeFomat(timestamp){



        var date = new Date(timestamp);

        var yyyy = date.getFullYear();
        var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
        var dd  = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  
        return yyyy+ "-" + mm + "-" + dd


    }

    RequestPupop(){
        let ticket = this.state.userTicket;

        if(ticket === "" || Number(ticket) <= 0) {
            this.setState({ticketBuy : true})
        } else {
            this.setState({requestPopup : true})
        }

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
                    screen : '연락처 미리 보기 누름',
                    nextScreen : '',
                    screenTime : '',
                    time : new Date()
                  }),
              })
              .then(response => response.json())  
              .then(json => {
        
              });
        })
        
    }

    requestOk() {


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
                    screen : '연락처 미리 보기 이용권 사용',
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
                    
                    if(json.result[0].userTicket > 0) {

                        
                       fetch( 
                            `${ONLINESubServer_IP}/add/request/phone`,
                            {
                            method: 'POST',
                            
                            headers: {
                                'Authorization': token.replace(/"/g,'')
                            },
                            body: JSON.stringify({
                                "myId" : Number(userId),
                                "youId" : this.state.result[0].userId
                            }),
                        }
                        )
                        .then(response => response.json())  
                        .then(json => {
                            if(json.status === 0) {
                                alert("마이페이지 -> 재능교환중 메뉴에서 연락처를 확인할 수 있습니다.")

                                this.setState({
                                    ticketBuy : false,
                                    requestPopup : false,
                                    userTicket : Number(this.state.userTicket) - 1
                                })

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
    

    
    componentWillMount() {

        
        firebase.analytics().setCurrentScreen('상세 페이지 - ' + this.props.navigation.state.params.classId);

        AsyncStorage.getItem('user_id')
        .then((userId)=> {

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
                        userTicket : json.result[0].userTicket
                    });
                
                });


            });

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
                    screen : '상세페이지 화면-'+this.props.navigation.state.params.classId,
                    nextScreen : '',
                    screenTime : '',
                    time : new Date()
                  }),
              })
              .then(response => response.json())  
              .then(json => {
        
              });


            this.setState({userId})
        });
        
        fetch( 
            `${Server_IP}/search/ids/${this.props.navigation.state.params.classId}` 
          )
          .then(response => response.json())  
          .then(json => {

            
          


            this.setState({
              result : json.result, 
              isLoaded : true
            });

          });
    }
    

    render() {

        if(!this.state.isLoaded) {
            return null;
        }


        return(
            <View  style={styles.TalentChangeDetailScreen}>
                <ScrollView>

                    <View style={{ alignItems : "center", justifyContent :'center' ,height : 260, width : '100%' , position : 'relative'}}>
                        
                        <Image
                            resizeMode='stretch'
                            style={{width : "100%", height : 260}}
                            source={{uri: this.state.result[0].infoImage === null 
                                ? this.state.result[0].image
                                : this.state.result[0].infoImage.split(',')[0]}}
                            onLoadEnd={() => {
                                this.setState({imgLoading: true})
                            }}  
                        />
                       {!this.state.imgLoading && (
                            <ActivityIndicator size="large" color="#b2f" />
                       )}

                        <View style ={{width : '100%', height : 100, position : 'absolute', left : 0 ,top : 240, justifyContent : 'center',  alignItems: 'center'}}>
                            <Image
                                resizeMode='cover'
                                style={{width : 100, height : 100 , borderRadius : 100/2, borderWidth : 0.1, borderColor : '#ededed' }}
                                source={{uri: this.state.result[0].image}}
                                
                            />
                            <Text style={{color : '#333', fontFamily: 'NanumSquareB', paddingTop : 15, fontSize : 18 }}>{this.state.result[0].name}</Text>
                            
                            {Number(this.state.result[0].phoneState) === 1 && (
                                <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', marginTop : 10}}>
                                    <Image
                                        resizeMode='cover'
                                        style={{width : 20, height : 20 }}
                                        source={{uri: 'https://i.imgur.com/0rPNYec.png'}}
                                        
                                    />
                                    <Text  style={{color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 14 }}>연락처가 인증된 회원입니다.</Text>
                                </View>
                            )}

                            
                            <View style={{marginTop : 20,marginBottom : 20, alignItems : 'center'}}>
                                <Text  style={{color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 13, lineHeight : 25 }}>재능인님의 연락을 기다리고있습니다. ♥</Text>
                                <Text  style={{color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 13 }}>아래의 '연락처 바로 보기'로 재능교환 해보세요!</Text>
                            </View>
                            
                            
                            
                        </View>
                    </View>

                    <View style={{width : '100%', marginLeft : 15, marginTop : 140}}>
                        
                    </View>

                    <TalentChangeType 
                        wantLocation = {Number(this.state.result[0].wantType) === 1 ? '온라인' :  this.state.result[0].wantLocation}    
                        hadTalent = {this.state.result[0].hadTalent}    
                        wantTalent = {this.state.result[0].wantTalent}    
                    />

                    <View style={{  paddingTop : 50}}>
                        <Text style={{fontFamily: 'NanumSquareEB',margin : 15, fontSize : 22 , color : "#000"}}>자기소개 및 하고싶은 말</Text>
                        <Text style={{fontFamily: 'NanumSquareB', margin : 15,color : "#333", lineHeight : 25, marginTop : 15}}>
                            {this.state.result[0].say}
                        </Text>

                        {this.state.result[0].infoImage !== null && (
                            <View style={{marginLeft : 15, marginRight : 15}}>
                                <Image
                                        resizeMode='cover'
                                        style={{width : '100%', height : 250 , marginTop : 40}}
                                        source={{uri: this.state.result[0].infoImage.split(',')[0]}}
                                        
                                    />
                                
                                {this.state.result[0].infoImage.split(',').length > 1 && (
                                    <Image
                                        resizeMode='cover'
                                        style={{width : '100%', height : 250 , marginTop : 40 }}
                                        source={{uri: this.state.result[0].infoImage.split(',')[1]}}
                                        
                                    />
                                )}

                                {this.state.result[0].infoImage.split(',').length > 2 && (
                                    <Image
                                        resizeMode='cover'
                                        style={{width : '100%', height : 250 , marginTop : 40 }}
                                        source={{uri: this.state.result[0].infoImage.split(',')[2]}}
                                        
                                    />
                                )}
                            </View>
                        )}
                    </View>

                    
                    {this.state.result[0].whyWantTalent !== null && (
                        <View style={{ margin : 15, paddingTop : 35}}>
                            <Text style={{fontFamily: 'NanumSquareEB', fontSize : 22 , color : "#000"}}>배우고 싶은 이유</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : "#333", lineHeight : 25, marginTop : 15}}>
                                {this.state.result[0].whyWantTalent}
                            </Text>

                        </View>
                    )}
                    
                    {this.state.result[0].wantPerson !== null && (
                         <View style={{ margin : 15, paddingTop : 35}}>
                            <Text style={{fontFamily: 'NanumSquareEB', fontSize : 22 , color : "#000"}}>어떤 사람을 원하시나요?</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : "#333", lineHeight : 25, marginTop : 15}}>
                                {this.state.result[0].wantPerson}
                            </Text>
    
                        </View>
                    )}


                    {this.state.result[0].TalentExperienceText !== null && (
                        <View style={{ margin : 15, paddingTop : 35}}>
                            <Text style={{fontFamily: 'NanumSquareEB', fontSize : 22 , color : "#000"}}>경험 및 자격사항</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : "#333", lineHeight : 25, marginTop : 15}}>
                                {this.state.result[0].TalentExperienceText}
                            </Text>


                            {this.state.result[0].TalentExperienceImage !== null && this.state.result[0].TalentExperienceImage !== "null" && (
                            <View>
                                <Image
                                        resizeMode='cover'
                                        style={{width : '100%', height : 250 , marginTop : 40}}
                                        source={{uri: this.state.result[0].TalentExperienceImage.split(',')[0]}}
                                        
                                    />
                                
                                {this.state.result[0].TalentExperienceImage.split(',').length > 1 && (
                                    <Image
                                        resizeMode='cover'
                                        style={{width : '100%', height : 250 , marginTop : 40 }}
                                        source={{uri: this.state.result[0].TalentExperienceImage.split(',')[1]}}
                                        
                                    />
                                )}

                                {this.state.result[0].TalentExperienceImage.split(',').length > 2 && (
                                    <Image
                                        resizeMode='cover'
                                        style={{width : '100%', height : 250 , marginTop : 40 }}
                                        source={{uri: this.state.result[0].TalentExperienceImage.split(',')[2]}}
                                        
                                    />
                                )}
                            </View>
                        )}
    
                        </View>
                    )}

                  




                    
                   

                    

                    {this.state.result[0].age !== null && (
                        <View style={{ margin : 15, paddingTop : 35}}>
                            <Text style={{fontFamily: 'NanumSquareEB', fontSize : 22 , color : "#000"}}>재능인 정보</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : "#333",  marginTop : 15}}>
                                성별 : {Number(this.state.result[0].gender) === 1 ? '남자' : '여자'}
                            </Text>

                            <Text style={{fontFamily: 'NanumSquareB', color : "#333", marginTop : 15}}>
                                나이 : {this.checkAge(this.state.result[0].age)}
                            </Text>

                        </View>
                    )}  
                    

                    <View style={{marginTop : 30,marginBottom : 50, borderWidth : 10 , borderColor : "#ededed"}}>

                    </View>

                    {/*
                    <View style={{ margin : 15, paddingTop : 35, marginBottom : 100}}>
                        <Text style={{fontFamily: 'NanumSquareEB', fontSize : 22 , color : "#000"}}>이런 재능 교환은 어떠세요?</Text>
                        
                        <View style={{width : '100%', height : 400, flexDirection : 'row', paddingTop : 10}}>

                            <View style={{width : 280, height : 400}}>
                                <View style={{width : 280, height : 200, position : 'relative'}}>

                                    <Image
                                        resizeMode='stretch'
                                        style={{width : "100%", height : 200}}
                                        source={{uri: this.state.result[0].talentImage !== 'none' 
                                            ? this.state.result[0].talentImage 
                                            : 'https://firebasestorage.googleapis.com/v0/b/fromeapp.appspot.com/o/common%2Fimage4.jpg?alt=media&token=503f2138-cdef-4ef5-8ae9-8225e1c18043'}}
                                         
                                    />
                                    <View style ={{width : '100%', height : 100, position : 'absolute', right : 20 ,top : 150, justifyContent : 'center',  alignItems: 'flex-end'}}>
                                        <Image
                                            resizeMode='cover'
                                            style={{width : 85, height : 85 , borderRadius : 85/2, borderWidth : 0.1, borderColor : '#ededed' }}
                                            source={{uri: this.state.result[0].image}}
                                            
                                        />
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 10}}>
                                        <Image
                                            resizeMode='cover'
                                            style={{width : 20, height : 20 }}
                                            source={{uri: 'https://image.flaticon.com/icons/png/128/148/148836.png'}}
                                            
                                        />
                                        <Text  style={{color : '#8c8c8c', fontFamily: 'NanumSquareEB', paddingLeft : 5, fontSize : 14 }}>0명이 좋아합니다.</Text>
                                    </View>

                                    <View style={{ marginTop : 10}}>
                                       <Text  style={{color : '#333', fontFamily: 'NanumSquareEB', fontSize : 14 }}>[영어,중국어] 가르쳐 드리고</Text>
                                    </View>

                                    <View style={{ marginTop : 10}}>
                                       <Text  style={{color : '#333', fontFamily: 'NanumSquareEB', fontSize : 14 }}>[영어,중국어] 배우고 싶어요</Text>
                                    </View>


                                </View>
                            </View>

                            

                        </View>

                    </View>
                    */}

                    {/*
                    <View style={{margin : 15, paddingBottom : 20}}>

                        <View style={{flexDirection : 'row'}}>
                            <Text style={{color : '#000', fontFamily: 'NanumSquareEB', fontSize : 16}}>
                                리뷰 ({this.state.result_review.length})
                            </Text>
                        </View>

                        
                        {this.state.result_review.length === 0 && (
                            <View style={{width : '100%', height : 150, marginTop : 10, borderWidth : 1, borderColor : '#ededed', alignItems : 'center', justifyContent :'center' }}>
                                <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c'}}>등록된 리뷰가 없습니다.</Text>
                            </View>
                        )}
                        
                        {this.state.result_review.length !== 0 && (
                            <View style={{width : '100%'}}>

                                {this.state.result_review.map((content,i) => {
                                    return (
                                        <View key={i} style={{flexDirection : 'row' , marginBottom : 15, marginLeft : 10, marginTop : 20}}>
                                            <View>
                                                <Image
                                                    style={{ width: 40, height: 40, resizeMode : "cover", borderRadius : 1000}}
                                                    source={{uri: content.image}}
                                                />
                                                <Text style={{fontFamily: 'NanumSquareB', color : '#000', marginTop : 7}}>
                                                {content.name}
                                                </Text>
                                            </View>
                                            <View style={{marginLeft : 15, marginRight : 50}}>
                                                <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 12}}>
                                                    {this.timeFomat(content.reviewTime)}
                                                </Text>

                                                <Text style={{fontFamily: 'NanumSquareB', color : '#333', fontSize : 14, marginTop : 5}}>
                                                    {content.reviewText}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })}

                            </View>
                        )}
                        

                    </View>
                   


                    <View style={{marginBottom : 15, borderWidth : 1 , borderColor : "#ededed"}}>

                    </View>


                    <View style={{ margin : 15, paddingBottom : 100}}>
                        <Text style={{fontFamily: 'NanumSquareEB',fontSize : 16, color : '#000'}}>온라인으로 재능교환 하는법</Text> 
                        <View style={{width : '100%', height : 250, marginTop : 10, borderWidth : 1, borderColor : '#ededed'}}>
                            <WebView 
                                    style={{width : Math.round(Dimensions.get('window').width), height : 250}}
                                    source={{ uri: 'https://www.youtube.com/embed/D8bzWSWCwOE'}}
                                    javaScriptEnabled={true}
                                    
                                />
                        </View>
                    </View> */}


                    </ScrollView>

                    <View style={{flexDirection : 'row'}}>
                        <TouchableOpacity 
                            style={{ width : Number(this.state.result[0].phoneState) === 1 ? "65%" : "100%",
                            height : 55,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopWidth : 1,
                            borderTopColor : "#bfbfbf",
                            backgroundColor: '#b2f'}}  

                        onPress={() => {
                            if(Number(this.state.result[0].userId) !== Number(this.state.userId)) {
                                this.props.navigation.navigate('TalentChangeRequestScreenMain', 
                                    {
                                        screenTitle : this.state.result[0].name+'님에게 재능교환 요청',
                                        name : this.state.result[0].name,
                                        image : this.state.result[0].image,
                                        result : this.state.result[0]
                                        
                                    }
                            
                                )
                            } else {
                                alert('본인에게는 재능요청을 할수없습니다.')
                            }
                            

                        }}   >

                            <View style={{width : '100%', height : 55, justifyContent :"center", alignItems : "center"}}>
                                <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>재능교환 요청하기</Text>

                            </View>
                        </TouchableOpacity>

                        {Number(this.state.result[0].phoneState) === 1 && (
                            <TouchableOpacity onPress={()=>{this.RequestPupop()}}
                                style={{width : '35%', height : 55, backgroundColor : '#ededed', justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#333"}}>
                                    연락처 바로 보기
                                </Text>
                            </TouchableOpacity>
                        )}

                    </View>




                    {this.state.requestPopup && (
                    <View style={{width : '100%', height : '100%', position:'absolute', alignItems : 'center', justifyContent :'center'}}>
                        <View style={{backgroundColor : '#333',opacity: 0.8,width : '100%', height : '100%', position : 'absolute', top: 0, left : 0}}>
                            
                        </View>
                        
                        <View style={{ width : '70%', height : 150, borderWidth : 1, borderColor : '#ededed', backgroundColor : '#fff'}}>
                            <View style={{padding : 15, height : '70%', justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>소유중인 이용권 : {this.state.userTicket}개</Text>
                                <Text style={{fontSize : 12, fontFamily: 'NanumSquareB', color : "#8c8c8c", marginTop : 10, lineHeight : 20}}>( 이용권을 사용하면 상대방의 연락처를 바로 볼 수 있습니다. )</Text>

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
    TalentChangeDetailScreen: {
      flex: 1,
      backgroundColor: '#fff',
    },


});
  