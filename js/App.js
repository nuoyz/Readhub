import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar,} from 'react-native';

import { StackNavigator, TabNavigator, TabBarBottom, NavigationActions } from 'react-navigation';
import Icon3 from 'react-native-vector-icons/Octicons';

import axios from 'axios'
import moment from 'moment'
import 'moment/locale/zh-cn';

import SettingScreen from './SettingScreen'

import topicItemHocComponent from './topicItemComponent';
import cfg from './config';

import { MenuContext } from 'react-native-popup-menu';
import { BrowserScreen } from './browser'
import Themes from './themes'
import { styles as themeStyles } from 'react-native-theme';
import theme from 'react-native-theme'
moment.locale('zh-cn');

let iconClicked = false;
export default class Root extends React.Component {
  componentDidMount() {theme.setRoot(this)}
  render() {
    return (
      <MenuContext
        customStyles={{
          menuContextWrapper: styles.container,
          backdrop: styles.backdrop
        }}
      >
        <View style={[{ borderWidth: 0, borderColor: '#ff0000', height: '100%', width: '100%', paddingTop: 0, paddingBottom: 0 }, themeStyles.headerStyle]}>
          <StatusBar
            barStyle={'light-content'}
          />
          <RootStack />
        </View>
      </MenuContext>
    )
  }
}


const MyApp = TabNavigator({
  Home: {
    screen: topicItemHocComponent({tabBarLabel: '热门话题', topic_api: cfg.TOPIC_API}),
  },
  TechArticles: {
    screen: topicItemHocComponent({tabBarLabel: '科技动态', topic_api: cfg.NEWS_API}),
    },
  DevArticles: {
    screen: topicItemHocComponent({tabBarLabel: '开发者资讯', topic_api: cfg.TECHNEWS_API}),
  },

}, {
    tabBarPosition: 'top',
    tabBarOptions: {
      activeTintColor: '#101010',
      inactiveTintColor: '#333333',
      showIcon: true,
      labelStyle: { marginTop: -20 },
      indicatorStyle: {
        backgroundColor: 'transparent',
      },
      style: {
        height: 45,
        backgroundColor: '#66cdaa'
      },
    }
  });


const RootStack = StackNavigator({
  MainTab: {
    screen: MyApp,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <View
          style={
            [{
              backgroundColor: '#66cdaa', position: 'absolute', left: 33, //#66cdaa
              top: 10, flex: 1, flexDirection: 'row', alignItems: 'center', height: 52
              }
            ]}
          >
          <Text
            numberOfLines={1}
            style={{ color: '#ffffff', fontWeight: '600', fontSize: 25, textAlign: 'left' }}
          >
            Readhub
          </Text>
        </View>),
      headerRight: (
        <TouchableOpacity activeOpacity={.65}
          style={{marginTop: 22, marginRight: 21}}
          onPress={() => {
            if (iconClicked) return;
            iconClicked = false;
            navigation.navigate('Setting')
            setTimeout(() => iconClicked = true, 2000);
          }}
        >
          <View><Icon3 name="three-bars" size={24} style={{color: '#ffffff'}}></Icon3></View>
       </TouchableOpacity>),
      headerStyle: { backgroundColor: '#66cdaa', borderBottomColor: "transparent", shadowColor: 'transparent', elevation: 0 },
      headerTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
      headerBackTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
      headerTintColor: StyleSheet.flatten(themeStyles.headerTitleStyle).color,
    }),
  },
  Setting: {
    screen: SettingScreen,
  },
  Browser: {
    screen: BrowserScreen
  }
}, {
    cardStyle: {
      shadowColor: 'transparent'
    }
  });

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 0,
  },
  backdrop: {
    backgroundColor: '#222222',
    opacity: 0.1,
  },
});


