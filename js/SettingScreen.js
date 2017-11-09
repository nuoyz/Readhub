import React from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableHighlight,
    AsyncStorage
} from 'react-native';

import { styles as themeStyles } from 'react-native-theme';
import bus from './bus'

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    title: '设置',
    headerTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
    headerBackTitleStyle: { ...StyleSheet.flatten(themeStyles.headerTitleStyle) },
    headerStyle: { backgroundColor: '#ffffff', borderBottomColor: "transparent", shadowColor: 'transparent', elevation: 0, ...StyleSheet.flatten(themeStyles.headerStyle) },
  };
    render() {
        return (
          <View style={[{ backgroundColor: '#f5f5f5', height: '100%' }]}>
            <View style={{paddingLeft: 20}}>
                <Text style={{fontSize: 15, marginTop:  12}} >问题反馈</Text>
                <Text ellipsizeMode="tail" numberOfLines={1} style={{ flexShrink: 1, fontSize: 14, marginTop: 10 }}>邮箱: 1670145451@qq.com</Text>
                <Text style={{fontSize: 15, marginTop: 50}}>Readhub客户端</Text>
                <Text style={{fontSize: 15, marginTop: 10}}>如有侵权 请联系删除</Text>
            </View>
          </View>
        );
    }
}