import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, ActivityIndicator,AsyncStorage ,Platform, FlatList} from 'react-native'

import { Server_IP,ONLINESubServer_IP, SubServer_IP } from '../common/serverIP';
import TalentChangeList from '../components/TalentChangeList'

import firebase from 'react-native-firebase'

const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 10;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };


export default class SearchResultScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: '검색',
        }
    };


    state = {
        result : [],
        isLoaded : false,
        reLoaded : false,
        noData : false,
        page : 0
    }



    resultMoreLoad(index) {
        let result  = "";
        let hadTalent = "";
        let wantTalent = "";

        if(this.props.navigation.state.params.search) {
            result = this.props.navigation.state.params.search;
        }

        if(this.props.navigation.state.params.hadTalent) {
            hadTalent = this.props.navigation.state.params.hadTalent;
        }

        if(this.props.navigation.state.params.wantTalent) {
            wantTalent = this.props.navigation.state.params.wantTalent;
        }

        let type  = this.props.navigation.state.params.type



        

        if(type === 1) {

        

            fetch(
                `${Server_IP}/search/`,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      main_text: result,
                      page : this.state.page + index,
                      type : 1
                  }),
              })
              .then(response => response.json())  
              .then(json => {
    
                if(json.status !== 0) {
    
                  this.setState({
                    noData : true,
                    reLoaded : false
                  })
                } else {
                    if(Number(index) === 0) {
                        this.setState({
                            result : json.result,
                            isLoaded : true,
                            page : this.state.page + index,
                            reLoaded : false
                        })
                    } else {

                        let result = this.state.result
                        if(json.result) {
                            json.result.map((content,i) => {
                                result.push(content);
                            })
                        }

                        this.setState({
                            result ,
                            reLoaded : false,
                            page : this.state.page + index,
                          });

                    }
                    
                }
          
              });  
        } else if(type === 2) {


          
            fetch(
                `${ONLINESubServer_IP}/search/detail/`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        hadTalent: hadTalent,
                        wantTalent: wantTalent,
                        type : 1,
                        page : this.state.page + index,
                        reLoaded : false
                    }),
                })
                .then(response => response.json())  
                .then(json => {
        
                if(json.status !== 0) {
                    this.setState({
                        noData : true,
                        reLoaded : false
                      })
                }
            
                if(Number(index) === 0) {
                    this.setState({
                        result : json.result,
                        isLoaded : true,
                        page : this.state.page + index,
                        reLoaded : false
                    })
                } else {

                    let result = this.state.result
                    if(json.result) {
                        json.result.map((content,i) => {
                            result.push(content);
                        })
                    }

                    this.setState({
                        result ,
                        reLoaded : false,
                        page : this.state.page + index,
                      });

                }
                
                
                
                }); 
        }
    }


    componentDidMount() {


        let type  = this.props.navigation.state.params.type;
        let result = "";
        if(type === 2) {
            result = "내 재능:"+this.props.navigation.state.params.hadTalent +"- 배우고싶은:"+this.props.navigation.state.params.wantTalent;
        } else {
            result = this.props.navigation.state.params.search
        }

        
            firebase.analytics().setCurrentScreen('검색 결과');

            AsyncStorage.getItem('user_id')
            .then((userId)=> {


                fetch(
                    `${SubServer_IP}/log/search` ,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId :userId,
                            searchResult : result,
                            searchTime : new Date(),
                            platform : Platform.OS
                        }),
                    })
                    .then(response => response.json())  
                    .then(json => {
            
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
                screen : '검색결과 화면',
                nextScreen : '',
                screenTime : '',
                time : new Date()
              }),
          })
          .then(response => response.json())  
          .then(json => {
    
          });
        });

            this.resultMoreLoad(0);
        
        
    }

    

    render() {


        return(

            <View  style={styles.SearchResultScreen}>

                {!this.state.isLoaded && !this.state.noData && (
                    <View>
                        <ActivityIndicator size="large" color="#b2f" />
                    </View>
                )}

                {this.state.noData && (
                    <View style={{alignItems : 'center', marginTop : 30}}>
                        <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>등록된 재능이 없습니다.</Text>
                    </View>
                )}

                {this.state.isLoaded && (
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={400} 
                        onScroll={({nativeEvent}) => {
            
                        if (isReachedEnd(nativeEvent) && this.state.reLoaded === false  ) {
                            
                            this.setState({
                            reLoaded : true
                            }, () => {
                                this.resultMoreLoad(1);
                            })
                        }
                        }}>
                    
                            <View style={{backgroundColor : '#bfbfbf'}}>
                            <FlatList
                            
                                data={this.state.result}
                                extraData={this.state.reLoaded}
                                renderItem={(items) => { 
                                
                                return  <TalentChangeList 
                                            key ={items.item.talentlistId} 
                                            datas ={items.item}
                                            navigation={this.props.navigation} />
                                
                                
                                
                                }}
                                keyExtractor={ (item, index) => index.toString()}
                                
                            />
                            </View>

                            {this.state.reLoaded && (
                                <View style={{ width : "100%", marginTop : 15, marginBottom : 15}}>
                                    <ActivityIndicator size="large" color="#0000ff" />
                                </View>
                                )}
                
                    </ScrollView>
                )}
            </View>

        );

    };
}



const styles = StyleSheet.create({
    SearchResultScreen: {
      flex: 1,
      backgroundColor: '#fff',
    },


});
  