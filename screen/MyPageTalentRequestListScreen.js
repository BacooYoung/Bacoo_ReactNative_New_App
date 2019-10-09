import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, AsyncStorage,ActivityIndicator ,FlatList, Alert} from 'react-native'

import { Server_IP,SubServer_IP } from '../common/serverIP';
import { TouchableOpacity } from 'react-native-gesture-handler';

import firebase from 'react-native-firebase'
const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

export default class MyPageTalentRequestListScreen extends Component {
   
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: 'Default Screen Title',
        }
    };

    state = {
        result : [],
        isLoaded : false,
        userId : undefined,
        reLoaded : false,
        page : 0
    }


    resultMoreLoad() {
        
        let page = this.state.page + 1

        fetch( 
            `${SubServer_IP}/request/talent/my/${this.state.userId}/${page}`,
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

        firebase.analytics().setCurrentScreen('등록재능');

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
                    screen : '등록재능 화면',
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
                    `${SubServer_IP}/request/talent/my/${userId}/0`,
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


    deleteChange(tlId) {

        Alert.alert(
            '',
            '해당 재능을 삭제하시겠습니까?',
            [
              {
                text: '아니요',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: '네', onPress: () => {

                
                    fetch( 
                        `${Server_IP}/delete/myrequest/${Number(tlId)}`,
                        {
                        method: 'GET',
                    }
                    )
                    .then(response => response.json())  
                    .then(json => {
                        
                        if(json.status === 0) {
                        alert("삭제 완료");
                        
                        let result = this.state.result;
                    
                        result.map((content,i) => {
                            if(Number(content.talentlistId) === Number(tlId)) {
                            result.splice(i,1);
                            }
                        })
                    
                        this.setState({ result : result})
                    
                        } else {
                        alert("삭제 실패")
                        }
                        
                    });
              }
            
            },
            ],
            {cancelable: false},
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
                    <Text  style={{fontSize : 20, fontFamily: 'NanumSquareB', color : "#8c8c8c"}}>등록된 재능이 없습니다.</Text>
                </View>
            )
        }
       
        return(

            <View  style={styles.MyPageTalentRequestListScreen}>

                <ScrollView style={{width : '95%'}}  
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={400} 
                onScroll={({nativeEvent}) => {

                    if (isReachedEnd(nativeEvent) && this.state.reLoaded === false && this.state.newLoaded === false ) {
                    
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
                        
                        return  <View style={{width : '100%',backgroundColor : '#fff', borderRadius : 5, marginBottom : 35}}>

                                    <Image
                                        resizeMode='stretch'
                                        style={{width : '100%', height : 200, borderTopLeftRadius : 5, borderTopRightRadius :5}}
                                        source={{uri: items.item.infoImage === null  ? items.item.image : items.item.infoImage }}
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
                                                borderColor : '#fff', 
                                                paddingBottom : 10}}>
                                        <View style={{padding : 15}}>
                                            <View style={{flexDirection : 'row'}}>
                                                <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>[{items.item.hadTalent}] </Text>
                                                <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}> 가르쳐 드리고</Text>
                                            </View>

                                            <View style={{flexDirection : 'row', marginTop : 15}}>
                                                <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>[{items.item.wantTalent}] </Text>
                                                <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}> 배우고 싶어요.</Text>
                                            </View>
                                        </View>

                                        <View  style={{flexDirection : 'row',marginTop :20}}>

                                           

                                            <View
                                            style={{width : '100%', alignItems : 'center', justifyContent : 'center'}}>
                                                <TouchableOpacity onPress={()=> {this.deleteChange(items.item.talentlistId)}}>
                                                    <Text style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "red"}}>삭제</Text>
                                                </TouchableOpacity>
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

                


              

                
               
            </View>

        );

    };
}



const styles = StyleSheet.create({

    MyPageTalentRequestListScreen: {
      flex: 1,
      backgroundColor: '#ededed',
      alignItems : 'center',
      paddingTop : 15
    },


});
  