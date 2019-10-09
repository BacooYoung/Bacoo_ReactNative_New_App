import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, TouchableHighlight,CheckBox ,TouchableOpacity, Platform} from 'react-native'

import { Server_IP,ONLINEServer_IP } from '../common/serverIP';
import IMP from "iamport-react-native"; 





 
export default class CardPayImp extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: 'Default Screen Title',
        }
    };


    state = {
        result : [],
        isLoaded : false,
        card : false,
        payShow  : false,
        checkoutId : undefined    ,
        response : "",
        tep : ""
    }

          /*
                response:
                imp_uid: "imp_467195826524"
                success: "true"
                __proto__: Object
        */

       callback(response){ /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */

        const { navigation } = this.props; 


            if(response.imp_success === 'true') {
                this.props.navigation.navigate('BuyTicketDoneScreen', {
                    screenTitle : '결제 결과',
                    imp_uid : response.imp_uid,
                    success : response.imp_success,
                    checkoutId : this.state.checkoutId ,
                    count : navigation.getParam('count')
                })
            } 
            else if(response.success === 'true') {


                this.props.navigation.navigate('BuyTicketDoneScreen', {
                    screenTitle : '결제 결과',
                    imp_uid : response.imp_uid,
                    success : response.success,
                    checkoutId : this.state.checkoutId,
                    count : navigation.getParam('count')
                })


            } else {

                alert("결제 실패 - 관리자에 문의해주세요"); 
                this.props.navigation.goBack(null);
            }

        

  
    };


    componentDidMount() { 
        const { navigation } = this.props;

        let checkoutId =  navigation.getParam('checkoutId');

        this.setState({
            checkoutId
        })
    }

    

    render() {

        const { navigation } = this.props;
        let data = {
            pg: 'html5_inicis',
            pay_method : 'card',
            merchant_uid: 'bacoo_' + new Date().getTime(),

            app_scheme: 'bacooApp',

            name: navigation.getParam('name'),
            amount: navigation.getParam('amount'),

            buyer_email: navigation.getParam('buyer_email'),
            buyer_name: navigation.getParam('buyer_name'),
            buyer_tel: navigation.getParam('buyer_tel'),
            m_redirect_url : ""
            
        };
        

 
 
    return(

            <IMP.Payment
                userCode={'imp97598796'} // 가맹점 식별코드
                data={data} // 결제 데이터
                callback={this.callback.bind(this)} // 결제 종료 후 콜백
                loading={{
                    message: '잠시만 기다려주세요...', // 로딩화면 메시지 
                
                }}
            />


    );

    };
}



const styles = StyleSheet.create({
    CardPayImp: {
      flex: 1,
      backgroundColor: '#fff',
      position :"relative"
    },


});
  