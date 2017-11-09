import React, { Component } from 'react';


import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';

import axios from 'axios'
import bus from './bus.js'

import * as Progress from 'react-native-progress';
import SafariView from 'react-native-safari-view';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import { StyleSheet, Text, View, TouchableHighlight, Button, ActivityIndicator,
  WebView, Clipboard
} from 'react-native';

import theme from 'react-native-theme'

const DEFAULT_URL = `https://www.moon.fm`;
const WEBVIEW_REF = 'webview';

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
        headerRight: (<View style={{
          backgroundColor: 'transparent',
          paddingRight: 20,
          paddingLeft: 20,
          height: '100%',
          justifyContent: 'center'
        }}>

          <Icon2 name="ios-more" style={{color: '#3333'}} size={24} />
        </View>)
      })
    }

  };


  renderTouchable = () => (<TouchableHighlight style={{ backgroundColor: 'blue' }} />);

  menu = () => (
    <Menu style={{shadowOpacity:.05}}>
      <MenuTrigger customStyles={{color: 'black'}} >
        <Icon2 name="ios-more" size={32} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: '#ffffff',
            padding: 2,
            shadowOpacity: 0.08,
            borderWidth: 1,
            borderColor: '#eaeaea',
            marginTop: 10,
            marginLeft: -10,
            elevation: 0
          },
          optionWrapper: {
            margin: 5,
          },
          optionTouchable: {
            underlayColor: 'gold',
            activeOpacity: 70,
          },
          optionText: {
            color: 'brown',
          },
        }}
      >
        <MenuOption
          value={1}
          customStyles={{
            optionTouchable: {
              activeOpacity: 40,
            },
            optionWrapper: {
               margin: 5,
            },
            optionText: {
              color: 'black',
            }
          }}
          onSelect={() => this.reloadThePage()}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon2 name="ios-refresh" size={26} style={{ marginLeft: 10, marginRight: 10 }} />
            <Text>Reload</Text>
          </View>
        </MenuOption>
        <MenuOption
          value={2}
          customStyles={{
            optionTouchable: {
              activeOpacity: 40,
            },
            optionWrapper: {
              margin: 5,
            },
            optionText: {
              color: 'black',
            }
          }}
          onSelect={() => this.copyURLToClipboard()}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon2 name="ios-copy-outline" size={24} style={{ marginLeft: 10, marginRight: 10 }} />
            <Text>Copy URL</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );


  copyURLToClipboard() {
    Clipboard.setString(this.state.url);
  }

  reloadThePage() {
    WEBVIEW_REF.reload();
  }

  onShouldStartLoadWithRequest = (event) => {
    return true;
  };

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
    return (<WebView
      ref={(b) => WEBVIEW_REF = b}
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
    />)

  }


  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#66cdaa' }}>
        <View
          style={{
            width: '100%', borderBottomColor: '#f0f0f0', borderBottomWidth: 1,
            backgroundColor: '#66cdaa', flexDirection: 'row', alignItems: 'center',
            paddingTop: 0, paddingBottom: 10
          }}
        >
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{ marginLeft: 50, marginRight: 15, color: '#ffffff', flex: 1, textAlign: 'center' }}
          >
            {this.state.url}
          </Text>
          <ActivityIndicator animating={this.state.loading} style={{ marginRight: 20 }} />
        </View>
        {this.renderWebView()}
      </View>
    );
  }
}



const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
    textAlign: 'center'
  },
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
        console.log('oooo');
        bus.emit('ShowBrowser', { url: url, title: title });
      });
  }
}


