import React, {Component} from 'react';

import { Text, View,Image } from 'react-native';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from "react-navigation"
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from "../screen/HomeScreen";
import DetailsScreen from "../screen/DetailsScreen";

import TalentChangeDetailScreen from "../screen/TalentChangeDetailScreen";
import TalentTipDetailScreen from "../screen/TalentTipDetailScreen";

import MessageListScreen from "../screen/MessageListScreen";
import MessageDetailScreen from "../screen/MessageDetailScreen";

import LoginScreen from "../screen/LoginScreen";
import SignupScreen from "../screen/SignupScreen";

import PhoneAuth from "../screen/PhoneAuth";



import CategoryScreen from "../screen/CategoryScreen";

import TalentChangeRequestScreen from "../screen/TalentChangeRequestScreen";
import TalentChangeGetRequestDetailScreen from "../screen/TalentChangeGetRequestDetailScreen";
import TalentChangeInitScreen from "../screen/TalentChangeInitScreen";
import TalentChangeInitMainScreen from "../screen/TalentChangeInitMainScreen";



import BuyTicketScreen from "../screen/BuyTicketScreen";
import BuyListTicketScreen from "../screen/BuyListTicketScreen";
import BuyTicketDetailScreen from "../screen/BuyTicketDetailScreen";
import BuyTicketDoneScreen from "../screen/BuyTicketDoneScreen";

import MyPageScreen from "../screen/MyPageScreen";
import MyPageTalentRequestListScreen from "../screen/MyPageTalentRequestListScreen";
import MyPageTalentGetRequestListScreen from "../screen/MyPageTalentGetRequestListScreen";
import MyPageTalentListScreen from "../screen/MyPageTalentListScreen";
import CardPayImp from "../components/CardPayImp";


import SearchScreen from "../screen/SearchScreen";
import SearchDetailScreen from "../screen/SearchDetailScreen";
import SearchResultScreen from "../screen/SearchResultScreen";


import AlertScreen from "../screen/AlertScreen";
import RcmScreen from "../screen/RcmScreen";
import SplashScreen from "../screen/SplashScreen";



import PasswordFind from "../screen/PasswordFind"
import PasswordFindDetail from "../screen/PasswordFindDetail"


import TalentChangeRequestScreenMain from "../screen/TalentChangeRequestScreen"
import RequestEventScreen from "../screen/RequestEventScreen"
import BacooReview from "../screen/BacooReview"







const AppNavigator = createStackNavigator({
    Home : HomeScreen,
    TalentChangeDetailScreen : TalentChangeDetailScreen,
    TalentChangeRequestScreen : TalentChangeRequestScreen,
    TalentTipDetailScreen : TalentTipDetailScreen,
    TalentChangeRequestScreenMain : TalentChangeRequestScreenMain,
    LoginScreen : LoginScreen,
    SignupScreen : SignupScreen,
    PasswordFind : PasswordFind,
    PasswordFindDetail : PasswordFindDetail,
    SplashScreen: SplashScreen,
    PhoneAuth : PhoneAuth,
    RequestEventScreen : RequestEventScreen,
    BacooReview : BacooReview
},
{
  headerLayoutPreset: 'center' 
});

// This does the trick
AppNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "TalentChangeDetailScreen" || route.routeName === "TalentTipDetailScreen"   
        || route.routeName === "TalentChangeRequestScreen" || route.routeName === "LoginScreen" || route.routeName === "SignupScreen"
        || route.routeName === "TalentChangeGetRequestDetailScreen" || route.routeName === "TalentChangeInitScreen" 
        || route.routeName === "BuyTicketScreen" || route.routeName === "RequestEventScreen" || route.routeName === "SplashScreen" || route.routeName === "PhoneAuth" || route.routeName === "TalentChangeRequestScreenMain"  
        || route.routeName === "PasswordFind" || route.routeName === "PasswordFindDetail" || route.routeName === "BacooReview") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};



const SearchNavigator = createStackNavigator({
  SearchScreen : SearchScreen,
  CategoryScreen : CategoryScreen,
  SearchDetailScreen : SearchDetailScreen,
  SearchResultScreen : SearchResultScreen,
  TalentChangeDetailSearch : TalentChangeDetailScreen,
  TalentChangeRequestSearch : TalentChangeRequestScreen

},

{
  headerLayoutPreset: 'center' 
});


// This does the trick
SearchNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "CategoryScreen" || route.routeName === "SearchDetailScreen"  || route.routeName === "TalentChangeRequestSearch" 
                                               || route.routeName === "SearchResultScreen" ||route.routeName === "TalentChangeDetailSearch"   ) {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};




const AlertNavigator = createStackNavigator({
  AlertScreen : AlertScreen,
  RcmScreen: RcmScreen,
  
    TalentChangeDetailScreenRcm : TalentChangeDetailScreen,
},
{
  headerLayoutPreset: 'center' 
});



// This does the trick
AlertNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "RcmScreen" || route.routeName === "TalentChangeDetailScreenRcm") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};





const MyPageNavigator = createStackNavigator({
  MyPageScreen : MyPageScreen,
  BuyTicketScreen : BuyTicketScreen,
  BuyTicketDetailScreen : BuyTicketDetailScreen,
  BuyListTicketScreen : BuyListTicketScreen,
  BuyTicketDoneScreen : BuyTicketDoneScreen,
  MyPageTalentRequestListScreen : MyPageTalentRequestListScreen,
  MyPageTalentGetRequestListScreen : MyPageTalentGetRequestListScreen,
  MyPageTalentListScreen : MyPageTalentListScreen,
  
  TalentChangeGetRequestDetailScreen : TalentChangeGetRequestDetailScreen,

  CardPayImp : CardPayImp,
  MessageListScreen : MessageListScreen,
  MessageDetailScreen : MessageDetailScreen

},
{
  headerLayoutPreset: 'center' 
});


MyPageNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "BuyTicketScreen" ||  route.routeName === "BuyListTicketScreen" ||  route.routeName === "MyPageTalentListScreen" 
      ||  route.routeName === "MyPageTalentRequestListScreen" ||  route.routeName === "MyPageTalentGetRequestListScreen"
      ||  route.routeName === "TalentChangeGetRequestDetailScreen" ||  route.routeName === "MessageListScreen"|  route.routeName === "MessageDetailScreen" || route.routeName === "BuyTicketDetailScreen" || route.routeName === "CardPayImp" ) {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};





const TalentChangeInit = createStackNavigator({
    // 일단 임시로 이곳에 넣음.. 추후 바꾸셈
    TalentChangeInitMainScreen : TalentChangeInitMainScreen,

    TalentChangeInitScreen : TalentChangeInitScreen,
    

    
},
{
  headerLayoutPreset: 'center' 
})



TalentChangeInit.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "TalentChangeInitScreen" ) {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible
  };
};







class IconWithBadge extends React.Component {
    render() {
      const { name, badgeCount, color, size , type} = this.props;
      return (
        <View style={{ width: 50, height: 50, margin: type ? 0 : 5, marginTop : type ? -40 : 0, 
            
            justifyContent: 'center',
            alignItems: 'center',
         }}>
         <Image
              source={ name ? name : ""}
              
              style={{ marginBottom: -3, width: 25, height : 25, zIndex : 1,
                justifyContent: 'center',
                alignItems: 'center'}}
            
            />
            {type && (
                <View
                style={{
                  // /If you're using react-native < 0.57 overflow outside of the parent
                  // will not work on Android, see https://git.io/fhLJ8
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  borderRadius: 100, 
                  borderWidth: 0.5, 
                  borderColor: '#ededed',
                  backgroundColor : '#b2f', 
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
              </View> 
            )}
        
          {badgeCount > 0 && (
            <View
              style={{
                // /If you're using react-native < 0.57 overflow outside of the parent
                // will not work on Android, see https://git.io/fhLJ8
                position: 'absolute',
                right: -6,
                top: -3,
                backgroundColor: 'red',
                borderRadius: 6,
                width: 12,
                height: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {badgeCount}
              </Text>
            </View> 
          )}
        </View>
      );
    }
  }
  
  const HomeIconWithBadge = props => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithBadge {...props} />;
  };

export default createAppContainer(createBottomTabNavigator(
    {
      Home: AppNavigator,
      Search: SearchNavigator,
      TalentChange: TalentChangeInit,
      Alert: AlertNavigator,
      MyPage: MyPageNavigator,
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;
          let type = false;
          if (routeName === 'Home') {
            iconName = `${focused ? require('../assets/home_F.png') : require('../assets/home.png')}`;
            // Sometimes we want to add badges to some icons. 
            // You can check the implementation below.
            IconComponent = HomeIconWithBadge; 
          } else if (routeName === 'Search') {
            iconName = `${focused ? require('../assets/search_F.png') : require('../assets/search.png')}`;
            IconComponent = HomeIconWithBadge; 

          } else if (routeName === 'Alert') {
            iconName = `${focused ? require('../assets/alert_F.png') : require('../assets/alert.png')}`;
            IconComponent = HomeIconWithBadge; 

          } else if (routeName === 'TalentChange') {
            iconName = `${focused ? require('../assets/requestTalent_F.png') : require('../assets/requestTalent.png')}`;
            IconComponent = HomeIconWithBadge; 


          } else if (routeName === 'MyPage') {
              
            iconName = `${focused ? require('../assets/mypage_F.png') : require('../assets/mypage.png')}`;
            IconComponent = HomeIconWithBadge; 

          }
  
          // You can return any component that you like here!
          return <IconComponent name={iconName} size={25} color={tintColor} type ={type} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showLabel: false,
      },
    }
  )
);