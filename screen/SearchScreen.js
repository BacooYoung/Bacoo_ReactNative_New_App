import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, AsyncStorage,TextInput ,TouchableOpacity} from 'react-native'

import { Server_IP,SubServer_IP } from '../common/serverIP';

import firebase from 'react-native-firebase'

export default class SearchScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: '검색',
        }
    };


    state = {
        result : [],
        isLoaded : false,
        SearchTalent : ""
    }

    search() {
        this.props.navigation.navigate('SearchResultScreen', {screenTitle : this.state.SearchTalent+' - 검색결과', search :this.state.SearchTalent , type : 1})
    }

    componentDidMount(){
        
            firebase.analytics().setCurrentScreen('검색 메인');

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
                screen : '검색메인 화면',
                nextScreen : '',
                screenTime : '',
                time : new Date()
              }),
          })
          .then(response => response.json())  
          .then(json => {
    
          });
        });
    }
    

    render() {


        return(

            <View  style={styles.SearchScreen}>

                
                
                <ScrollView style={{backgroundColor : '#fff'}}>

                    <View style={{height : 60, margin : 20, marginBottom: 10, borderWidth : 1 , borderColor : '#8c8c8c' , flexDirection :'row', borderRadius : 5, alignItems : 'center', justifyContent :'center'}}>
                        
                        <Image
                            style={{width :  22, height : 22}}
                            source={{uri: 'https://i.imgur.com/Ulpp2Bb.png'}}
                        /> 

                        <TextInput
                            placeholder={'원하는 재능을 검색해주세요.'}
                            onSubmitEditing={()=> {this.search()}}
                            placeholderTextColor={'#8c8c8c'}
                            style={{width : 250,height: 40,borderRadius : 5, fontSize : 18,paddingLeft  : 15, marginTop : 2, fontFamily: 'NanumSquareEB', alignItems : 'center', borderColor: '#fff', borderWidth: 1}}
                            onChangeText={(SearchTalent) => this.setState({SearchTalent})}
                            value={this.state.SearchTalent}
                        />

                    </View>


                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SearchDetailScreen', {screenTitle : '이용권 구매'})}  
                     style={{marginLeft : 20, flexDirection :'row', alignItems: 'center', marginTop : 10}}>
                        <Image
                            resizeMode='stretch'
                            style={{width : 20, height : 20}}
                            source={{uri: 'https://i.imgur.com/zx21wzL.png'}}
                            
                        />
                        <Text  style={{fontSize : 16, color : '#b2f', fontFamily: 'NanumSquareEB', paddingLeft : 5}} >상세검색</Text>
                    </TouchableOpacity>


                    
                    






                    <View style={{margin : 20, marginTop : 100}}>
                        <Text style={{fontSize : 24, color : '#000', fontFamily: 'NanumSquareEB'}}>
                            재능 카테고리
                        </Text>

                        <View style={{flexDirection : 'row', marginTop : 40}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '언어', categoryType : 1001})}  
                                style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_1.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        언어
                                    </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '디자인', categoryType : 1002})}  
                            style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_2.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        디자인
                                    </Text>
                            </TouchableOpacity>
                        </View>



                        <View style={{flexDirection : 'row', marginTop : 40}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : 'IT지식', categoryType : 1003})}  
                                style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_3.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        IT지식
                                    </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '음악', categoryType : 1004})}  
                            style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_4.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        음악
                                    </Text>
                            </TouchableOpacity>
                        </View>



                        <View style={{flexDirection : 'row', marginTop : 40}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '춤', categoryType : 1005})}  
                                style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_5.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        춤
                                    </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '요리', categoryType : 1006})}  
                             style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_6.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        요리
                                    </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{flexDirection : 'row', marginTop : 40}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '뷰티', categoryType : 1007})}  
                                style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_7.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        뷰티
                                    </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '운동', categoryType : 1008})}  
                             style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_8.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        운동
                                    </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={{flexDirection : 'row', marginTop : 40}}>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CategoryScreen', {screenTitle : '지식', categoryType : 1009})}  
                                style={{flexDirection : 'row', width : '50%', alignItems : 'center'}}>
                                    <Image
                                        style={{width :  28, height : 28}}
                                        source={require('../assets/category_9.png')}
                                    /> 

                                    <Text style={{fontSize : 20, color : '#333', fontFamily: 'NanumSquareB', marginLeft : 15}}>
                                        지식
                                    </Text>
                            </TouchableOpacity>

                        </View>




                    </View>

                </ScrollView>

            </View>

        );

    };
}



const styles = StyleSheet.create({
    SearchScreen: {
      flex: 1,
      backgroundColor: '#fff',
    },


});
  