import React, { Component } from 'react';


import Icon from 'react-native-vector-icons/Entypo';

import axios from 'axios'

import * as Progress from 'react-native-progress';
import SafariView from 'react-native-safari-view';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import { StyleSheet, Text, View, TouchableHighlight, Button, ActivityIndicator,
  WebView, Clipboard, Modal, Image, TouchableOpacity, AsyncStorage, ToastAndroid,
  Linking
} from 'react-native';

import theme from 'react-native-theme'

const DEFAULT_URL = `https://www.moon.fm`;
const WEBVIEW_REF = 'webview';
const wechat = require('./image/wechat.png');

export class BrowserScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      url: DEFAULT_URL,
      urlToLoad: '',
      pageTitle: '',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
    };
  }


  componentDidMount() {
    this.props.navigation.setParams({ ctx: this })
    this.setState({ urlToLoad: this.props.navigation.state.params.url, pageTitle: this.props.navigation.state.params.title });
  }

  static navigationOptions = ({ navigation }) => {
    if (navigation.state.params && navigation.state.params.ctx) {
      return ({
        title: navigation.state.params.ctx.state.pageTitle,
        headerTintColor: 'black',
        headerStyle: { borderBottomColor: 'transparent', backgroundColor: '#ffffff', elevation: 0, },
        headerRight: navigation.state.params.ctx.menu(),
        headerMode: 'screen',
      })
    } else {
      return ({
        title: 'Loading',
        headerTintColor: 'black',
        headerStyle: { borderBottomColor: 'transparent', backgroundColor: '#66cdaa', elevation: 0, },
        headerMode: 'screen',
        headerRight: (
          <View
            style={{
              backgroundColor: 'transparent',
              paddingRight: 20,
              paddingLeft: 20,
              height: '100%',
              justifyContent: 'center'
            }}
          >
    
          <Icon name="dots-three-vertical" style={{color: '#3333'}} size={22} />
        </View>)
      })
    }

  };


  menu = () => (
    <TouchableOpacity
      onPress={() => {
        this.setState({popUpWindowShow: true});
      }}
    >
      <Icon name="dots-three-vertical" size={22} style={{color: '#333333'}} />
    </TouchableOpacity>
  );

  onNavigationStateChange = (navState) => {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      pageTitle: (navState.title&&navState.title.length > 0 && navState.title != 'about:blank') ? navState.title : this.props.navigation.state.params.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  };

  renderWebView() {
    return (
      <WebView
        ref={WEBVIEW_REF}
        source={{ uri: this.state.urlToLoad, headers: {} }}
        renderLoading={() => {
          return (<View style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Progress.CircleSnail size={30} indeterminate={true} style={{ width: 30, height: 30, backgroundColor: '#00ff00' }} color={['#C0CCDA']} />
          </View>)
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        decelerationRate="normal"
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState={true}
        thirdPartyCookiesEnabled={true}
        mixedContentMode={'always'}
     />
    )
  }
  i1 = () =>  <Image source={require(`./image/wechat.png`)} style={{width: 36, height: 30}}/>
  i2 = () =>  <Image source={require(`./image/cof.png`)} style={{width: 36, height: 38}}/>
  i3 = () =>  <Image source={require(`./image/reload.png`)} style={{width: 36, height: 34}}/>
  i4 = () =>  <Image source={require(`./image/link.png`)} style={{width: 36, height: 34}}/>
  i5 = () =>  <Image source={require(`./image/collection.png`)} style={{width: 36, height: 30}}/>
  i6 = () =>  <Image source={require(`./image/browser.png`)} style={{width: 36, height: 36}}/>
  i7 = () =>  <Image source={require(`./image/complaint.png`)} style={{width: 36, height: 32}}/>

  toastAndroidShow = (string, durduration, gravity) => {
    ToastAndroid.show(string, ToastAndroid[durduration], ToastAndroid[gravity])
  }

  copyUrlLink = () =>  {
    const { url } = this.state;
    Clipboard.setString(url);
    this.toastAndroidShow(url, 'SHORT', 'CENTER');     
  };
  
  reload = () => this.refs[WEBVIEW_REF].reload();

  /*collectNews = () => { //收藏功能暂时取消
    const collectNews = AsyncStorage.getItem('collectNews', (err, res) => {
      if (err) {
        this.toastAndroidShow('网页不能收藏, 请重试', 'SHORT', 'CENTER');
      }
      if (res) {
        this.toastAndroidShow('收藏成功, 请重试', 'SHORT', 'CENTER');
      }
    });
    console.log('collectNews', collectNews);
    AsyncStorage.setItem(collectNews, collectNews.push(this.state.url), (err, result) => {
      this.toastAndroidShow(result | err, 'SHORT', 'CENTER');
    });
  }*/

  openInBrowser = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
         this.toastAndroidShow('该链接不能被处理', 'SHORT', 'CENTER');
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => this.toastAndroidShow(err, 'SHORT', 'CENTER'));
  }

  onPressButton = () => this.setState({popUpWindowShow: false});

  renderChildrn = (props) => {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
        <TouchableOpacity onPress={() => props.pressEvent()}>
          <View
            style={{
              width: 60, height: 60, backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#f7f7f7', borderStyle: 'solid', borderRadius: 12, justifyContent: 'center', alignItems: 'center'
            }}
          >
            {props.image()}
          </View>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 4,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: 60,
            flexWrap: 'wrap'
          }}
        >
          <Text style={{fontSize: 12, color: '#5e5e5e'}} ellipsizeMode="tail" numberOfLines={2}>
            {props.text}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { goBack } = this.props.navigation;
    const {popUpWindowShow = false, url} = this.state;
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#66cdaa' }}>
        {this.renderWebView()}
        <View>
          <Modal
            animationType="slide"
            onRequestClose={() => {}}
            onShow={this.handleShow}
            transparent
            visible={popUpWindowShow || false}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                }}
            > 
                <View style={{flex: 1, backgroundColor: '#959495', opacity: .4}}>
                  <TouchableOpacity style={{flex: 1, opacity: 1}} onPress={() => {
                    this.setState({popUpWindowShow: false});
                      console.log('onPress onPress');
                    }}
                  >
                    <View style={{flex: 1}}></View>
                  </TouchableOpacity> 
                </View>
               
              <View //modal inner
                style={{
                  alignSelf: 'flex-end',
                  width: "100%",
                  height: 280,
                  backgroundColor: '#e4e4e4'
                }}
              >
                <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                  <Text style={{fontSize: 14, color: '#5e5e5e'}}>由readHub.me提供
                  </Text>
                </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  overflow: 'scroll',
                  width: 140,
                  paddingLeft: 12,
                  marginTop: 20,
                }}
              >
                {this.renderChildrn({pressEvent:() => {}, image: this.i1, text: '微信好友'})}
                {this.renderChildrn({pressEvent:() => {}, image: this.i2, text: '朋友圈'})}
               
              </View>
              <View
                style={{
                  borderColor: '#b4b4b4', borderBottomWidth: 1, marginTop: 30, marginBottom: 15, alignSelf: 'center', width: 336
                }}
              ></View>
                <View //{this.renderChildrn({pressEvent: this.collectNews, image: this.i5, text: '收藏'})}
                  style={{
                    flexDirection: 'row',
                    width: 290,
                    justifyContent: 'space-between',
                    paddingLeft: 12,
                    paddingRight: 12
                  }}
                >
                  {this.renderChildrn({pressEvent: this.reload, image: this.i3, text: '刷新'})}
                  {this.renderChildrn({pressEvent: this.copyUrlLink, image: this.i4, text: '复制链接'})}
                  {this.renderChildrn({pressEvent: () => {this.openInBrowser(url)}, image: this.i6, text: '在浏览器中打开'})}
                  {this.renderChildrn({pressEvent:() => {}, image: this.i7, text: '投诉'})}
                </View>  
              </View>
              <View style={{backgroundColor: '#ffffff', width: '100%', height: 45, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <TouchableOpacity onPress={this.onPressButton}>
                   <Text style={{fontSize: 18, color: '#101010'}}>
                      取消
                   </Text>
                 </TouchableOpacity>
              </View>  
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#20A0FF',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 100,
    margin: 10,
  },
});

export default {
  show(url, title, readerMode) {
   SafariView.isAvailable()
      .then(available => {
        SafariView.show({
          url: url,
          readerMode: true,
          ...colors
        });
      })
      .catch(error => {
        console.log('oooo11111', error);
        global.rdEvent.emit('ShowBrowser', { url: url, title: title });
      });
  }
}


