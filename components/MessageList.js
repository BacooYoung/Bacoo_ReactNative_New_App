import React from 'react';
import {View,Text,TouchableOpacity,Image, AsyncStorage} from 'react-native'


const MessageList = (props,navigation) => {
    return (
        <TouchableOpacity onPress={() => {
           props.navigation.navigate('MessageDetailScreen', {
               myId :props.datas.myId,
               yourId : 'admin',
               name : props.datas.yourname
           })
        }} >

            <View style={{marginTop : 15, borderBottomColor : "#CECECE", borderBottomWidth : 1}}>

                <View style={{ marginLeft : 15, flexDirection: 'row', marginBottom : 20}}>
                    <Image
                        resizeMode = "cover"
                        style={{ width: 55, height: 55, borderRadius : 100, borderWidth : 1, borderColor : '#ededed'}}
                        source={{uri: props.datas.image}}
                    />
                    <View style={{justifyContent : "center"}}>

                        <Text style={{marginLeft : 15,paddingTop: 10, fontSize : 16,fontWeight : "700", color : "#000000"}}>{props.datas.name === props.datas.myname ? props.datas.yourname  : props.datas.name}</Text>
                        <View style={{flexDirection: 'row'}}>
                        <Text style={{width : "80%", marginRight : 10, marginLeft : 15, marginTop : 5, color : "#A3A3A3"}}>
                            {props.see_text 
                            ? props.see_text.substring(0,22).replace(/\n/g, "") 
                            : null} 
                            {props.see_text 
                            ? props.see_text.length > 22 
                                ? " ···"
                                : null
                            : null} 
                        </Text>
                            
                        {props.status === 0 
                            ? <Image
                                style={{ marginRight : -50, marginTop : -15,  width: 30, height: 30}}
                                source={{uri: 'https://i.imgur.com/eIwLZcD.png'}}
                            />
                            : null}
                        
                        </View>
                    </View>

                </View>       

            </View>
        
        </TouchableOpacity>
    )
}

export default MessageList;