import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, TouchableHighlight,ActivityIndicator ,Dimensions} from 'react-native'
import { APPServer_IP } from '../common/serverIP';

import MessageList from '../components/MessageList'


export default class MessageListScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: '메세지',
        }
    };


    state = {
        result : [],
        your_result : [],
        my_result : [],
        see_result : [],
        isLoaded : false,
        status : 99,
        isLoaded_see : false,
        number : 1,
        userId : 0
    }

   
    

    
    componentDidMount() {
        
        let userId = 114;

        fetch( 
            `${APPServer_IP}/adminchat/userList/admin` 
          )
          .then(response => response.json())  
          .then(json => {


            let result = json.result;

            let your_result = [];
            let see_result = [];
            let my_result = [];

            result.map((content,i) => {
                if(Number(content.yourId) !== Number(userId)) {
                    your_result.push(content);

                } else {
                    my_result.push(content);
                }
            });


            your_result.map((content,i) => {
                
                let see_results= my_result.find((my_results, i) => {
                    return content.yourId === my_result.myId;
                });

                if(see_results) {

                    if(content.messageId > see_results.messageId) {
                        see_result.push(content);
                    } else if(content.messageId < see_results.messageId) {
                        see_result.push(see_results)
                    }
                } else {
                    see_result.push(content);
                }

            });

            


            this.setState({
                your_result,
                my_result,
                userId : userId,
                see_result,
                isLoaded : true,
                status : json.status
            })

          });
    }
    

    render() {

        if(!this.state.isLoaded) {
            return <ActivityIndicator  size="large"/>;
        }


        return(
            <View  style={styles.MessageListScreen}>
                <ScrollView>
                    {this.state.your_result && (
                        this.state.your_result.map((content,i) =>{
                           return (
                            <MessageList
                                navigation={this.props.navigation}
                                key = {i}
                                userId = {114}
                                datas={content}
                                yourId={content.yourId}
                                see_text={this.state.see_result ? this.state.see_result[i].messageText : null}
                                status = {this.state.see_result
                                            ? this.state.see_result[i].yourId === 114 
                                                ? this.state.see_result[i].status
                                                : null
                                            : null}
                            />
                           );
                        })
                    )}
                </ScrollView>
            </View>
        );
    };
}



const styles = StyleSheet.create({
    MessageListScreen: {
      flex: 1,
      backgroundColor: '#fff',
    },


});
  