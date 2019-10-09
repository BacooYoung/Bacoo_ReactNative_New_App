import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, Keyboard,TextInput,AsyncStorage ,TouchableOpacity} from 'react-native'

import { Server_IP,ONLINEServer_IP, SubServer_IP } from '../common/serverIP';

import firebase from 'react-native-firebase'


export default class SearchDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: '상세 검색',
        }
    };


    state = {
        result : [],
        keyboard : false,
        isLoaded : false,
        wantTCategory : 99,
        wantTCategoryPupup : false,
        hadTCategory : 99,
        hadTCategoryPupup : false,

        hadTalent : "",
        wantTalent : ""
    }

    
    WantTCategoryStepSelect(num) {

        this.setState({
            wantTCategory : num,
            wantTCategoryPupup : false
        })

    }

    HadTCategoryStepSelect(num) {

        this.setState({
            hadTCategory : num,
            hadTCategoryPupup : false
        })

    }

    componentDidMount() {


        firebase.analytics().setCurrentScreen('상세검색');

        AsyncStorage.getItem('user_id')
        .then((userId)=> {
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
                screen : '상세검색 화면',
                nextScreen : '',
                screenTime : '',
                time : new Date()
              }),
          })
          .then(response => response.json())  
          .then(json => {
    
          });
        });


        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide.bind(this),
        );


        


          
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


    search() {
        if(this.state.hadTalent === "" && this.state.wantTalent === "") {
            alert("둘중 한개는 입력해주세요.")
        } else {
            this.props.navigation.navigate('SearchResultScreen', {
                screenTitle : '상세검색 결과', 
                hadTalent :this.state.hadTalent , 
                wantTalent :this.state.wantTalent , 
                type : 2})
        }
    }
    

    render() {

        /*
<TouchableOpacity onPress={()=> {this.setState({wantTCategoryPupup : true})}}
                        style={{height : 60, marginBottom: 10, borderWidth : 1 , borderColor : '#8c8c8c' , marginTop : 10, flexDirection :'row', borderRadius : 5, alignItems : 'center', justifyContent :'center'}}>
                            
                            {this.state.wantTCategory === 99 && (
                                <Text style={{fontSize : 16, color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 15}} >카테고리 선택</Text>
                            )}

                            {this.state.wantTCategory !== 99 && (
                                <Text style={{fontSize : 16, color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 15}} >{this.state.wantTCategory}</Text>
                            )}
                        </TouchableOpacity>
        */


        return(

            <View  style={styles.SearchDetailScreen}>

                

                    


                    
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={{margin : 20,}}>
                        <Text style={{fontSize : 16, color : '#000', fontFamily: 'NanumSquareEB'}}>상대방의 가지고 있는 재능</Text>

                        

                        <View style={{height : 60, marginBottom: 10, borderWidth : 1 , borderColor : '#8c8c8c' , marginTop : 10, flexDirection :'row', borderRadius : 5, alignItems : 'center', justifyContent :'center'}}>
                            <Image
                                style={{width :  22, height : 22}}
                                source={{uri: 'https://i.imgur.com/Ulpp2Bb.png'}}
                            /> 
                            <TextInput
                                placeholder={'재능을 입력해주세요. (선택)'} 
                                placeholderTextColor={'#8c8c8c'}
                                onSubmitEditing={Keyboard.dismiss}
                                style={{width : 230,height: 40,borderRadius : 5, fontSize : 16,paddingLeft  : 15,  borderColor: '#fff', borderWidth: 1}}
                                onChangeText={(hadTalent) => this.setState({hadTalent})}
                                value={this.state.hadTalent}
                            />
                        </View>
                    </View>
                        


                    <View style={{margin : 20,}}>
                        <Text style={{fontSize : 16, color : '#000', fontFamily: 'NanumSquareEB'}}>상대방의 배우고 싶은 재능</Text>

                        

                        <View style={{height : 60, marginBottom: 10, borderWidth : 1 , borderColor : '#8c8c8c' , marginTop : 10, flexDirection :'row', borderRadius : 5, alignItems : 'center', justifyContent :'center'}}>
                            <Image
                                style={{width :  22, height : 22}}
                                source={{uri: 'https://i.imgur.com/Ulpp2Bb.png'}}
                            /> 
                            <TextInput
                                placeholder={'재능을 입력해주세요. (선택)'}
                                onSubmitEditing={Keyboard.dismiss}

                                placeholderTextColor={'#8c8c8c'}
                                style={{width : 230,height: 40,borderRadius : 5, fontSize : 16,paddingLeft  : 15,  borderColor: '#fff', borderWidth: 1}}
                                onChangeText={(wantTalent) => this.setState({wantTalent})}
                                value={this.state.wantTalent}
                            />
                        </View>
                    </View>
                </ScrollView>


                {this.state.keyboard === false && (
                    <TouchableOpacity style={styles.SearchDetailScreenBottomButton}  onPress={()=> this.search()} >

                        <View style={{width : '100%', height : 30, justifyContent :"center", alignItems : "center"}}>
                            <Text style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>상세 검색하기</Text>

                        </View>
                    </TouchableOpacity>
                )}





                {this.state.wantTCategoryPupup && (
                   <View style={{position: 'absolute', top: 0, left: 0, width : '100%', height : '90%', backgroundColor: 'rgba(0,0,0, 0.8)', justifyContent: 'center', alignItems: 'center'}}>
                   <View style={{width : '85%', height : '80%', backgroundColor  : '#fff'}}>
                       <View style={{width : '100%', height : '10%' , backgroundColor : '#b2f',  justifyContent: 'center', alignItems: 'center', flexDirection :'row'}}>
                           <View style={{width : '33%'}}>
                             
                           </View>
   
                           <View style={{width : '33%', alignItems :'center', justifyContent : 'center'}}>
                               <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>카테고리 선택</Text>
                           </View>
   
                           <TouchableOpacity onPress={() => { this.setState({wantTCategoryPupup : false})}}
                            style={{width : '33%', alignItems : 'flex-end', paddingRight : 15}}>
                               <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>X</Text>
                           </TouchableOpacity>
                       </View>
   
                           <View style={{width : '100%', height:'80%', marginTop : 20, justifyContent : 'center'}}>
   
                               <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center'}}>
                                   
                                    <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(0)}} 
                                    style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                        <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>전체</Text>
                                    </TouchableOpacity>


                                   <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(1)}} 
                                   style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>언어</Text>
                                   </TouchableOpacity>
   
                                   <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(2)}} 
                                   style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>디자인</Text>
                                   </TouchableOpacity>
   
                               
                               </View>
   
                               <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>

                               <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(3)}} 
                                   style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>코딩</Text>
                                   </TouchableOpacity>
                               <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(4)}} 
                                   style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>음악</Text>
                                   </TouchableOpacity>
   
                                   <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(5)}} 
                                   style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>춤</Text>
                                   </TouchableOpacity>
   
                               </View>
   
                               <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>

                                   
                               <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(6)}} 
                                   style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>요리</Text>
                                   </TouchableOpacity>
                               <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(7)}} 
                                   style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>뷰티</Text>
                                   </TouchableOpacity>
   
                                   <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(8)}} 
                                   style={{width : '25%', height : 40,  backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>운동</Text>
                                   </TouchableOpacity>
   
                             
                               </View>
   
                               <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>

                                    <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(9)}} 
                                   style={{width : '25%', marginRight : 25, height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>애견</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(10)}} 
                                   style={{width : '25%', height : 40 , marginRight : 25,backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>지식</Text>
                                   </TouchableOpacity>
   
                               </View>
   
   
                           </View>
   
                   </View>
               </View>



                )}




                {this.state.hadTCategoryPupup && (
                  <View style={{position: 'absolute', top: 0, left: 0, width : '100%', height : '90%', backgroundColor: 'rgba(0,0,0, 0.8)', justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{width : '85%', height : '80%', backgroundColor  : '#fff'}}>
                      <View style={{width : '100%', height : '10%' , backgroundColor : '#b2f',  justifyContent: 'center', alignItems: 'center', flexDirection :'row'}}>
                          <View style={{width : '33%'}}>
                            
                          </View>
  
                          <View style={{width : '33%', alignItems :'center', justifyContent : 'center'}}>
                              <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>카테고리 선택</Text>
                          </View>
  
                          <TouchableOpacity onPress={() => { this.setState({wantTCategoryPupup : false})}}
                           style={{width : '33%', alignItems : 'flex-end', paddingRight : 15}}>
                              <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>X</Text>
                          </TouchableOpacity>
                      </View>
  
                          <View style={{width : '100%', height:'80%', marginTop : 20, justifyContent : 'center'}}>
  
                              <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center'}}>
                                  
                                   <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(0)}} 
                                   style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                       <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>전체</Text>
                                   </TouchableOpacity>


                                  <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(1)}} 
                                  style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>언어</Text>
                                  </TouchableOpacity>
  
                                  <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(2)}} 
                                  style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>디자인</Text>
                                  </TouchableOpacity>
  
                              
                              </View>
  
                              <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>

                              <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(3)}} 
                                  style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>코딩</Text>
                                  </TouchableOpacity>
                              <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(4)}} 
                                  style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>음악</Text>
                                  </TouchableOpacity>
  
                                  <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(5)}} 
                                  style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>춤</Text>
                                  </TouchableOpacity>
  
                              </View>
  
                              <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>

                                  
                              <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(6)}} 
                                  style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>요리</Text>
                                  </TouchableOpacity>
                              <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(7)}} 
                                  style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>뷰티</Text>
                                  </TouchableOpacity>
  
                                  <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(8)}} 
                                  style={{width : '25%', height : 40,  backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>운동</Text>
                                  </TouchableOpacity>
  
                            
                              </View>
  
                              <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>

                                   <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(9)}} 
                                  style={{width : '25%', marginRight : 25, height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>애견</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(10)}} 
                                  style={{width : '25%', height : 40 , marginRight : 25,backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                      <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>지식</Text>
                                  </TouchableOpacity>
  
                              </View>
  
  
                          </View>
  
                  </View>
              </View>


                )}



            </View>

        );

    };
}



const styles = StyleSheet.create({
    SearchDetailScreen: {
      flex: 1,
      backgroundColor: '#fff',
      position : 'relative'
      
    },


    SearchDetailScreenBottomButton : {
        width : "100%",
        height : 60,
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
  