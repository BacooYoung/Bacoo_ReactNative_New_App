import React from 'react';
import {  View, Text, StyleSheet, FlatList, Image, TouchableOpacity} from 'react-native';

const TalentChangeList = (props,navigation) => {
    
    
  return (
    <TouchableOpacity onPress={() => props.navigation.navigate('TalentChangeDetailSearch', {screenTitle : props.datas.title, classId : props.datas.talentlistId })}    
    style={{borderWidth : 1, borderColor : '#ededed', backgroundColor : '#fff', marginBottom : 15, position :'relative'}}
                >
                
                <View style={{width : '100%', height : 220}}>
                
                <Image
                    resizeMode='stretch'
                    style={{width : '100%', height : 220}}
                    source={{uri: 
                            props.datas.tl_InfoImage === "" || props.datas.tl_InfoImage === null ? 
                            
                            props.datas.image : props.datas.tl_InfoImage }}
                
                />
                </View>
                
                <View style={{padding : 15, flexDirection :'row'}}>

                <View style={{width : '70%'}}>

                    <View style={{width : '100%', height : 25 , flexDirection : 'row'}}>
                    
                    <Text numberOfLines={1} style={{fontSize : 14, maxWidth : '75%', fontFamily: 'NanumSquareEB', color : "#000"}}>
                        [{ props.datas.hadTalent }</Text>
                    <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#000"}}>] 가르쳐 드리고</Text>
                    </View>

                    <View style={{width : '100%', height : 25 , flexDirection : 'row'}}>
                    
                    <Text numberOfLines={1} style={{fontSize : 14, maxWidth : '75%', fontFamily: 'NanumSquareEB', color : "#000"}}>
                        [{ props.datas.wantTalent }</Text>
                    <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#000"}}>] 배우고 싶습니다</Text>
                    </View>


                </View>

                </View>

                
                <View style={{position : 'absolute', right : 0, top : 170, width : 100, height : 150}}>
                <View style={{width : 100, height : 75, alignItems : 'center'}}>
                    <Image
                        resizeMode='cover'
                        style={{width : 70, height : 70, borderRadius : 70/2, borderWidth : 0.1, borderColor : '#ededed'}}
                        source={{uri: props.datas.image }}
                    
                    />
                </View>
                <View style={{width : 100, height : 75, alignItems : 'center', marginTop : 5}}>
                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareEB', color : "#000"}}>
                    {props.datas.name}
                    </Text>
                </View>
                </View>

            </TouchableOpacity>
  );
}


const styles = StyleSheet.create({

  TalentChangeList: {

      flex: 1,
      height : 'auto',
      backgroundColor: '#ffffff',
      marginTop : 10,
      paddingBottom : 15,
      borderWidth: 0.5,
      borderColor: '#d6d7da'
    },

    
  
  
  });
  


export default TalentChangeList;

