import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, AsyncStorage,ActivityIndicator ,FlatList,TouchableOpacity} from 'react-native'

import { Server_IP,SubServer_IP } from '../common/serverIP';


import firebase from 'react-native-firebase'

const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };
  

export default class MyPageTalentGetRequestListScreen extends Component {
   
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
        token : undefined,
        reLoaded : false,
        page : 0,
    }


    moreResultLoad() {
        let page = this.state.page + 1

        fetch( 
            `${Server_IP}/request/talent/${Number(this.state.userId)}`,
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
    }

    componentDidMount() {

        this.didFocusListener = this.props.navigation.addListener(
            'didFocus',
            () => { 
                
                firebase.analytics().setCurrentScreen('받은요청');

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
                            screen : '받은요청 화면',
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
                            `${Server_IP}/request/talent/${Number(userId)}`,
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
      
            },
          );

        
                
            
        

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
                    <Text  style={{fontSize : 20, fontFamily: 'NanumSquareB', color : "#8c8c8c"}}>받은요청이 없습니다.</Text>
                </View>
            )
        }
       //TalentChangeGetRequestDetailScreen
        return(

            <View  style={styles.MyPageTalentGetRequestListScreen}>

                <ScrollView showsVerticalScrollIndicator ={false}>

                    <FlatList
                            
                        numColumns ={2}
                        data={this.state.result}
                        extraData={false} 
                        renderItem={(items) => { 
                        
                        return  <View style={{width : '45%',  borderRadius : 5, marginBottom : 35, marginLeft : 15}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('TalentChangeGetRequestDetailScreen', {screenTitle : '이용권 구매', datas : items.item})}  >

                                        <Image
                                            resizeMode='stretch'
                                            style={{width : '100%', height : 150, borderTopLeftRadius : 5, borderTopRightRadius :5}}
                                            source={{uri: items.item.image }}
                                        />

                                        <View style={{borderWidth : 2, 
                                                    backgroundColor : '#fff',
                                                    shadowColor: '#000',
                                                    borderBottomLeftRadius : 10,
                                                    borderBottomRightRadius : 10,
                                                    shadowOffset: { width: 1, height: 0.5 },
                                                    shadowOpacity: 0.4,
                                                    shadowRadius: 0.8,
                                                    elevation: 7,
                                                    borderColor : '#fff'}}>
                                            <View style={{padding : 15, maxWidth : '100%'}}>
                                                <View>
                                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : "#000"}}>{items.item.name}</Text> 
                                                </View>


                                                <View style={{width : '95%',marginTop : 15 }}>
                                                    <Text style={{fontSize : 12, marginTop : 5, marginBottom : 5, fontFamily: 'NanumSquareEB', color : "#333"}}>
                                                        가지고 있는 재능 :
                                                    </Text>

                                                    <Text numberOfLines={1} style={{fontSize : 12,  fontFamily: 'NanumSquareB', color : "#b2f", lineHeight :15}}>
                                                        { items.item.hadTalent }
                                                    </Text>
                                                    </View>

                                                    <View style={{width : '95%',marginTop : 10 }}>
                                                    <Text style={{fontSize : 12, marginTop : 5, marginBottom : 5, fontFamily: 'NanumSquareEB', color : "#333"}}>
                                                        배우고 싶은 재능 :
                                                    </Text>

                                                    <Text numberOfLines={1} style={{fontSize : 12,  fontFamily: 'NanumSquareB', color : "#b2f", lineHeight :15}}>
                                                        { items.item.wantTalent }
                                                    </Text>
                                                    </View>
                                            </View>

                                        </View>

                                    </TouchableOpacity>

                                </View>
                        
                        
                        
                        }}
                        keyExtractor={ (item, index) => index.toString()}
                        
                    />

                    

                </ScrollView>

                


              

                
               
            </View>

        );

    };
}



const styles = StyleSheet.create({

    MyPageTalentGetRequestListScreen: {
      flex: 1,
      backgroundColor: '#ededed',
      alignItems : 'center',
      
      paddingTop : 15
    },


});
  