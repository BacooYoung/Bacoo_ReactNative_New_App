
import React, {Component} from 'react';
import {StyleSheet, View, ScrollView,TouchableOpacity,ActivityIndicator, Text,FlatList,Image, AsyncStorage} from 'react-native'; 
import detailCategory from "../common/detailCategory";

import { Server_IP,SubServer_IP } from '../common/serverIP';

import TalentChangeList from '../components/TalentChangeList'


import firebase from 'react-native-firebase'

const isReachedEnd = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 10;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};





export default class CategoryScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

      return {
        title: params ? params.screenTitle: '검색',
      }
  };

  constructor(props) {
    super(props);
    // call it again if items count changes
  }

  state = {
    result : [],
    categoryList : [],
    selectCategory : undefined,
    selectCategory_sub : 999,
    category : undefined,
    noData : false,
    page : 0,
    reLoadedDone : false,
    isLoaded : false,
    reLoaded : false,
    newLoaded : false,
    categoryLoad : ""
  }
  

  categoryLoad(index) { 

    this.setState({
      result : [],
      isLoaded : false,
      noData : false,
      page : 0
    })

      fetch( 
        `${Server_IP}/main/app/0/${index}`,
        {
          method: 'GET'
      } 
    )
        .then(response => response.json())  
        .then(json => {
            if(Number(json.status) === 0) {


                this.setState({
                  result : json.result,
                  isLoaded : true,
                  categoryLoad : index
                })

            } else {
              this.setState({
                noData : true,
                categoryLoad : index
              })
            }

        });
    
     
  }

  categoryMoreLoad() { 

    
    let page = this.state.page + 1


    fetch( 
      `${Server_IP}/main/app/${page}/${this.state.categoryLoad}`,
      {
        method: 'GET'
      } 
    )
      .then(response => response.json())  
      .then(json => {
          if(Number(json.status) === 0) {

            let result = this.state.result
            if(json.result) {
              json.result.map((content,i) => {
                result.push(content);
              })
            }
            
            this.setState({
              result ,
              reLoaded : true,
              reLoaded : false,
              page
            });


          } else {
            this.setState({
              noData : true
            })
          }

      });
    
     
  }

  selectCategoryAll() {
    if(Number(this.state.selectCategory_sub) !== 999) {
      
      if(Number(this.state.category) === 1001) {
        this.categoryLoad('1c2c3c4c5c6c7c8c9c10c11c12');
      } else if(Number(this.state.category) === 1002) {
        this.categoryLoad('13c14c15c16c17c18c19c20');
      } else if(Number(this.state.category) === 1003) {
        this.categoryLoad('21c22c23c24');
      } else if(Number(this.state.category) === 1004) {
        this.categoryLoad('25c26c27c28c29');
      } else if(Number(this.state.category) === 1005) {
        this.categoryLoad('30c31c32');
      } else if(Number(this.state.category) === 1006) {
        this.categoryLoad('33c34c35c36');
      } else if(Number(this.state.category) === 1007) {
        this.categoryLoad('37c38c39c40');
      } else if(Number(this.state.category) === 1008) {
        this.categoryLoad('41c42');
      } else if(Number(this.state.category) === 1009) {
        this.categoryLoad('1009');
      }

      this.setState({
        selectCategory_sub : 999
      })
    }
  }


  selectCategorySub(num) {
    if(Number(this.state.selectCategory_sub) !== Number(num)) {
      this.categoryLoad(num);
      this.setState({
        selectCategory_sub : num
      })
    }
    
  }

  componentDidMount() {

    
    firebase.analytics().setCurrentScreen('카테고리 메인');
    
    AsyncStorage.getItem('user_id')
    .then((user_id)=> { 
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
            screen : '카테고리 선택화면',
            nextScreen : '',
            screenTime : '',
            time : new Date()
          }),
      })
      .then(response => response.json())  
      .then(json => {

      });
    })


    let type = this.props.navigation.state.params.categoryType
    if(Number(type) === 1001) {
        this.categoryLoad('1c2c3c4c5c6c7c8c9c10c11c12');
        this.setState({
          categoryList : detailCategory.Detailcategory[0].list,
          category :type
        })
    } else if(Number(type) === 1002) {
      this.categoryLoad('13c14c15c16c17c18c19c20');
      this.setState({
        categoryList : detailCategory.Detailcategory[1].list,
        category :type
      })
    } else if(Number(type) === 1003) {
      this.categoryLoad('21c22c23c24');
      this.setState({
        categoryList : detailCategory.Detailcategory[2].list,
        category :type
      })
    } else if(Number(type) === 1004) {
      this.categoryLoad('25c26c27c28c29');
      this.setState({
        categoryList : detailCategory.Detailcategory[3].list,
        category :type
      })
    } else if(Number(type) === 1005) {
      this.categoryLoad('30c31c32');
      this.setState({
        categoryList : detailCategory.Detailcategory[4].list,
        category :type
      })
    } else if(Number(type) === 1006) {
      this.categoryLoad('33c34c35c36');
      this.setState({
        categoryList : detailCategory.Detailcategory[5].list,
        category :type
      })
    } else if(Number(type) === 1007) {
      this.categoryLoad('37c38c39c40');
      this.setState({
        categoryList : detailCategory.Detailcategory[6].list,
        category :type
      })
    } else if(Number(type) === 1008) {
      this.categoryLoad('41c42');
      this.setState({
        categoryList : detailCategory.Detailcategory[7].list,
        category :type
      })
    } else if(Number(type) === 1009) {

      this.categoryLoad('1009');
      this.setState({
        categoryList : detailCategory.Detailcategory[9].list,
        category :type
      })

    }
    
    
  }

  



  render() {

    if(this.state.categoryList.length === 0) {
      return null
    }

    return (
      <View style={styles.container}>

        <View style={{width : '100%',borderBottomWidth : 1, borderBottomColor : '#ededed' }}>
          <ScrollView style={{padding : 15}}
              horizontal={true} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity  onPress={()=> {this.selectCategoryAll()}}>
                <Text style={{fontSize : 16, color : Number(this.state.selectCategory_sub) === 999 ? '#b2f' : '#333', fontFamily: 'NanumSquareB', paddingRight : 25}}>ALL</Text>
              </TouchableOpacity>
              
              {this.state.categoryList.map((content, i) => {
                return (
                  <TouchableOpacity  onPress={()=> {this.selectCategorySub(content.index)}}
                    key={i} >
                    <Text style={{fontSize : 16, color :  Number(this.state.selectCategory_sub) === Number(content.index) ? '#b2f' : '#333', fontFamily: 'NanumSquareB', paddingRight : 25}}>{content.name}</Text>
                  </TouchableOpacity>
                );  
                
              })}
          </ScrollView>
      </View>

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

            if (isReachedEnd(nativeEvent) && this.state.reLoaded === false && this.state.newLoaded === false ) {
              
              this.setState({
                reLoaded : true
              }, () => {
                  this.categoryMoreLoad();
              })
            }
          }}
          >
    
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
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }



});
