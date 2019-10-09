
import React, {Component} from 'react';
import {StyleSheet, View, ScrollView,TouchableOpacity,ActivityIndicator, Text,FlatList, AsyncStorage} from 'react-native'; 

import { Server_IP,SubServer_IP } from '../common/serverIP';

import firebase from 'react-native-firebase'

export default class AlertScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

      return {
        title: params ? params.screenTitle: '알람',
      }
  };

  constructor(props) {
    super(props);
    // call it again if items count changes
  }

  state = {
    result : [],
    isLoaded : false,
    noData : false
  }

 



  componentDidMount() {

    this.didFocusListener = this.props.navigation.addListener(
        'didFocus',
        () => { 
            firebase.analytics().setCurrentScreen('알람 화면');
    
            

     
            AsyncStorage.getItem('user_id')
            .then((user_id )=> {
            if(user_id) {

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
                        screen : '알람 화면',
                        nextScreen : '',
                        screenTime : '',
                        time : new Date()
                      }),
                  })
                  .then(response => response.json())  
                  .then(json => {
            
                  });


                
                fetch( 
                    `${Server_IP}/alert/user/${user_id}`
                )
                .then(response => response.json())  
                .then(json => {

                    if(json.status === 0) {
                        this.setState({
                            result : json.result, 
                            isLoaded : true
                        });
                    } else {
                        this.setState({
                            isLoaded : true,
                            noData : true
                        });
                    }
                    
                    
        
        
            });
            }
            });

    });

    
    
  }

  timefomat(timestamp){



        var date = new Date(timestamp);

        var yyyy = date.getFullYear();
        var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
        var dd  = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();


        return yyyy+ "-" + mm + "-" + dd;


    }

    timefomat2(timestamp) {



        var date = new Date(timestamp);



        var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();


        return hh+ "시 " + min + "분" ;


    }

    selectAlert(type, typeId, alertId) {

        if(Number(type) === 2) { // 받은 요청
            fetch( 
                `${Server_IP}/alert/check/${alertId}`
            )
            .then(response => response.json())  
            .then(json => {
                this.props.navigation.navigate('MyPageTalentGetRequestListScreen', {screenTitle : '받은 요청'})
            });
        } else if(Number(type) === 3) { // 재능교환중
            fetch( 
                `${Server_IP}/alert/check/${alertId}`
            )
            .then(response => response.json())  
            .then(json => {
                this.props.navigation.navigate('MyPageTalentListScreen', {screenTitle : '재능교환중'})
            });
        } else if(Number(type) === 10) {

            fetch( 
                `${Server_IP}/alert/check/${alertId}`
            )
            .then(response => response.json())  
            .then(json => {
                this.props.navigation.navigate('RcmScreen', {type : typeId})
            });

        }
    }


    checkType(index) {
        switch(index) {
            case 1:
                return "메세지";
            case 2:
                return "재능교환";
            case 3:
                return "재능교환";
            case 4:
                return "강의추천";
            case 5:
                return "수업신청";
            case 6:
                return "재능교환 리뷰";
            case 7:
                return "꿀팁 리뷰";
            case 10:
                return "바꾸 추천";
            default:
                return "에러";
        }
    }

    checkText(type, name) {
        switch(type) {
            case 1:
                return name + "님 에게 메세지가 도착했습니다.";
            case 2:
                return name + "님이 재능교환을 요청했습니다.";
            case 3:
                return name + "님과의 재능교환이 성사되었습니다.";
            case 4:
                return "좋아하실만한 강의를 추천해드려요!";
            case 5:
                return "등록하신 꿀팁에 대하여 수업 신청이 들어왔습니다.";
            case 6:
                return "재능교환 상대로부터 리뷰가 작성되었습니다.";
            case 7:
                return "수강생으로부터 리뷰가 작성되었습니다.";
            case 10:
                return "회원님을 위한 재능인들을 추천해드립니다!";
            default:
                return "에러";
        }
    }

  



  render() {

    if(!this.state.isLoaded && !this.state.noData) {
        return (
            <View style={{width : '100%' , height : '70%', alignItems : 'center', justifyContent : 'center'}}>
                <ActivityIndicator size="large" color="#b2f" />
            </View>
        )
    }

    if(this.state.isLoaded && this.state.noData) {
        return (
            <View style={{width : '100%' , height : '70%', alignItems : 'center', justifyContent : 'center'}}>
                <Text style={{fontSize : 20, fontFamily: 'NanumSquareB', color : "#8c8c8c"}}>표시할 알람이 없습니다.</Text>
            </View>
        )
    }


    return (
      <View style={styles.container}>

        <ScrollView>

        {this.state.result.map((content,i) => {
            return (
                <View key={i}
                style={{width : '100%'}}>
                
                    {(Number(i) === 0 || this.timefomat(content.time) !== this.timefomat(this.state.result[i-1].time)) && (
                        <View style={{paddingTop : i === 0 ? 10 : 30, borderTopWidth : i === 0 ? 0 : 2, borderTopColor : '#ededed', marginTop: 15}}>
                            <Text style={{fontSize : 22, fontFamily: 'NanumSquareEB', color : "#000", paddingLeft : 15}}>{this.timefomat(content.time)}</Text>
                        </View>
                    )}
                    
                    

                    <TouchableOpacity 
                        onPress={()=> {this.selectAlert(content.type, content.sendUserId, content.userAlertId)}}
                        style={{width : '100%', flexDirection : 'row', marginTop : 20, paddingLeft : 20}}>
                        
                        <View style={{width : '20%'}}>
                            <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : "#000"}}>{this.checkType(content.type)}</Text>
                            <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#8c8c8c", marginTop : 5}}>{this.timefomat2(content.time)}</Text>
                        </View>

                        <View style={{marginLeft : 15, width : '75%'}}>
                            <Text style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#333", lineHeight : 20}}>{this.checkText(content.type, content.name)}</Text>
                        </View>

                    </TouchableOpacity>

                  


                </View>
            )
        })}


        </ScrollView>


      


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }



});
