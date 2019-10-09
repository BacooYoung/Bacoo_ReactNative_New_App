import React, {Component} from 'react'
import {View,Text,StyleSheet,Alert, ScrollView, TextInput,Keyboard,ActivityIndicator ,TouchableOpacity,localStorage} from 'react-native'
import { Server_IP ,APPServer_IP} from '../common/serverIP';
import MessageMyChat from '../components/MessageMyChat';
import MessageYouChat from '../components/MessageYourChat';


import io from 'socket.io-client';

const socket = io('https://api.dabacoo.com:2100');
/*
 2019 05 21 - 작업 일지
 1. 재능교환 수락 거절 테스트해야함 * 로그인 이후에
 2. 프로필 토스 구현 안됨
 
*/

export default class MessageDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.name: '메세지',
        }
    };


    state = {
        result : [],
        isLoaded : false,
        myId : this.props.navigation.state.params.myId,
        yourId : this.props.navigation.state.params.yourId, 
        height : 0,
        scrollY : 100,
        messageText : "",
        status : false,
        inputHeight : 0,
        sendLoading : false
    }

   
    add_message(data) {
        let myText = new Array();
        let result = this.state.result;

        myText["myId"] = data.data.userId;
        myText["name"] = data.data.name;
        myText["yourId"] ='admin' ;
        myText["messageText"] = data.data.text;
        myText["time"] = data.data.time;

        result.push(myText);

        

        this.setState({
            result

        })
    
    }

    
    componentDidMount() {

        socket.emit('chatInit', {roomName: this.props.navigation.state.params.myId === 'admin' ? this.props.navigation.state.params.yourId : this.props.navigation.state.params.myId});

        socket.on('chat_send_get', this.add_message.bind(this)); 

        fetch(
            `${APPServer_IP}/adminchat/detail` ,
          {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                myId: this.state.myId,
                youId: this.state.yourId,
              }),
          })
          .then(response => response.json())  
          .then(json => {
            this.setState({
                result : json.result, 
                isLoaded : true
              });
          });

        
    }

    request_ok(requesttalentId, receiveduserId, requestuserId) {
        var jbResult = false;



        Alert.alert(
            '재능교환',
            '요청을 수락하시겠습니까?',
            [
              {
                text: '아니요',
                onPress: () => jbResult = false,
                style: 'cancel',
              },
              {text: '수락', onPress: () => jbResult = true},
            ],
            {cancelable: false},
          );




        let myId = receiveduserId;
        let youId = requestuserId;

        if(Number(localStorage.getItem("user_id")) !== Number(myId)) {
          myId = requestuserId;
          youId = receiveduserId;

        }

        if(jbResult) {
            this.$http.post(`${Server_IP}/request/talent/status`, {
                "requesttalentId" : requesttalentId,
                "myId" : myId,
                "youId" : youId,
                "type" : "ok"
                
            },{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
            .then(response => {
                return response.json();
            }).then(data => {
                if(data.status == 0) {
                    alert("완료");
                    window.location.reload();
                } else {
                    alert("실패");
                    
                }
            }, error => {
                //console.log(error);
            });
        }
            
    }

    request_no(requesttalentId, receiveduserId, requestuserId) {

        var jbResult = false;



        Alert.alert(
            '재능교환',
            '요청을 거절하시겠습니까?',
            [
              {
                text: '아니요',
                onPress: () => jbResult = false,
                style: 'cancel',
              },
              {text: '거절', onPress: () => jbResult = true},
            ],
            {cancelable: false},
          );


        if(jbResult) {
              this.$http.post(`${Server_IP}/request/talent/status`, {
                "requesttalentId" : requesttalentId,
                "myId" : receiveduserId,
                "youId" : requestuserId,
                "type" : "no"
            
            },{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
            .then(response => {
                return response.json();
            }).then(data => {
                if(data.status == 0) {
                    alert("완료");
                    window.location.reload();
                } else {
                    alert("실패");
                    
                }
            }, error => {
                //console.log(error);
            });
        }
    }

    sendMessage() {
        const messageText = this.state.messageText;
    
        if(messageText && messageText !== "") {
            this.setState({
                sendLoading : true
            })


            fetch(
                `${APPServer_IP}/adminchat/send/` ,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    myId: 'admin',
                    youId: this.props.navigation.state.params.myId === 'admin' ? this.props.navigation.state.params.yourId : this.props.navigation.state.params.myId,
                    text : messageText
                }),
            })
            .then(response => response.json())  
            .then(json => {
                let status = json.status;
              
                if(status === 0) {
                    let myText = new Array();
                    let result = this.state.result;
    
                    myText["myId"] = 'admin';
                    myText["yourId"] = this.props.navigation.state.params.myId === 'admin' ? this.props.navigation.state.params.yourId : this.props.navigation.state.params.myId;
                    myText["messageText"] = this.state.messageText;
    
                    result.push(myText);

                    socket.emit('chat_send', {
                        roomName: this.props.navigation.state.params.myId === 'admin' ? this.props.navigation.state.params.yourId : this.props.navigation.state.params.myId,
                        userId : 'admin',
                        name :'admin',
                        text : this.state.messageText,
                        time : new Date()
                    });
    
                    this.setState({
                        result,
                        messageText : "",
                        sendLoading : false

                    })
                } else {
                    alert(json.status)
                }


              
              
            });
        }  else {
            alert('메세지를 입력해주세요');
        }
    }
    

    render() {

        if(!this.state.isLoaded) {
            return <ActivityIndicator  size="large"/>;
        }


        return(


            <View  style={styles.MessageDetailScreen}>
                <ScrollView  
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }}
                    style={styles.MessageDetailScreen}
                >
                    <View style={{paddingBottom : 50}}>
                    {this.state.result  && (
                        this.state.result.map((content, i) => {
                            if(content.myId === 'admin') {
                                return <MessageMyChat 
                                                key ={i}
                                                datas={content}/>
                            } else {
                                return <MessageYouChat 
                                                key ={i}
                                                datas={content}
                                                request_no = {this.request_no.bind(this)}
                                                request_ok = {this.request_ok.bind(this)}/>
                            }
                        })
                    )}
                    </View>
                </ScrollView>


                

                    <View style={styles.MessageDetailBottomButton}>
                        <ScrollView>
                        <TextInput
                        
                        autoCapitalize={'none'}
                        
                        autoCorrect={false}
                        
                        multiline={true}
                        onContentSizeChange={(e) => this.setState({inputHeight : e.nativeEvent.contentSize.height}) }

                            placeholder={'하고싶은말을 입력해주세요.'}
                            placeholderTextColor={'#8c8c8c'}
                            onSubmitEditing={Keyboard.dismiss}
                            style={{height: 80, width: '80%',borderRadius : 5,paddingLeft : 15, borderColor: '#fff', borderWidth: 1}}
                            onChangeText={(messageText) => this.setState({messageText})}
                            value={this.state.messageText}
                        />
                        </ScrollView>

                   

                        {this.state.sendLoading === false && (
                            <TouchableOpacity onPress={()=>{this.sendMessage()}}
                            style={{width : '20%', height : 85, backgroundColor : '#bb22ff', justifyContent : 'center', alignItems : 'center'}}>
                            <Text style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#fff"}}>
                              전송
                            </Text>
                          </TouchableOpacity>
                           
                        )}
                
                         {this.state.sendLoading === true && (
                            <ActivityIndicator  size="large"/>
                        )}

                        
                        
                    </View> 
                
            </View>     

        );
    };
}



const styles = StyleSheet.create({
    MessageDetailScreen: {
      flex: 1,
      backgroundColor: '#fff',
      
    },

    MessageDetailBottomButton : {
        
        width : '100%',
        maxHeight : 100,
        borderTopWidth : 1,
        borderWidth : 1,
        borderColor : '#ededed',
        borderTopColor : '#ededed',
        backgroundColor : '#fff',
        position : 'absolute',
        bottom :0,
        left : 0,
        flexDirection : "row"
    }


});
  