
import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text,Image, TextInput, ScrollView, Keyboard, AsyncStorage,Dimensions,KeyboardAvoidingView,Platform} from 'react-native';
import detailCategory from "../common/detailCategory";
import ImagePicker from 'react-native-image-picker';
import { Server_IP, ONLINESubServer_IP ,SubServer_IP} from '../common/serverIP';

import firebase from "@firebase/app"
import "firebase/auth"
import "firebase/storage"




if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


async function uploadImageAsync(uri, userId) {

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase
      .storage()
      .ref()
      .child("/talentChange/"+new Date().getFullYear() + ""
          +(new Date().getMonth()+1) + ""
          +new Date().getSeconds()+new Date().getMilliseconds()
         + "_" + userId);
  
    await ref.put(blob);
    const imageSrc = await ref.getDownloadURL();
  
    return imageSrc;
  
}



const options = {
    quality: 1,
    
    maxWidth: 500,
    maxHeight: 500,
    title: '사진 선택',
    cancelButtonTitle: '취소',
    takePhotoButtonTitle: '사진 촬영',
    chooseFromLibraryButtonTitle: '갤러리에서 찾기',
    storageOptions: {
      skipBackup: true
    },
  };

export default class TalentChangeInitScreen extends Component {

    state = {
        requestText : '',
        keyboard : false,



        WantT_Category_Popup : false,
        WantT_Category_Step : false,
        WantT_Category_One : 99,
        WantT_Category : 99,
        WantT_Category_OneList : [],

        HadT_Category_Popup : false,
        HadT_Category_Step : false,
        HadT_Category_One : 99,
        HadT_Category : 99,
        HadT_Category_OneList : [],

        fisrtTalent : false, 
        firstLoding : false,


        gender : 0,
        genderDone : false,

        age : 0,
        ageDone : false,

        wantTalent : "",
        wantTalentTemp : "",
        wantTalentList : [],
        wantTalentDone : false,

        hadTalent : "",
        hadTalentTemp : "",
        hadTalentList : [],
        hadTalentDone : false,

        wantType : 0,
        wantTypeDone : false,
        wantLoc : "",

        myInfo : "",
        myInfoDone : false,

        myInfoImage : [],
        myInfoImageTemp1 : "",
        myInfoImageTemp2 : "",
        myInfoImageTemp3 : "",
        myInfoImageDone : false,

        wantTalentWhy : "",
        wantTalentWhyDone : false,
        
        howWantTalent : "",
        howWantTalentDone : false,

        myInfoExperience : "",
        myInfoExperienceDone : false,

        myInfoExperienceImage : [],
        myInfoExperienceImageDone : false,
        myInfoExperienceImageTemp1 : "",
        myInfoExperienceImageTemp2 : "",
        myInfoExperienceImageTemp3 : "",


        avatarSource: null,
        videoSource: null,


        userid : undefined,
        userinfoId : undefined,


        talentRequestDone : false,
        talentDone: false,


    }


    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
          title: params ? params.screenTitle: '재능 등록',
          headerTitleStyle: {
            fontFamily: 'NanumSquareB',
            color : '#333',

          },
        }
    };

    constructor(props) {
        super(props);
        // call it again if items count changes
    }

    componentDidMount() {


        this.keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          this._keyboardDidHide.bind(this),
        );


        AsyncStorage.getItem('user_id').then((userid)=> {
 
            fetch(
                `${SubServer_IP}/log/screen` ,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId : userid,
                    screen : '재능등록 시작 화면',
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
                `${Server_IP}/userinfo/${userid}`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': token.replace(/"/g,'')
                  }
              } 
            )
                .then(response => response.json())  
                .then(json => {
                    if(!json.result[0].age) {
                        this.setState({
                            fisrtTalent : true,
                            firstLoding : true,
                            userId : userid,
                            userinfoId : json.result[0].userinfoId
                        })
                    } else {
                        this.setState({
                            firstLoding : true,
                            userId : userid,
                            userinfoId : json.result[0].userinfoId
                        })
                    }

                });
            });
          })




        


          
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.scrollView.scrollToEnd({ animated: true })
        this.setState({
            keyboard : true
        })
    }

    _keyboardDidHide() {
        this.setState({
            keyboard : false
        })
    }


    genderSelect(num) {
        this.setState({
            gender : num,
            genderDone : true
        })
    }

    ageSelect(num) {

        fetch(
            `${ONLINESubServer_IP}/init/userinfo/` ,
          {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  userId : this.state.userId,
                  gender : this.state.gender,
                  age : num
              }),
          })
          .then(response => response.json())  
          .then(json => {

            this.setState({
                age : num,
                ageDone : true,
                fisrtTalent : false
            })

          });


        
    }

    checkAge() {
        let age = this.state.age;

        if(age === 1) {
            return '18~24살'
        } else if(age === 2) {
            return '25~34살'
        } else if(age === 2) {
            return '35~44살'
        } else if(age === 2) {
            return '45~54살'
        } else if(age === 2) {
            return '그 이상'
        }
    }

    addHadTalent() {
        let hadTalentList = this.state.hadTalentList
        if(this.state.hadTalent !== "") {
            hadTalentList.push(this.state.hadTalent);
            
            this.setState({
                hadTalent : "",
                hadTalentList
            })
        } else {
            alert("재능을 입력후 클릭해주세요.")
        }
    }

    getHadTlanetList() {
        let result = "";
        this.state.hadTalentList.map((content,i) => {
            if(Number(i) === 0) {
                result += '#'+content;
            } else {
                result += ' #'+content
            }
        });

        return result;
    }

    doneHadTalent() {
        this.setState({
            hadTalentDone : true
        })
    }



    addWantTalent() {
        let wantTalentList = this.state.wantTalentList
        if(this.state.wantTalent !== "") {
            wantTalentList.push(this.state.wantTalent);
            
            this.setState({
                wantTalent : "",
                wantTalentList
            })
        } else {
            alert("재능을 입력후 클릭해주세요.")
        }
    }

    getWantTlanetList() {
        let result = "";
        this.state.wantTalentList.map((content,i) => {
            if(Number(i) === 0) {
                result += '#'+content;
            } else {
                result += ' #'+content
            }
        });

        return result;
    }

    doneWantTalent() {
        this.setState({
            wantTalentDone : true
        })
    }



    addWantType(num) {
        if(num === 1) {
            this.setState({
                wantType : num,
                wantTypeDone : true
            })
        } else if(num === 2) {
            this.setState({
                wantType : num
            })
        }
       
    }

    addWantTypeDone() {
        this.setState({
            wantTypeDone : true
        })
       
    }


    addMyinfoDone() {

        AsyncStorage.getItem('user_id').then((userid)=> {
 
            fetch(
                `${SubServer_IP}/log/screen` ,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId : userid,
                    screen : '재능등록 - 자기소개 까지는 등록함',
                    nextScreen : '',
                    screenTime : '',
                    time : new Date()
                  }),
              })
              .then(response => response.json())  
              .then(json => {
        
              });

        });


        this.setState({
            myInfoDone : true
        })
       
    }

    checkCategory(number) {
        let result = "";
        detailCategory.Detailcategory.map((content,i)=>{
            content.list.map((list_content,j) => {
                if(Number(list_content.index) === Number(number)){
                    result =  list_content.name;
                }
            })
        })

        return result;
    }


    WantTCategoryStepSelect (number) {

        this.setState({
            WantT_Category_Step : true,
            WantT_Category_One : number,
            WantT_Category_OneList : detailCategory.Detailcategory[number-1].list
        })

    }

    WantTCategoryStepInit () {
        this.setState({
            WantT_Category_Step : false,
            WantT_Category_One : 99,
            WantT_Category : 99
        })
    }


    selectDetailCategory(index) {
        this.setState({
            WantT_Category : index,
            WantT_Category_One : 99,
            WantT_Category_Popup : false,
            WantT_Category_Step : false,
        })
    }


    HadTCategoryStepSelect (number) {

        this.setState({
            HadT_Category_Step : true,
            HadT_Category_One : number,
            HadT_Category_OneList : detailCategory.Detailcategory[number-1].list
        })

    }

    HadTCategoryStepInit () {
        this.setState({
            HadT_Category_Step : false,
            HadT_Category_One : 99,
            HadT_Category : 99
        })
    }


    selectHadDetailCategory(index) {
        this.setState({
            HadT_Category : index,
            HadT_Category_One : 99,
            HadT_Category_Popup : false,
            HadT_Category_Step : false,
        })
    }

    selectMyInfoImage(type){
        const self = this; 
        ImagePicker.showImagePicker(options, async (response) => {
            console.log('Response = ', response);
      
            if (response.didCancel) {
              console.log('User cancelled photo picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              let source = { uri: response.uri };
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                console.log({response})
            
                let uri = await uploadImageAsync(response.uri, this.state.userid)

                let myInfoImage = this.state.myInfoImage;
                myInfoImage.push(uri);

                if(Number(type) === 1 ){
                

                    self.setState({
                        myInfoImageTemp1: 'data:image/png;base64,' +response.data,
                        //myInfoImageTemp1: myInfoImage,
                        myInfoImage
                        //myInfoImageTemp1: response.uri,
                    });
                } else if(Number(type) === 2 ){
                    self.setState({
                        myInfoImageTemp2: 'data:image/png;base64,' +response.data,
                        //myInfoImageTemp2: myInfoImage,
                        myInfoImage
                    });
                } else if(Number(type) === 3 ){
                    self.setState({
                        myInfoImageTemp3: 'data:image/png;base64,' +response.data,
                        //myInfoImageTemp3: myInfoImage,
                        myInfoImage
                    });
                }
              
            }
          });
    }

    async selectExperienceImage(type) {
        const self = this;
        ImagePicker.showImagePicker( options, async (response)  => {
            console.log('Response = ', response);
       
            if (response.didCancel) {
              console.log('User cancelled photo picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {

              let uri = await uploadImageAsync(response.uri, this.state.userid)

              let myInfoExperienceImage = this.state.myInfoExperienceImage;
              myInfoExperienceImage.push(uri);
              
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                if(Number(type) === 1 ){
                

                    self.setState({
                        myInfoExperienceImageTemp1: 'data:image/jpeg;base64,' + response.data,
                        myInfoExperienceImage
                    });
                } else if(Number(type) === 2 ){
                    self.setState({
                        myInfoExperienceImageTemp2: 'data:image/jpeg;base64,' + response.data,
                        myInfoExperienceImage
                    });
                } else if(Number(type) === 3 ){
                    self.setState({
                        myInfoExperienceImageTemp3: 'data:image/jpeg;base64,' + response.data,
                        myInfoExperienceImage
                    });
                }
              
            }
          });
    }


    doneMyinfoImage() {

        AsyncStorage.getItem('user_id').then((userid)=> {
 
            fetch(
                `${SubServer_IP}/log/screen` ,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId : userid,
                    screen : '재능등록 - 사진도 등록함',
                    nextScreen : '',
                    screenTime : '',
                    time : new Date()
                  }),
              })
              .then(response => response.json())  
              .then(json => {
        
              });

        });


        this.setState({
            myInfoImageDone : true
        })
    }


    doneWhyWant() {
        this.setState({
            wantTalentWhyDone : true
        })
    }


    donehowWantTalent() {
        this.setState({
            howWantTalentDone : true
        })
    }


    doneMyInfoExperience() {

        AsyncStorage.getItem('user_id').then((userid)=> {
 
            fetch(
                `${SubServer_IP}/log/screen` ,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId : userid,
                    screen : '재능등록 - 상대방 스타일까지 입력함',
                    nextScreen : '',
                    screenTime : '',
                    time : new Date()
                  }),
              })
              .then(response => response.json())  
              .then(json => {
        
              });

        });


        this.setState({
            myInfoExperienceDone : true
        })
    }



    addTalent() { 
        AsyncStorage.getItem('user_id').then((userid)=> {
 
            fetch(
                `${SubServer_IP}/log/screen` ,
              {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId : userid,
                    screen : '재능등록 - 다 입력하고 등록 완료',
                    nextScreen : '',
                    screenTime : '',
                    time : new Date()
                  }),
              })
              .then(response => response.json())  
              .then(json => {
        
              });

        });

        this.setState({
            talentDone : true
        })

        let HadT_Category   = this.state.HadT_Category;
        let WantT_Category  = this.state.WantT_Category;

        let wantTalent= this.state.wantTalentList;

        let wantTalentTemp = wantTalent.map((content,i) => {
            return content;
        })
        

        let hadTalent = this.state.hadTalentList;

        let hadTalentTemp = hadTalent.map((content,i) => {
            return content;
        })

        
        let wantType = this.state.wantType;
        let wantLoc  = this.state.wantLoc;

        let myInfo = this.state.myInfo;
        let myInfoImage  = this.state.myInfoImage.map((content,i) => {
            return content
        });

        let wantTalentWhy  = this.state.wantTalentWhy;
        let howWantTalent = this.state.howWantTalent;

        let myInfoExperience = this.state.myInfoExperience;
        let myInfoExperienceImage = "null";

        
        let userId = this.state.userId;
        let userinfoId = this.state.userinfoId;

        let titles = hadTalent + ' 가르쳐 드리고 ' + wantTalent + ' 배우고 싶습니다.'


        fetch(  
            `${Server_IP}/addrequesttalent/`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                  title : titles,
                  hadlist: hadTalentTemp,
                  wantlist :wantTalentTemp,

                  hadTalentCategory : HadT_Category,
                  wantTalentCategory : WantT_Category,

                  infoImage : myInfoImage,
                  whyWantTalent : wantTalentWhy,
                  wantPerson : howWantTalent,

                  TalentExperienceText : myInfoExperience,
                  TalentExperienceImage : myInfoExperienceImage,
                  
                  hadlistlevel: "none",
                  wantlistlevel :"none",
                  time: "00",
                  location :wantLoc,
                  type: wantType,
                  tags :"none",
                  say: myInfo,

                  category : HadT_Category + ','+ WantT_Category,

                  userinfoId: userinfoId,
                  userId : userId

                }),
            })
            .then(response => response.json())  
            .then(json => {
    
              if(json.status !== 0) {
                alert("등록 실패, 관리자에게 문의해주세요.");
              }
        
              else {
                this.setState({
                    talentRequestDone : true,
                    talentDone : false
                })

                alert("등록 완료")
                this.props.navigation.goBack(null);
              }
              
              
              
            }); 
    }

    


  render() {


    return (

      <View style={styles.container}>

        <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} 
        behavior = {Platform.OS === "ios" ? "padding"  : ""}
        enabled  
        keyboardVerticalOffset= {Platform.OS === "ios" ? 60  : 0}>
        

        <ScrollView ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight)=>{        
                        this.scrollView.scrollToEnd({animated: true});
                    }}
                        keyboardShouldPersistTaps='always'
                        style={{margin : 15, flex : 1 , backgroundColor : '#ededed'}}>


                            
                   
            <View style={{padding: 15, borderRadius : 15, borderTopLeftRadius : 0, backgroundColor : '#fff', alignSelf: 'flex-start'}}>
                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>안녕하세요 :)</Text>
            </View>


            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', alignSelf: 'flex-start', marginTop : 20}}>
                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>재능인 여러분의 재능매칭을 위하여 아래 질문에 답변 부탁드립니다 :)</Text>
            </View>


            {
                // 최초 입력
            }

            

            

            {this.state.fisrtTalent && ( 
                <View>
                    {this.state.genderDone === false && (
                        <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                            <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>당신의 성별을 선택해주세요</Text>

                            <View style={{flexDirection : 'row', marginTop : 15, borderTopWidth : 2, borderTopColor : '#ededed', paddingTop : 15}}>

                                <TouchableOpacity onPress={() => {this.genderSelect(1)}}
                                                style={{width : 100, height : 20 , borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>남자</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {this.genderSelect(2)}}
                                                style={{width : 100, height : 20 ,marginLeft : 25, borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>여자</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    )}



                    {this.state.genderDone && (
                        <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                            <View style={{flexDirection : 'row'}}>
                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>성별 :</Text>
                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#b2f", paddingLeft : 10}}>{this.state.gender === 1 ? '남자' : '여자'}</Text>
                            </View>


                        </View>
                    )}

                    



                    {this.state.ageDone === false && this.state.genderDone  && (
                        <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                            <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>당신의 나이대를 선택해주세요</Text>

                            <View style={{flexDirection : 'row', marginTop : 15, borderTopWidth : 2, borderTopColor : '#ededed', paddingTop : 15}}>

                                

                                <TouchableOpacity onPress={() => {this.ageSelect(1)}}
                                            style={{width : 100, height : 35 , borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>18~24살</Text>
                                </TouchableOpacity>

                                <TouchableOpacity  onPress={() => {this.ageSelect(2)}}
                                    style={{width : 100, height : 35 ,marginLeft : 25, borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>25~34살</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{flexDirection : 'row', marginTop : 20}}>

                                <TouchableOpacity onPress={() => {this.ageSelect(3)}}
                                             style={{width : 100, height : 35 , borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>35~44살</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {this.ageSelect(4)}}
                                             style={{width : 100, height : 35 ,marginLeft : 25, borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>45~54살</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{flexDirection : 'row', marginTop : 20}}>

                                <TouchableOpacity onPress={() => {this.ageSelect(5)}}
                                             style={{width : 100, height : 35 , borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>그 이상</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}

                    
                    {this.state.ageDone && this.state.genderDone && (
                        <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                            <View style={{flexDirection : 'row'}}>
                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>나이대 :</Text>
                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#b2f", paddingLeft : 10}}>{this.checkAge()}</Text>
                            </View>


                        </View>
                    )}
                
                </View>
            )}
                
                {/* 최초 입력 끝*/}


              

                {this.state.fisrtTalent === false &&  this.state.firstLoding  && (
                    <View>

                        {this.state.hadTalentDone === false && (
                            <View >
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>가지고 있는 재능은 무엇인가요?</Text>

                                    
                                    <View style={{flexDirection : 'row' , width : '100%', marginTop : 15, alignItems : 'flex-end',borderTopWidth : 2, borderTopColor : '#ededed',}}>
                                        <View style={{width : '50%', marginTop : 5}}>

                                            {this.state.HadT_Category === 99 && (
                                                <TouchableOpacity onPress={() => {this.setState({HadT_Category_Popup : true})}}
                                                    style={{width : '100%', marginTop : 10, marginBottom : 10, paddingLeft : 5}}>
                                                    <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "blue"}}>카테고리를 선택해주세요</Text>
                                                </TouchableOpacity>

                                            )}

                                            {this.state.HadT_Category !== 99 && (
                                                <View style={{width : '100%', marginTop : 10, marginBottom : 10, paddingLeft : 5}}>
                                                    <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "blue"}}>{this.checkCategory(this.state.HadT_Category)}</Text>
                                                </View>
                                            )}

                                            {this.state.HadT_Category !== 99 && (
                                                <TextInput
                                                    placeholder={'재능을 입력해주세요.'}
                                                    placeholderTextColor={'#8c8c8c'}
                                                    onSubmitEditing={Keyboard.dismiss}
                                                    style={{height: 40, width: '100%',borderRadius : 5, borderColor: '#fff', borderWidth: 1}}
                                                    onChangeText={(hadTalent) => this.setState({hadTalent})}
                                                    value={this.state.hadTalent}
                                                />
                                            )}

                                            
                                        </View>

                                        {this.state.HadT_Category !== 99 && (
                                            <View 
                                            style={{width : '20%', marginTop : 5, height : 40, justifyContent : 'center', alignItems : 'flex-end'}}>
                                                <TouchableOpacity
                                                    onPress={() => {this.addHadTalent()}}>
                                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : "#b2f"}}>추가</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}


                                    

                                    </View>


                                    <View style={{marginTop : 15}}>
                                        <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.getHadTlanetList()}</Text>
                                    </View>



                                    {this.state.hadTalentList.length !== 0 && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity onPress={() => {this.doneHadTalent()}}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                

                                </View>
                            </View>
                        )}


                        {this.state.hadTalentDone && (
                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>가지고 있는 재능</Text>
    
                                <View style={{marginTop : 15}}>
                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.getHadTlanetList()}</Text>
                                </View>

    
    
                            </View>
                        )}


                       




                        {this.state.hadTalentDone && this.state.wantTalentDone === false && (
                            <View >
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>배우고 싶은 재능은 무엇인가요?</Text>

                                    <View style={{flexDirection : 'row' , width : '100%', marginTop : 15, alignItems : 'flex-end',borderTopWidth : 2, borderTopColor : '#ededed',}}>
                                        
                                        
                                        
                                        
                                        <View style={{width : '50%', marginTop : 5}}>

                                            {this.state.WantT_Category === 99 && (
                                                <TouchableOpacity onPress={() => {this.setState({WantT_Category_Popup : true})}}
                                                    style={{width : '100%', marginTop : 10, marginBottom : 10, paddingLeft : 5}}>
                                                    <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "blue"}}>카테고리를 선택해주세요</Text>
                                                </TouchableOpacity>
                                            )}

                                            {this.state.WantT_Category !== 99 && (
                                                <View style={{width : '100%', marginTop : 10, marginBottom : 10, paddingLeft : 5}}>
                                                    <Text style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "blue"}}>{this.checkCategory(this.state.WantT_Category)}</Text>
                                                </View>
                                            )}

                                            {this.state.WantT_Category !== 99 && (
                                                <TextInput
                                                    placeholder={'재능을 입력해주세요.'}
                                                    placeholderTextColor={'#8c8c8c'}
                                                    onSubmitEditing={Keyboard.dismiss}
                                                    style={{height: 40, width: '100%',borderRadius : 5, borderColor: '#fff', borderWidth: 1}}
                                                    onChangeText={(wantTalent) => this.setState({wantTalent})}
                                                    value={this.state.wantTalent}
                                                />
                                            )}

                                        </View>

                                        {this.state.WantT_Category !== 99 && (
                                            <View style={{width : '20%', marginTop : 5, height : 40, justifyContent : 'center', alignItems : 'flex-end'}}>
                                                <TouchableOpacity onPress={()=> this.addWantTalent()}>
                                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareEB', color : "#b2f"}}>추가</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        


                                    

                                    </View>

                                           
                                    <View style={{marginTop : 15}}>
                                        <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>
                                            {this.getWantTlanetList()}
                                        </Text>
                                    </View>



                                    {this.state.wantTalentList.length !== 0 && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity  onPress={()=> this.doneWantTalent()}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                

                                </View>
                            </View>
                        )}


                        {this.state.hadTalentDone && this.state.wantTalentDone  && (
                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>배우고 싶은 재능</Text>
    
                                <View style={{marginTop : 15}}>
                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.getWantTlanetList()}</Text>
                                </View>

    
                            </View>
                        )}


                       



                        
                        {this.state.hadTalentDone && this.state.wantTalentDone && this.state.wantTypeDone === false && (
                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>희망하는 수업 방식은 무엇인가요?</Text>

                                <View style={{flexDirection : 'row', marginTop : 15, borderTopWidth : 2, borderTopColor : '#ededed', paddingTop : 15}}>

                                    <TouchableOpacity onPress={()=> {this.addWantType(1)}}
                                        style={{width : 100, height : 20 , borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>온라인</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=> {this.addWantType(2)}}
                                    style={{width : 100, height : 20 ,marginLeft : 25, borderRadius : 5, backgroundColor : '#fff', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#b2f"}}>오프라인</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        )}
                        

                        

                        {this.state.hadTalentDone && this.state.wantTalentDone && this.state.wantTypeDone  === false && this.state.wantType === 2  && (
                            <View >
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>오프라인 수업 위치</Text>


                                    <View style={{flexDirection : 'row' , width : '100%', marginTop : 15, alignItems : 'flex-end',borderTopWidth : 2, borderTopColor : '#ededed',}}>
                                        <View style={{width : '70%', marginTop : 5}}>
                                            <TextInput
                                                placeholder={'원하시는 수업 위치를 입력해주세요.'}
                                                placeholderTextColor={'#8c8c8c'}
                                                onSubmitEditing={Keyboard.dismiss}
                                                style={{height: 40, width: '100%',borderRadius : 5, borderColor: '#fff', borderWidth: 1}}
                                                onChangeText={(wantLoc) => this.setState({wantLoc})}
                                                value={this.state.wantLoc}
                                            />
                                        </View>
                                    </View>




                                    {this.state.wantLoc !== "" && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity onPress={()=> {this.addWantTypeDone()}}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                

                                </View>
                            </View>
                        )}
                        

                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && (
                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>희망하는 수업 방식</Text>

                                    <View style={{marginTop : 15}}>
                                        <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.state.wantType === 1 ? '온라인' : '오프라인'}</Text>
                                    </View>


                            </View>
                        )}


                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone === false  && (

                            <View >
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>재능교환 상대에게 전할 자기소개를 해주세요 :)</Text>


                                    <View style={{flexDirection : 'row' , width : '100%', marginTop : 15,borderTopWidth : 2, borderTopColor : '#ededed'}}>
                                        <View style={{width : '70%', marginTop : 5, }}>
                                            
                                            <TextInput
                                                placeholder={'자기소개를 입력해주세요'}
                                                multiline={true}
                                                numberOfLines={5}
                                                placeholderTextColor={'#8c8c8c'}
                                                onSubmitEditing={Keyboard.dismiss}
                                                style={{height: 120, width: '100%',borderRadius : 5, borderBottomColor: '#ededed', borderBottomWidth: 2}}
                                                onChangeText={(myInfo) => this.setState({myInfo})}
                                                value={this.state.myInfo}
                                            />
                                        </View>
                                    </View>




                                    {this.state.myInfo !== "" && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity onPress={()=> {this.addMyinfoDone()}}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                

                                </View>
                            </View> 
                        )}
                        


                        
                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                        this.state.wantTypeDone && this.state.myInfoDone   && (

                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>재능교환 상대에게 전할 자기소개</Text>

                                <View style={{marginTop : 15}}>
                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.state.myInfo}</Text>
                                </View>

                            </View>

                        )}


                        
                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                        this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone === false   && (

                            <View>
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>자신의 재능을 잘 나타낼 수 있는 사진을 올려주세요 :) </Text>

                                    <View style={{marginTop : 20, alignSelf : 'flex-end', alignItems : 'flex-end',borderTopWidth : 2, borderTopColor : '#ededed', flexDirection :'row'}}>

                                        {this.state.myInfoImageTemp1 !== '' && this.state.myInfoImageTemp2 !== '' && (
                                             <TouchableOpacity onPress={()=> {this.selectMyInfoImage(3)}}
                                             style={{width : 100, height : 100, marginTop : 20 , borderRadius : 5, backgroundColor : '#ededed', alignItems : 'center', justifyContent : 'center'}}>
                                                 {this.state.myInfoImageTemp3 === '' && (
                                                     <Text  style={{fontSize : 22, fontFamily: 'NanumSquareB', color : "#000"}}>+</Text>
                                                 )}
     
                                                 {this.state.myInfoImageTemp3 !== '' && (
                                                    <View> 
                                                        <Image
                                                            resizeMode='stretch'
                                                            style={{width : 100, height : 100, borderRadius : 5}}
                                                            source={{uri: this.state.myInfoImageTemp3}}
                                                        
                                                        />
                                                    </View>
                                                 )}
                                                 
                                             </TouchableOpacity>
                                        )}

                                        {this.state.myInfoImageTemp1 !== '' && ( 
                                            <TouchableOpacity onPress={()=> {this.selectMyInfoImage(2)}}
                                            style={{width : 100, marginLeft : 15, height : 100, marginTop : 20 , borderRadius : 5, backgroundColor : '#ededed', alignItems : 'center', justifyContent : 'center'}}>
                                                {this.state.myInfoImageTemp2 === '' && (
                                                    <Text  style={{fontSize : 22, fontFamily: 'NanumSquareB', color : "#000"}}>+</Text>
                                                )}
    
                                                {this.state.myInfoImageTemp2 !== '' && (
                                                    <View>
                                                        <Image
                                                            resizeMode='stretch'
                                                            style={{width : 100, height : 100, borderRadius : 5}}
                                                            source={{uri: this.state.myInfoImageTemp2}}
                                                        
                                                        />
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity onPress={()=> {this.selectMyInfoImage(1)}}
                                        style={{width : 100,marginLeft : 15,height : 100, marginTop : 20 , borderRadius : 5, backgroundColor : '#ededed', alignItems : 'center', justifyContent : 'center'}}>
                                            {this.state.myInfoImageTemp1 === '' && (
                                                <Text  style={{fontSize : 22, fontFamily: 'NanumSquareB', color : "#000"}}>+</Text>
                                            )}


                                            {this.state.myInfoImageTemp1 !== '' && (
                                                <Image
                                                    resizeMode='stretch'
                                                    style={{width : 100, height : 100, borderRadius : 5}}
                                                    source={{uri: this.state.myInfoImageTemp1}}
                                                    
                                                />
                                            )}
                                        </TouchableOpacity>


                                    </View>


                                    
                                    {this.state.myInfoImageTemp1 !== '' && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity onPress={()=> {this.doneMyinfoImage()}}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                </View>
                            </View>

                        )}


                        

                        
                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone  && (

                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>자신의 재능을 잘 나타낼 수 있는 사진</Text>

                                <View style={{marginTop : 20, alignSelf : 'flex-end', alignItems : 'flex-end',borderTopWidth : 2, borderTopColor : '#ededed', flexDirection :'row'}}>

                                        {this.state.myInfoImageTemp3 !== '' && (
                                             <View 
                                             style={{width : 100, height : 100, marginTop : 20 , borderRadius : 5, backgroundColor : '#ededed', alignItems : 'center', justifyContent : 'center'}}>
                                                 
     
                                                 {this.state.myInfoImageTemp3 !== '' && (
                                                    <View> 
                                                        <Image
                                                            resizeMode='stretch'
                                                            style={{width : 100, height : 100, borderRadius : 5}}
                                                            source={{uri: this.state.myInfoImageTemp3}}
                                                        
                                                        />
                                                    </View>
                                                 )}
                                                 
                                             </View>
                                        )}

                                        {this.state.myInfoImageTemp2 !== '' && ( 
                                            <View 
                                            style={{width : 100, marginLeft : 15, height : 100, marginTop : 20 , borderRadius : 5, backgroundColor : '#ededed', alignItems : 'center', justifyContent : 'center'}}>
                                               
    
                                                {this.state.myInfoImageTemp2 !== '' && (
                                                    <View>
                                                        <Image
                                                            resizeMode='stretch'
                                                            style={{width : 100, height : 100, borderRadius : 5}}
                                                            source={{uri: this.state.myInfoImageTemp2}}
                                                        
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        <View
                                        style={{width : 100,marginLeft : 15,height : 100, marginTop : 20 , borderRadius : 5, backgroundColor : '#ededed', alignItems : 'center', justifyContent : 'center'}}>
                                            

                                            {this.state.myInfoImageTemp1 !== '' && (
                                                <Image
                                                    resizeMode='stretch'
                                                    style={{width : 100, height : 100, borderRadius : 5}}
                                                    source={{uri: this.state.myInfoImageTemp1}}
                                                    
                                                />
                                            )}
                                        </View>


                                    </View>


                            </View>
                            
                        )}


                        
                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                            this.state.wantTalentWhyDone === false && (
                                <View >
                                    <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>
        
                                        <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>해당 재능을 배우고 싶은 이유는 무엇인가요?</Text>
        
        
                                        <View style={{flexDirection : 'row' , width : '100%', marginTop : 15,borderTopWidth : 2, borderTopColor : '#ededed'}}>
                                            <View style={{width : '70%', marginTop : 5, }}>
                                                <TextInput
                                                    placeholder={'배우고 싶은 이유는?'}
                                                    multiline={true}
                                                    numberOfLines={5}
                                                    placeholderTextColor={'#8c8c8c'}
                                                    onSubmitEditing={Keyboard.dismiss}
                                                    style={{height: 120, width: '100%',borderRadius : 5, borderBottomColor: '#ededed', borderBottomWidth: 2}}
                                                    onChangeText={(wantTalentWhy) => this.setState({wantTalentWhy})}
                                                    value={this.state.wantTalentWhy}
                                                />
                                            </View>
                                        </View>
        
        
        
        
                                        {this.state.wantTalentWhy !== '' && (
                                             <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                                <TouchableOpacity onPress={()=> {this.doneWhyWant()}}
                                                style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    
        
                                    </View>
                                </View>
                        )}

                        


                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                            this.state.wantTalentWhyDone && (

                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>해당 재능을 배우고 싶은 이유</Text>

                                <View style={{marginTop : 15}}>
                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.state.wantTalentWhy}</Text>
                                </View>

                            </View>

                        )}

                       


                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                            this.state.wantTalentWhyDone && this.state.howWantTalentDone === false && (

                            <View >
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>어떤 재능교환 상대를 원하시나요?</Text>


                                    <View style={{flexDirection : 'row' , width : '100%', marginTop : 15,borderTopWidth : 2, borderTopColor : '#ededed'}}>
                                        <View style={{width : '70%', marginTop : 5, }}>
                                            <TextInput
                                                placeholder={'원하는 상대방 스타일?'}

                                                multiline={true}
                                                numberOfLines={5}
                                                placeholderTextColor={'#8c8c8c'}
                                                onSubmitEditing={Keyboard.dismiss}
                                                style={{height: 120, width: '100%',borderRadius : 5, borderBottomColor: '#ededed', borderBottomWidth: 2}}
                                                onChangeText={(howWantTalent) => this.setState({howWantTalent})}
                                                value={this.state.howWantTalent}
                                            />
                                        </View>
                                    </View>




                                    {this.state.howWantTalent !== '' && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity onPress={() => {this.donehowWantTalent()}}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                

                                </View>
                            </View>

                        )}


                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                            this.state.wantTalentWhyDone && this.state.howWantTalentDone  && (

                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>어떤 재능교환 상대를 원하시나요</Text>

                                <View style={{marginTop : 15}}>
                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.state.howWantTalent}</Text>
                                </View>

                            </View>
                            
                        )}


                        
                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                            this.state.wantTalentWhyDone && this.state.howWantTalentDone && this.state.myInfoExperienceDone === false  && (

                            <View >
                                <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                    <Text style={{maxWidth : '75%',lineHeight : 25, fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>재능과 관련된 자신의 경험 또는 자격사항을 알려주세요 :)</Text>


                                    <View style={{flexDirection : 'row' , width : '100%', marginTop : 15,borderTopWidth : 2, borderTopColor : '#ededed'}}>
                                        <View style={{width : '70%', marginTop : 5, }}>
                                            <TextInput
                                                placeholder={'경험 및 자격사항을 입력해주세요.'}

                                                multiline={true}
                                                numberOfLines={5}
                                                placeholderTextColor={'#8c8c8c'}
                                                onSubmitEditing={Keyboard.dismiss}
                                                style={{height: 120, width: '100%',borderRadius : 5, borderBottomColor: '#ededed', borderBottomWidth: 2}}
                                                onChangeText={(myInfoExperience) => this.setState({myInfoExperience})}
                                                value={this.state.myInfoExperience}
                                            />
                                        </View>
                                    </View>




                                    {this.state.myInfoExperience !== '' && (
                                        <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                            <TouchableOpacity onPress={()=> {this.doneMyInfoExperience()}}
                                            style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>입력 완료</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                

                                </View>
                            </View>

                        )}


                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                            this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                            this.state.wantTalentWhyDone && this.state.howWantTalentDone  && this.state.myInfoExperienceDone  && (

                            <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>

                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#000"}}>재능과 관련된 자신의 경험 또는 자격사항</Text>

                                <View style={{marginTop : 15}}>
                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareB', color : "#b2f"}}>{this.state.myInfoExperience}</Text>
                                </View>

                            </View>
                            
                        )}


                        {this.state.hadTalentDone && this.state.wantTalentDone && 
                                this.state.wantTypeDone && this.state.myInfoDone && this.state.myInfoImageDone &&  
                                this.state.wantTalentWhyDone && this.state.howWantTalentDone && this.state.howWantTalentDone && this.state.myInfoExperienceDone  && (
                                <View>
                                    <View style={{padding: 15, borderRadius : 10, backgroundColor : '#fff', marginTop : 20 , alignSelf: 'flex-end'}}>


                                       {this.state.myInfoExperienceDone !== '' && (
                                            <View style={{ marginTop : 5, height : 35, alignSelf : 'flex-end',  marginTop : 15}}>
                                                <TouchableOpacity onPress={()=> {this.addTalent()}}
                                                    style={{width : 80, height : 35, backgroundColor : 'blue', alignItems : 'center',borderRadius : 10, justifyContent :'center'}}>
                                                    <Text  style={{fontSize : 14, fontFamily: 'NanumSquareEB', color : "#fff"}}>등록 완료</Text>
                                                </TouchableOpacity>
                                            </View>
                                       )}

                                    </View>
                                </View>
                        )}


                        {this.state.talentDone && (
                           <View style={{padding: 15,marginTop : 30,  borderRadius : 15, borderTopLeftRadius : 0, backgroundColor : '#b2f', alignSelf: 'flex-start'}}>
                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#fff"}}>등록중입니다...</Text>
                            </View>
                        )}


                        {this.state.talentRequestDone && (
                           <View style={{padding: 15,  marginTop : 30, borderRadius : 15, borderTopLeftRadius : 0, backgroundColor : '#b2f', alignSelf: 'flex-start'}}>
                                <Text style={{fontSize : 15, fontFamily: 'NanumSquareB', color : "#fff"}}>재능이 정상적으로 등록되었습니다.</Text>
                            </View>
                        )}






                        


                        
                    </View>
                )}





            

        </ScrollView>
        </KeyboardAvoidingView> 

    
         
        {this.state.WantT_Category_Popup && (
            <View style={{position: 'absolute', top: 0, left: 0, width : '100%', height : '100%', backgroundColor: 'rgba(0,0,0, 0.8)', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width : '85%', height : '80%', backgroundColor  : '#fff'}}>
                    <View style={{width : '100%', height : '10%' , backgroundColor : '#b2f',  justifyContent: 'center', alignItems: 'center', flexDirection :'row'}}>
                        <View style={{width : '33%'}}>
                            {this.state.WantT_Category_Step && (
                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepInit()}}>
                                    <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff", paddingLeft : 15}}>←</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={{width : '33%', alignItems :'center', justifyContent : 'center'}}>
                            <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>카테고리 선택</Text>
                        </View>

                        <TouchableOpacity onPress={()=> {this.setState({WantT_Category_Popup : false})}}
                        style={{width : '33%', alignItems : 'flex-end', paddingRight : 15}}>
                            <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>X</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.WantT_Category_Step === false && (
                        <View style={{width : '100%', height:'80%', marginTop : 20, justifyContent : 'center'}}>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center'}}>
                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(1)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>언어</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(2)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>디자인</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(3)}} 
                                style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>코딩</Text>
                                </TouchableOpacity>
                            </View>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>
                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(4)}} 
                                    style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>음악</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(5)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>춤</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(6)}} 
                                style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>요리</Text>
                                </TouchableOpacity>
                            </View>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>
                            <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(7)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>뷰티</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(8)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>운동</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(9)}} 
                                style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>애견</Text>
                                </TouchableOpacity>
                            </View>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>
                                <TouchableOpacity onPress={()=> {this.WantTCategoryStepSelect(10)}} 
                                style={{width : '25%', height : 40,backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>지식</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    )}


                    {this.state.WantT_Category_Step === true && (
                        <View style={{width : '100%', height:'80%', marginTop : 20,alignItems : 'center', justifyContent : 'center'}}>

                            <View  style={{width : '90%',  alignItems : 'center', flexDirection :'row', justifyContent : 'center', flexWrap: 'wrap'}}>

                                

                                {this.state.WantT_Category_OneList.map((content,i)=> {
                                    return (
                                        <TouchableOpacity key={i}
                                        onPress={()=> {this.selectDetailCategory(content.index)}} 
                                        style={{padding : 15,marginBottom : 30, marginLeft : 5, marginRight: 5, backgroundColor : '#ededed', borderRadius : 20,  justifyContent: 'center', alignItems: 'center'}}>
                                            <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>{content.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}

                            

                            </View>


                        </View>
                    )}

                    




                </View>
            </View>
        )}


        {this.state.HadT_Category_Popup && (
            <View style={{position: 'absolute', top: 0, left: 0, width : '100%', height : '100%', backgroundColor: 'rgba(0,0,0, 0.8)', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width : '85%', height : '80%', backgroundColor  : '#fff'}}>
                    <View style={{width : '100%', height : '10%' , backgroundColor : '#b2f',  justifyContent: 'center', alignItems: 'center', flexDirection :'row'}}>
                        <View style={{width : '33%'}}>
                            {this.state.HadT_Category_Step && (
                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepInit()}}>
                                    <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff", paddingLeft : 15}}>←</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={{width : '33%', alignItems :'center', justifyContent : 'center'}}>
                            <Text  style={{fontSize : 18, fontFamily: 'NanumSquareEB', color : "#fff"}}>카테고리 선택</Text>
                        </View>

                        <TouchableOpacity onPress={()=> {this.setState({HadT_Category_Popup : false})}}
                            style={{width : '33%', alignItems : 'flex-end', paddingRight : 15}}>
                            <Text  style={{fontSize : 20, fontFamily: 'NanumSquareEB', color : "#fff"}}>X</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.HadT_Category_Step === false && (
                        <View style={{width : '100%', height:'80%', marginTop : 20, justifyContent : 'center'}}>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center'}}>
                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(1)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>언어</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(2)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>디자인</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(3)}} 
                                style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>코딩</Text>
                                </TouchableOpacity>
                            </View>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>
                            <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(4)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>음악</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(5)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>춤</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(6)}} 
                                style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>요리</Text>
                                </TouchableOpacity>
                            </View>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>
                            <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(7)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>뷰티</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(8)}} 
                                style={{width : '25%', height : 40, marginRight : 25, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>운동</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(9)}} 
                                style={{width : '25%', height : 40, backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 18, fontFamily: 'NanumSquareB', color : "#000"}}>애견</Text>
                                </TouchableOpacity>
                            </View>

                            <View  style={{width : '100%', height : 40, flexDirection :'row', justifyContent : 'center', marginTop : 25}}>
                                <TouchableOpacity onPress={()=> {this.HadTCategoryStepSelect(10)}} 
                                style={{width : '25%', height : 40,backgroundColor : '#ededed', borderRadius : 100,  justifyContent: 'center', alignItems: 'center'}}>
                                    <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>지식</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    )}


                    {this.state.HadT_Category_Step === true && (
                        <View style={{width : '100%', height:'80%', marginTop : 20,alignItems : 'center', justifyContent : 'center'}}>

                            <View  style={{width : '90%',  alignItems : 'center', flexDirection :'row', justifyContent : 'center', flexWrap: 'wrap'}}>

                                

                                {this.state.HadT_Category_OneList.map((content,i)=> {
                                    return (
                                        <TouchableOpacity key={i}
                                        onPress={()=> {this.selectHadDetailCategory(content.index)}} 
                                        style={{padding : 15,marginBottom : 30, marginLeft : 5, marginRight: 5, backgroundColor : '#ededed', borderRadius : 20,  justifyContent: 'center', alignItems: 'center'}}>
                                            <Text  style={{fontSize : 16, fontFamily: 'NanumSquareB', color : "#000"}}>{content.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}

                            

                            </View>


                        </View>
                    )}

                    




                </View>
            </View>
        )}

        
       
      </View> 
    )}
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
    position : 'relative'
  },



});
