import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, AsyncStorage,ActivityIndicator ,FlatList,TouchableOpacity} from 'react-native'

import { Server_IP,ONLINEServer_IP, SubServer_IP } from '../common/serverIP';

import firebase from 'react-native-firebase'

const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

export default class MyPageTalentListScreen extends Component {
   
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: 'Default Screen Title',
        }
    };

    state = {
        result : [],
        isLoaded : true,
        userId : undefined,
        reLoaded : false,
        phonePopup : false,
        phone : "",
        page : 0,
        token : undefined
    }

    resultMoreLoad() {
        
        let page = this.state.page + 1
        fetch( 
            `${SubServer_IP}/talent/matched/${Number(this.state.userId)}/${page}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': this.state.token.replace(/"/g,'')
                }
            }
        )
        .then(response => response.json())  
        .then(json => {
            
            if(json.status === 0) {
                let result = this.state.result
                if(json.result) {
                    json.result.map((content,i) => {
                        result.push(content);
                    })
                }
                
                this.setState({
                    result ,
                    reLoaded : false,
                    page
                });
            } else {
                this.setState({
                    reLoaded : false
    
                });
            }
            
        });
    }

    componentDidMount() {
        
        firebase.analytics().setCurrentScreen('재능교환중');

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
                    screen : '재능교환중 화면',
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
                    `${SubServer_IP}/talent/matched/${Number(userId)}/0`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': token.replace(/"/g,'')
                        }
                    }
                )
                .then(response => response.json())  
                .then(json => {
                    
                    if(json.status === 0) {
                        console.log({json})
                        this.setState({
                            result : json.result, 
                            isLoaded : true,
                            userId : userId,
                            token : token
            
                        });
                    } else {
                        this.setState({
                            isLoaded : true,
                            userId : userId,
                            token : token
            
                        });
                    }
                    
                });
            });
        });
                
            
        

    }


    foo(timestamp){



        var date = new Date(timestamp);

        var yyyy = date.getFullYear();
        var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
        var dd  = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  
        return yyyy+ "-" + mm + "-" + dd


    }

    

    render() {

       

        if(this.state.isLoaded === false) {
            return (
                <View style={{width : '100%', height : '50%', justifyContent : 'center', alignItems :'center'}}>
                     <ActivityIndicator size="large" color="#b2f" />
                </View>
            )
        }


        if(this.state.result.length === 0) {
            return (
                <View style={{width : '100%', height : '50%', justifyContent : 'center', alignItems :'center'}}>
                    <Text  style={{fontSize : 20, fontFamily: 'NanumSquareB', color : "#8c8c8c"}}>등록된 재능이 없습니다.</Text>
                </View>
            )
        }
       
        return(

            <View  style={styles.MyPageTalentListScreen}>

                <ScrollView style={{width : '100%'}}  
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={400} 
                        onScroll={({nativeEvent}) => {

                            if (isReachedEnd(nativeEvent) && this.state.reLoaded === false  ) {
                            
                            this.setState({
                                reLoaded : true
                            }, () => {
                                this.resultMoreLoad();
                            })
                            }
                        }}
                        >

                    <FlatList
                            
                        data={this.state.result}
                        extraData={this.state.reLoaded}
                        renderItem={(items) => { 
                        
                        return  <View style={{width : '100%',backgroundColor : '#fff'}}>

                                   

                                    <View style={{borderWidth : 1, 
                                                backgroundColor : '#fff',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 1, height: 0.5 },
                                                shadowOpacity: 0.4,
                                                shadowRadius: 0.8,
                                                elevation: 7,
                                                borderColor : '#fff', 
                                                paddingBottom : 10}}>
                                                
                                        <View style={{padding : 15, paddingBottom : 5}}>
                                            <View style={{flexDirection : 'row'}}>
                                                <Image
                                                    resizeMode='cover'
                                                    style={{width : 50, height : 50, borderRadius : 50/2, borderWidth : 1, borderColor : '#ededed'}}
                                                    source={{uri: items.item.image }} 
                                                /> 
                                                
                                                <View style={{justifyContent : 'center', marginLeft : 15}}>
                                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#8c8c8c"}}>{this.foo(items.item.time) }</Text>
                                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : "#000", marginTop : 5}}>{items.item.name}</Text>
                                                </View>

                                                {Number(items.item.rqeustUserId) !== Number(this.state.userId) && items.item.phone !== null  && (
                                                    <TouchableOpacity onPress={()=> {this.setState({phonePopup : true, phone : items.item.phone})}}
                                                        style={{flex : 1, justifyContent : "center", alignItems : 'flex-end'}}>
                                                        <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>연락처</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>

                                    </View>

                                </View>
                        
                        
                        
                        }}
                        keyExtractor={ (item, index) => index.toString()}
                        
                    />
                    {this.state.reLoaded && (
                        <View style={{ width : "100%", marginTop : 15, marginBottom : 15}}>
                          <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                      )}
                    

                </ScrollView>

                


              

                {this.state.phonePopup && (
                    <View style={{width : '100%', height : '100%', position:'absolute', alignItems : 'center', justifyContent :'center'}}>
                        <View style={{backgroundColor : '#333',opacity: 0.8,width : '100%', height : '100%', position : 'absolute', top: 0, left : 0}}>
                            
                        </View>
                        
                        
                        <View style={{ width : '70%', height : 150, borderWidth : 1, borderColor : '#fff', backgroundColor : '#fff'}}>
                            <View style={{padding : 15, height : '70%', justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#333"}}>연락처</Text>
                                <Text style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : "#000",marginTop : 10}}>{this.state.phone}</Text>
                            </View>
                            
                            <View style={{width : '100%',  height : '30%', flexDirection : 'row'}}>
                              

                                <TouchableOpacity  onPress={()=> {this.setState({phonePopup : false})}}
                                style={{backgroundColor : '#b2f', width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>닫기</Text>
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

    MyPageTalentListScreen: {
      flex: 1,
      backgroundColor: '#ededed',
      alignItems : 'center',
      position : 'relative'
    },


});
  