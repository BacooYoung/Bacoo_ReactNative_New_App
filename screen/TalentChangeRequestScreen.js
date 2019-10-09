
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text,Image, TextInput, ScrollView, Keyboard, AsyncStorage,KeyboardAvoidingView, Platform} from 'react-native';
import { Server_IP, SubServer_IP } from '../common/serverIP';





export default class TalentChangeRequestScreen extends Component {

    state = {
        requestText : '',
        hadTalent : "",
        hadTalentList : [],
        wantTalent : "",
        wantTalentList : [],
        phone : "",
        authNumber : "",
        phoneDone : false,
        keyboard : false,
        status : false,
        userId : undefined,
        phoneState : false
    }


    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: 'Default Screen Title',
        }
    };

    constructor(props) {
        super(props);
        // call it again if items count changes
    }

    componentDidMount() {



        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide.bind(this),
        );

        AsyncStorage.getItem('user_id').then((userId) => {
            if(userId) {

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
                        screen : '재능요청 보내는 화면',
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
                        if(Number(json.result[0].phoneState) === 0) {
                            this.setState({  
                                userId ,
                                phone : json.result[0].phone.replace(/-/gi,""),
                            });
                        } else {
                            this.setState({  
                                phoneState : true,
                                phone : json.result[0].phone.replace(/-/gi,""),
                                userId 
                            });
                        }

                        
                    
                    });
                });

            }
        })



      }
    
      componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    
      _keyboardDidShow() {
          
        this.setState({
            keyboard : true
        })
      }
    
      _keyboardDidHide() {
        this.setState({
            keyboard : false
        })
      }

      addPhoneAuth() {
        fetch(
            `${SubServer_IP}/phone/auth/add`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId : this.state.userId,
                phone : this.state.phone
            }),
        })
        .then(response => response.json())  
        .then(json => {
            console.log({json})
            if(json.status === 0) {
                alert("인증번호 발송 완료");
                this.setState({
                    phoneDone : true
                })
            } else {
                alert("인증번호 발송 실패");
                
            }
          
        });
      }

      selectPhoneAuth() {
        fetch(
            `${SubServer_IP}/phone/auth/select`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId : this.state.userId,
                phone : this.state.phone,
                number : this.state.authNumber
            })
        })
        .then(response => response.json())  
        .then(json => {
            if(json.status === 0) {
                alert("인증 성공!");
                this.setState({
                    phoneState : true
                })
            } else {
                alert("인증 실패!");
                
            }
          
        });

      }

      addHadTalent() {
          if(this.state.hadTalent !== "") {
            let talentList = this.state.hadTalentList;

            talentList.push(this.state.hadTalent);
            this.setState({
                hadTalent : "",
                hadTalentList : talentList
            })

          } else {
            alert('재능을 입력해주세요.')
          }
      }

      addWantTalent() {
        if(this.state.wantTalent !== "") {
          let talentList = this.state.wantTalentList;

          talentList.push(this.state.wantTalent);
          this.setState({
            wantTalent : "",
            wantTalentList : talentList
          })
          
        } else {
          alert('재능을 입력해주세요.')
        }
    }

    showHadTalent() {
        if(this.state.hadTalentList.length > 0) {
            let talentList = this.state.hadTalentList;

            let talent = "";
            talentList.map((content,i) => {
                if(Number(i) === 0) {
                    talent = "#"+content +" ";
                } else {
                    talent = talent + " #" +content+" ";
                }
            })

            return talent;
        }
    }

    showWantTalent() {
        if(this.state.wantTalentList.length > 0) {
            let talentList = this.state.wantTalentList;

            let talent = "";
            talentList.map((content,i) => {
                if(Number(i) === 0) {
                    talent = "#"+content +" ";
                } else {
                    talent = talent + " #" +content+" ";
                }
            })

            return talent;
        }
    }

    requestTalent() {

        if(this.state.hadTalentList.length === 0) {
            alert("가르칠 재능을 입력해주세요.");
        } else if(this.state.wantTalentList.length === 0) {
            alert("원하는 재능을 입력해주세요.");
        } else if(this.state.requestText === "") {
            alert("하고싶은말을 입력해주세요.");
        } else if(this.state.phoneState === false) {
            alert("휴대폰 인증후 재능교환 요청을 보낼수있습니다.");
        }else if(this.state.status === false) {
            this.setState({
                status : true
            }, () => {
                fetch(
                    `${Server_IP}/request/add`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        talentlistId : this.props.navigation.state.params.result.talentlistId,
                        requestuserId : this.state.userId, 
                        receiveduserId : this.props.navigation.state.params.result.userId ,
                        requestText : this.state.requestText
                    }),
                })
                .then(response => response.json())  
                .then(json => {
                    
                    console.log({json})
                    if(json.status === 0) {
                        alert("요청 완료");
                        this.props.navigation.goBack(null);
                    } else {
                        alert("요청 실패");
                        this.setState({
                            status : false
                        })
                    }
                  
                  
                });
            })
            
        } else {
            alert("통신중입니다.");
        }
        
      }




  render() {

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} 
        behavior = {Platform.OS === "ios" ? "padding"  : ""}
        enabled  
        keyboardVerticalOffset= {Platform.OS === "ios" ? 60  : 0}>

        <ScrollView
                    
                        keyboardShouldPersistTaps='always' style={{ flex : 1}}>
            
                <View style={{width : '100%', height : 150, backgroundColor : '#ededed'}}>
                    <Image
                        resizeMode='stretch'
                        style={{width : '100%', height : 150 }}
                        source={{uri: this.props.navigation.state.params.image}}
                        
                    />
                </View>

                <View style={{width : '100%', height : 80, alignItems : 'center', justifyContent :'center'}}> 
                    <Text style={{fontFamily: 'NanumSquareEB', fontSize : 16, color : '#333'}}>{this.props.navigation.state.params.name}님에게 재능교환 요청을 보냅니다.</Text>
                </View>

                <View style={{width : '100%', margin : 15 }}>

                    <View style={{flexDirection : 'row', width : '100%', position : 'relative'}}>
                        <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', paddingTop : 6, color : '#333'}}>가르칠 재능</Text>
                        <View style={{width : '45%', marginLeft : 15}}>
                            <TextInput
                                onSubmitEditing={Keyboard.dismiss}
                                style={{height: 35, width: '100%',borderRadius : 5,paddingLeft : 10, borderColor: 'gray', borderWidth: 1}}
                                onChangeText={(hadTalent) => this.setState({hadTalent})}
                                value={this.state.hadTalent}
                            />
                        </View>
                        <TouchableOpacity onPress={()=> {this.addHadTalent()}}
                        style={{width : 50, alignItems : 'center' , justifyContent : 'center', marginLeft : 15}}>
                            <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : '#b2f'}}>+ 추가</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.hadTalentList.length > 0 && (
                        <View style={{paddingTop : 15}}>
                            <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : '#b2f'}}>{this.showHadTalent()}</Text>
                        </View>
                    )}

                    
                </View>

                <View style={{width : '100%', margin : 15 }}>

                    <View style={{flexDirection : 'row', width : '100%', position : 'relative'}}>
                        <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', paddingTop : 6, color : '#333'}}>원하는 재능</Text>
                        <View style={{width : '45%', marginLeft : 15}}>
                            <TextInput
                                onSubmitEditing={Keyboard.dismiss}
                                style={{height: 35, width: '100%',borderRadius : 5,paddingLeft : 10, borderColor: 'gray', borderWidth: 1}}
                                onChangeText={(wantTalent) => this.setState({wantTalent})}
                                value={this.state.wantTalent}
                            />
                        </View>
                        <TouchableOpacity onPress={()=> {this.addWantTalent()}}
                        style={{width : 50, alignItems : 'center' , justifyContent : 'center', marginLeft : 15}}>
                            <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : '#b2f'}}>+ 추가</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.wantTalentList.length > 0 && (
                        <View style={{paddingTop : 15}}>
                            <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : '#b2f'}}>{this.showWantTalent()}</Text>
                        </View>
                    )}

                    
                </View>

                    <View style={{width : '100%', margin : 15, marginTop : 40, marginBottom :80 }}>

                        <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : '#000'}} >같이 재능교환 하고 싶은 이유</Text>
                        <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : '#8c8c8c', marginTop : 10}}>(이유를 상세하게 적어주시면 매칭 확률이 확 올라갑니다!)</Text>
                        <View style={{width : '90%', marginTop : 15}}>
                            <TextInput
                            
                                multiline={true}
                                numberOfLines={5}
                                onSubmitEditing={Keyboard.dismiss}
                                underlineColorAndroid="transparent"
                                style={{height: 35, width: '100%', height : 120, borderRadius : 5,paddingLeft : 10, borderColor: 'gray', borderWidth: 1}}
                                onChangeText={(requestText) => this.setState({requestText})}
                                value={this.state.requestText}
                            />
                        </View>



                    </View>
                
                
                
               {!this.state.phoneState && (
                    <View style={{width : '100%', margin : 15,  marginBottom : 100 }}>
                        <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : '#000'}} >휴대폰 번호</Text>

                        <View style={{flexDirection : 'row', width : '100%', position : 'relative', marginTop : 10}}>
                            <View style={{width : '45%'}}>
                                <TextInput
                                    onSubmitEditing={Keyboard.dismiss}
                                    style={{height: 45, width: '100%',borderRadius : 5,paddingLeft : 10, borderColor: 'gray', borderWidth: 1}}
                                    onChangeText={(phone) => this.setState({phone : phone.replace(/-/gi,"")})}
                                    value={this.state.phone}
                                />
                            </View>
                            <TouchableOpacity onPress={()=> {this.addPhoneAuth()}}
                                 style={{paddingLeft : 10, paddingRight : 10, borderRadius : 5, alignItems : 'center' , justifyContent : 'center', marginLeft : 15, backgroundColor : '#b2f'}}>
                                <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : '#fff'}}>인증하기</Text>
                            </TouchableOpacity>


                        </View>

                        {this.state.phoneDone && (
                            <View style={{flexDirection : 'row', width : '100%', position : 'relative', marginTop : 10}}>
                                <View style={{width : '45%'}}>
                                    <TextInput
                                        placeholder = {'인증번호를 입력해주세요.'}
                                        placeholderTextColor = {'#8c8c8c'}
                                        onSubmitEditing={Keyboard.dismiss}
                                        style={{height: 45, width: '100%',borderRadius : 5,paddingLeft : 10, borderColor: 'gray', borderWidth: 1}}
                                        onChangeText={(authNumber) => this.setState({authNumber})}
                                        value={this.state.authNumber}
                                    />
                                </View>
                                <TouchableOpacity onPress={()=> {this.selectPhoneAuth()}}
                                    style={{paddingLeft : 10, paddingRight : 10, borderRadius : 5, alignItems : 'center' , justifyContent : 'center', marginLeft : 15, backgroundColor : '#b2f'}}>
                                    <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : '#fff'}}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                    </View>
               )}




        </ScrollView>
       </KeyboardAvoidingView>

        {!this.state.keyboard && (
            <TouchableOpacity onPress={()=> {this.requestTalent()}}
            style={styles.TalentChangeRequestScreenBottomButton}   >

                <View style={{width : '100%', height : 50, justifyContent :"center", alignItems : "center"}}>
                    <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>요청 보내기 </Text>
                    <Text style={{fontSize : 12, fontFamily: 'NanumSquareB', color : "#ededed", marginTop : 5}}>( 상대방이 수락하면 연락처를 볼 수 있습니다. )</Text>
                </View>

            </TouchableOpacity>
        )}
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position : 'relative'
  },

  TalentChangeRequestScreenBottomButton : {
    width : "100%",
    height : 60,
    alignItems: 'center',
    justifyContent: 'center',
    position : "absolute",
    bottom : 0,
    borderTopWidth : 1,
    borderTopColor : "#bfbfbf",
    backgroundColor: '#b2f',
  },



});
