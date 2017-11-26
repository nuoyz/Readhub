import React from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Keyboard, ListView, Image,
  TouchableOpacity, TouchableHighlight, Button, NativeModules, ActivityIndicator,
  RefreshControl, InteractionManager, LayoutAnimation, Platform, StatusBar,
  FlatList
} from 'react-native';

import axios from 'axios'
import moment from 'moment'

import TopicItem from './topicItem';

let loadErrorCount=0;

export default function topicItemComponent(params) {
  return class WrapperComponent extends React.Component {
    static navigationOptions = {tabBarLabel: params.tabBarLabel};  
    constructor(props) {
      super(props);
      this.state = { dataList: [], refreshing: false };
    }
    componentDidMount() {
      this.getTopticItem();
      const ShowBrowserListeners = global.rdEvent.listeners('ShowBrowser');
      if (!ShowBrowserListeners[0]) {
        global.rdEvent.on('ShowBrowser', (data) => {
          this.props.navigation.navigate('Browser', data)
        })
      }
    }
    getTopticItem() {
      this.setState({ refreshing: true })
      axios.get(params.topic_api)
        .then((response) => {
          this.setState({ dataList: response.data.data, refreshing: false })
          loadErrorCount=false
        }).catch((error) => {
          console.log(error);
          this.setState({ refreshing: false })
      });
    }
    handleLoadMore() {
      const {loading, dataList} = this.state;
      if (loading || dataList.length || loadErrorCount > 5) return;
      this.setState({ loading: true });
      const cursor = moment(this.state.dataList[this.state.dataList.length - 1].publishDate).unix()*1000;
      axios.get(params.topic_api, { params: { lastCursor: cursor } })
       .then((response) => {
         console.log(response);
         this.setState({ dataList: [...this.state.dataList, ...response.data.data], loading: false })
         loadErrorCount=0;
       }).catch((error) => {
         console.log(error);
         loadErrorCount++;
         this.setState({ loading: false })
       });
    }
    handlePress(item, index) {
      const {clickedItemIndex} = this.state;
      if ((clickedItemIndex || clickedItemIndex === 0) && clickedItemIndex === index) {
        return;
      }
      let url = '';
      if (item.newsArray) {
        if (item.newsArray[0]) {
          url = item.newsArray[0].url;
        } else {
          const url = item.newsArray.url;
        }
      } else if (item.url) {
        url = item.url
      }
      global.rdEvent.emit('ShowBrowser', { url: url, title: item.title});
      this.setState({clickedItemIndex: index});
      setTimeout(() => this.setState({clickedItemIndex: ''}), 3000);
    }

    renderTopicItem = ({ item, index }) => {
      return (
        <TopicItem
          index={index}
          title={item.title}
          summary={item.summary}
          publishDate={item.publishDate}
          handlePress={() => this.handlePress(item, index)}
        />
     )
    }
    
    renderFooter = () => {
      if (!this.state.loading) return null;
        return (
          <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animating={this.state.loading} />
          </View>
        );
    }
  
    render() {
      const {dataList, refreshing, loading} = this.state;
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={dataList}
            renderItem={this.renderTopicItem}
            keyExtractor={(item, index) => item.id}
            onEndReached={() => this.handleLoadMore()}
            refreshing={refreshing}
            onRefresh={() => this.getTopticItem()}
            ListFooterComponent={this.renderFooter}
            extraData={loading}
          />
        </View>
      );
    }
  }
}