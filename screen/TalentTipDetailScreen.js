import React, {Component} from 'react'
import {View,Text,StyleSheet,Image, ScrollView, ActivityIndicator, TouchableHighlight,Dimensions } from 'react-native'
import TalentTipType from '../components/TalentTipType'

import {ONLINEServer_IP} from '../common/serverIP'
import {timeString} from '../common/requestTimeList'



export default class TalentTipDetailScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: 'Default Screen Title',
        }
    };

    state = {
        result : [],
        curriculumDetail : [],
        isLoaded : false,
        imgLoading : false,
        result_review : [],
        resultPoint : 0
    }

    checkPoint() {
        if(this.state.result_review.length > 0) {
            let point = 0;
            this.state.result_review.map((content,i) => {
                point += Number(content.reviewPoint)
            });

            return point / this.state.result_review.length;

        } else {
            return 0;
        }
    }


    timeFomat(timestamp){



        var date = new Date(timestamp);

        var yyyy = date.getFullYear();
        var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
        var dd  = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  
        return yyyy+ "-" + mm + "-" + dd


    }
    

    
    componentWillMount() {
        //${this.props.navigation.state.params.classId}
        fetch( 
            `${ONLINEServer_IP}/online/detail/69` 
          )
          .then(response => response.json())  
          .then(json => {
            let curriculumDetail = [];
            if(json.result[0].curriculumDetail) {
                json.result[0].curriculumDetail.split('@').map((content,i) => {
                    curriculumDetail.push(content);
                })
            }


            fetch( 
                `${ONLINEServer_IP}/review/detail/${json.result[0].userId}/2` 
              )
              .then(response => response.json())  
              .then(json => {
    
                let resultPoint = this.checkPoint();
    
    
                this.setState({
                    result_review : json.result,
                    resultPoint : resultPoint
                });
    
              });

            this.setState({
              result : json.result, 
              isLoaded : true,
              curriculumDetail : curriculumDetail
            });
          });
    }


    showDay(index) {
        let check = false;

        if(this.state.isLoaded) {
            if(this.state.result[0].classDay !== null && this.state.result[0].classDay !== '' && this.state.result[0].classDay !== 'undefined' && this.state.result[0]) {
                let result = this.state.result[0].classDay.split(',');
                result.map((content,i) => {
                    if(Number(content) === Number(index)) {
                        check = true
                    }
                })
            } else {
                check = false;
            }
        }
        

        return check;
    }


    checkTimes() {
        if(this.state.result) {
            let startTime = timeString[this.state.result[0].classStartTime];
            let endTime = timeString[this.state.result[0].classEndTime];

            return startTime + ' ~ ' + endTime;
        } else {
            return '0'
        }
    }

    checkType() {
        let type = this.state.result[0].type
        if(Number(type) === 1){
            return '온라인'
        } else if(Number(type) === 2){
            return '오프라인'
        } 

    }

    checkTipTime() {
        let time = this.state.result[0].classTime
        if(Number(time) === 1){
            return '30분'
        } else if(Number(time) === 2){
            return '1시간'
        } else if(Number(time) ===3){
            return '1시간 30분'
        } else if(Number(time) ===4){
            return '2시간'
        } else if(Number(time) ===5){
            return '15분'
        } else if(Number(time) ===6){
            return '3시간'
        } else if(Number(time) ===7){
            return '4시간'
        } else if(Number(time) ===8){
            return '5시간'
        } else if(Number(time) ===9){
            return '6시간'
        }
    }

    


    render() {
        if(!this.state.isLoaded) {
            return null;
        }

        return(
            <View  style={styles.TalentTipDetailScreen}>
               
                <ScrollView>

                <View>
                    

                    {this.state.result[0].videoUrl &&
                    (
                        <View style={styles.slide1}>
                           
                            {!this.state.imgLoading && (
                                <View style={{backgroundColor : "#ededed", alignItems : "center", justifyContent :'center' ,height : 250, width : '100%'}}>
                                    <ActivityIndicator size="large" color="#b2f" />
                                </View>
                            )}
                        </View>
                    )}
                   

                   {!this.state.result[0].videoUrl &&
                    (
                        <View style={styles.slide2}>
                            <Image
                                resizeMode = "stretch"
                                style={{width : "100%", height : 250}}
                                source={{uri: this.state.result[0].mainImage}}
                            />
                        </View>
                    )}

                    


                    
                   
                   
                </View>

                <View style={{marginRight : 15, marginLeft : 15, marginTop : 15}}>
                    <Text style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : '#000'}}> 
                        {this.state.result[0].title}
                    </Text>
                </View>

                
                <TalentTipType 
                    showDay={this.showDay.bind(this)}
                    checkTimes={this.checkTimes.bind(this)}
                    classType={this.checkType.bind(this)}
                    checkTipTime={this.checkTipTime.bind(this)}
                    classNumber = {this.state.result[0].classNumber}
                    classTimePay={this.state.result[0].classTimePay}
                />

                <View style={{margin : 15, marginTop : 60}}>
                    <Text style={{ fontSize:24, color : '#000', fontFamily: 'NanumSquareEB'}}>
                        강사 경력
                    </Text>
                    
                    <View style={{marginTop : 20}}>
                        <Text style={{ fontSize:16, color : '#333', lineHeight: 30}}>
                            {this.state.result[0].userInfo}
                        </Text>
                        
                    </View>

                </View>


                <View style={{ marginTop : 60}}>
                    <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000'}}>
                        꿀팁 소개
                    </Text>
                    
                    <View>
                        <Image
                            style={{width : "100%", height : 300, margin : 0}}
                            source={{uri: this.state.result[0].mainImage}}
                        />

                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:14, color : '#000', lineHeight : 30}}>
                            {this.state.result[0].mainText}
                        </Text>
                    </View>

                </View>


                <View style={{ marginTop : 120}}>
                    <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000'}}>
                        꿀팁 스토리
                    </Text>
                    
                    <View>
                        <Image
                            style={{width : "100%", height : 300, margin : 0}}
                            source={{uri: this.state.result[0].tipInfoImage.split('|')[0]}}
                        />

                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:15, color : '#000', lineHeight : 30}}>
                            {this.state.result[0].tipInfoText}
                        </Text>
                    </View>

                </View>


                <View style={{ marginTop : 120}}>
                    <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000' }}>
                        어떤 꿀팁을 받아갈 수 있나요?
                    </Text>
                    
                    <View>
                        <Image
                            style={{width : "100%", height : 300, margin : 0}}
                            source={{uri: this.state.result[0].tipGetImage.split('|')[0]}}
                        />

                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:16, color : '#000', lineHeight : 35}}>
                        {this.state.result[0].tipGetText}
                        </Text>
                    </View>

                </View>

                {this.state.curriculumDetail.length !== 0 && 
                    (
                        <View style={{ marginTop : 120}}>
                            <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000'}}>
                                커리큘럼
                            </Text>


                            <View style={{margin : 15, marginTop : 5}}>
                                <View >
                                    <Text style={{fontSize : 18, color : "#b2f", fontFamily: 'NanumSquareEB', marginBottom : 15}}>
                                        {this.state.result[0].curriculumName}
                                    </Text>

                                    {this.state.curriculumDetail.map((content,index) => {
                                        return (
                                            <View key={index} style={{flexDirection : 'row', margin: 15, marginTop: 0, marginBottom : 0}}>

                                                <View style={{width : 1, borderWidth : 1, borderColor : "#ededed"}}></View>

                                                <View style={{marginLeft : 15, paddingBottom : 30}}>
                                                    <View style={{width : 12, height : 12, borderRadius : 100, backgroundColor : "#b2f", position : 'absolute' , left : -22, top : 4}}></View>
                                                    <View><Text style={{color : '#000', fontFamily: 'NanumSquareEB', fontSize : 16}}>{index+1}회차 수업</Text></View>
                                                    <View style={{ marginTop : 10}}>
                                                        <Text style={{fontFamily: 'NanumSquareB', lineHeight : 30}}>{content}</Text>
                                                       
                                                    </View>
                                                </View>

                                            </View>
                                        )
                                    })}



                                </View>
                            </View>


                            
                            
                        </View>
                    )
                }


                {this.state.result[0].readyItem && (
                    <View style={{ marginTop : 100}}>
                        <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000' }}>
                            필요한 준비물이 있나요?
                        </Text>
                        
                        <View>
                            <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:16, color : '#000', lineHeight : 35}}>
                                {this.state.result[0].readyItem}
                            </Text>
                        </View>

                    </View>   
                )}


                <View style={{ marginTop : 100}}>
                    <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000' }}>
                        수업 진행 안내
                    </Text>
                    
                    <View>
                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:15, color : '#000', lineHeight : 30}}>
                            - 수업은 온라인 화상으로만 진행되며, 따로 오프라인 강의는 제공하지 않습니다.
                        </Text>
                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:15, color : '#000', lineHeight : 30}}>
                        - '마이페이지-수강중수업-수업 시작하기'를 통해 강의를 시작하며, PC사용 시 캠을 사용할 수 있습니다.
                        </Text>
                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:15, color : '#000', lineHeight : 30}}>
                        - 수업 수강 전 강사님에게 수업문의를 사전에 꼭 부탁드리며, 준비물이 있는 경우 수업 전 준비해주시기 바랍니다.
                        </Text>
                        <Text style={{fontFamily: 'NanumSquareB', margin : 15, fontSize:15, color : '#000', lineHeight : 30}}>
                        - 수업 중 욕설, 음란행위, 폭력행위를 할 경우, 수업이 강제종료될 수 있으며, 수업료 환불이 어렵습니다.
                        </Text>
                    </View>

                </View>   


                <View style={{ marginTop : 100}}>
                    <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000' }}>
                        온라인 화상 수업 안내
                    </Text>
                    
                    <View style={{width : '100%', height : 250, borderWidth : 1, borderColor : '#ededed'}}>
                        
                    </View>

                </View>  

                <View style={{ marginTop : 100}}>
                    <Text style={{margin : 15, fontFamily: 'NanumSquareEB', fontSize:24, color : '#000' }}>
                        취소 및 환불 규정
                    </Text>
                    
                    <View style={{width : '90%',  marginLeft : 15}}>
                        <View>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#000'}}>강의 환불기준 원칙</Text>
                        </View>
                        <View style={{marginTop : 5}}>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25}}>학원의 설립/운영 및 과외교습에 관한 법률 제 18조(교습비 등의 반환 등)</Text>

                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 학원설립, 운영자, 교습자 및 개인과외교습자는 학습자가 수강을 계속할 수 없는 경우 또는 학원의 등록말소, 교습소 폐지 등으로 </Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>교습을 계속할 수 없는 경우에는 학습자로부터 받은 교습비를 반환하는 등 학습자를 보호하기 위하여 필요한 조치를 하여야 한다.</Text>
                        </View>

                        <View style={{marginTop : 10}}>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25}}>1. 강의를 제공할 수 없게 된 날: 이미 납부한 강의료 등을 일한 계산한 금액 환불</Text>
                        </View>

                        <View style={{marginTop : 10}}>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25}}>2. 강의기간이 1개월 이내의 경우</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 강의 시작전 : 이미 납부한 강의료 전액 환불</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 총 강의 시간의 1/3 경과전 : 이미 납부한 강의료의 2/3에 해당액 환불</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 총 강의 시간의 1/2 경과전 : 이미 납부한 강의료의 1/2에 해당액 환불</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 총 강의시간의 1/2 경과후 : 반환하지 않음</Text>
                        
                        </View>

                        <View style={{marginTop : 10}}>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25}}>3. 강의 기간이 1개월을 초과하는 경우</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 강의 시작전 : 이미 납부한 강의료 전액 환불</Text>
                            <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 14, lineHeight : 25, marginLeft : 15, marginTop : 10}}>- 강의 시작후 : 반환사유가 발생한 당해 월의 반환 대상 강의료 (강의료 징수기간이 1개월 이내인 경우에 따라 산출된 수강료를 말한다) 와 나머지 월의 강의료 전액을 합산한 금액 환불</Text>
                        </View>

                        <View style={{ marginTop : 25, marginBottom : 50}}>
                            <Text style={{fontWeight : 'bold', color : '#000', lineHeight : 25}}>*총 강의 시간의 강의료 징수기간 중의 총강의시간을 말하며, 반환 금액의 산정은 반환 사유가 발생한 나띾지 경과 된 강의시간을 기준으로 함</Text>
                        </View>
                    </View>



                    <View style={{margin : 15, paddingBottom : 20}}>

                        <View style={{flexDirection : 'row'}}>
                            <Text style={{color : '#000', fontFamily: 'NanumSquareEB'}}>
                                리뷰 ({this.state.result_review.length})
                            </Text>
                        </View>

                        
                        {this.state.result_review.length === 0 && (
                            <View style={{width : '100%', height : 150, marginTop : 10, borderWidth : 1, borderColor : '#ededed', alignItems : 'center', justifyContent :'center' }}>
                                <Text style={{fontWeight : '400', color : '#8c8c8c'}}>등록된 리뷰가 없습니다.</Text>
                            </View>
                        )}
                        
                        {this.state.result_review.length !== 0 && (
                            <View style={{width : '100%'}}>

                                {this.state.result_review.map((content,i) => {
                                    return (
                                        <View key={i} style={{flexDirection : 'row' , marginBottom : 15, marginLeft : 10, marginTop : 20}}>
                                            <View>
                                                <Image
                                                    style={{ width: 40, height: 40, resizeMode : "cover", borderRadius : 40/2}}
                                                    source={{uri: content.image}}
                                                />
                                                <Text style={{fontFamily: 'NanumSquareB', color : '#000', marginTop : 7}}>
                                                    {content.name}
                                                </Text>
                                            </View>
                                            <View style={{marginLeft : 15, marginRight : 50}}>
                                                <Text style={{fontFamily: 'NanumSquareB', color : '#8c8c8c', fontSize : 12}}>
                                                    {this.timeFomat(content.reviewTime)}
                                                </Text>

                                                <Text style={{fontFamily: 'NanumSquareB', lineHeight : 25, color : '#333', fontSize : 14, marginTop : 5}}>
                                                    {content.reviewText}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                })}

                            </View>
                        )}
                        

                    </View>

                </View>  
                
                
                



                </ScrollView> 

                    <TouchableHighlight style={styles.TTalentTipDetailScreenBottomButton} onPress={() => {this.RequestGo()}} >

                        <View style={{width : '100%', height : 50, justifyContent :"center", alignItems : "center"}}>
                            <Text style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#ffffff"}}>
                                {this.state.result[0].classTimePay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원 - 수업 신청하기
                            </Text>

                        </View>
                    </TouchableHighlight>
            </View>
        );
    };
}



const styles = StyleSheet.create({
    TalentTipDetailScreen: {
      flex: 1,
      backgroundColor: '#fff',
      paddingBottom : 45
    },



    TTalentTipDetailScreenBottomButton : {
        width : "100%",
        height : 45,
        alignItems: 'center',
        justifyContent: 'center',
        position : "absolute",
        bottom : 0,
        borderTopWidth : 1,
        borderTopColor : "#bfbfbf",
        backgroundColor: '#b2f',
      },


      wrapper: {
          width : '100%',
          height : 250
    },
    slide1: {
    position : 'relative',
      backgroundColor : "#ededed", alignItems : "center", justifyContent :'center' ,height : 250, width : '100%'
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
        
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    }
  
});
  


/*
props.navigation.navigate('TalentChangeDetailScreen', {
        result: props.datas,
      });
*/