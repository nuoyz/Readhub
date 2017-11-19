import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Button, ActivityIndicator,
    FlatList
} from 'react-native';


import axios from 'axios'
import Browser from './browser';
import Swipeout from 'react-native-swipeout';
import moment from 'moment'
import { styles as themeStyles } from 'react-native-theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const TOPIC_API = 'https://api.readhub.me/topic';


export default class MyHomeScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: '热门话题'
    };
    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataList: [],
            refreshing: false,
        };
    }

    componentDidMount() {
        this.getTopicItem();
        global.rdEvent.on('ShowBrowser', (data) => {
            this.props.navigation.navigate('Browser', data)
        })
        this.props.navigation.setParams({ isHeaderShow: Math.random() });
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
      console.log('url, item.title', url, item.title);
      Browser.show(url, item.title, true);
      this.setState({clickedItemIndex: index});
      setTimeout(() => this.setState({clickedItemIndex: ''}), 2000);
     }

    getTopicItem() {
      this.setState({ refreshing: true })
      axios.get(TOPIC_API)
        .then((response) => {
          this.setState({ dataList: response.data.data, refreshing: false })
        }).catch((error) => {
          this.setState({ refreshing: false })
      });
    }

    handleLoadMore() {
      const {loadingState, dataList} = this.state;
      if (loadingState || dataList.length == 0) return;
      this.setState({ loadingState: true });
      var cursor = this.state.dataList[this.state.dataList.length - 1].order;
      axios.get(TOPIC_API, { params: { lastCursor: cursor } })
        .then((response) => {
        this.setState({ dataList: [...this.state.dataList, ...response.data.data], loadingState: false })
        }).catch((error) => {
        this.setState({ loadingState: false })
      });
    }
    renderTopicItem = ({ item, index }) => {
      return (
        <TouchableHighlight activeOpacity={.95}
          style={{marginBottom: 8, marginTop: index === 0 ? 8 : 0, opacity: index === 0 ? 1 : 1}}
          onPress={() => {
            this.handlePress(item, index)
          }}
          >
            <View style={[styles.listRow]}>
              <View style={styles.rightContainer}>
                <Text ellipsizeMode="tail" numberOfLines={2} style={[styles.title]}>{item.title}</Text>
                <Text ellipsizeMode="tail" numberOfLines={3} style={{fontSize: 13, color: '#6b6a6b', marginTop: 6, marginBottom: 6}}>{item.summary}</Text>
                <View style={{ height: 5 }}></View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text ellipsizeMode="tail" numberOfLines={3} style={{color: '#808080', fontSize: 12, width: 80}}>{moment(item.publishDate).fromNow()}</Text>
                  <Icon name="thumbs-o-up" size={16} style={{color: '#808080', marginRight: 4}}></Icon>
                </View>
              </View>
            </View>
        </TouchableHighlight >
      )
    }


    renderFooter = () => {
        const {loadingState} = this.state;
        if (!loadingState) return null;
        return (
          <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator animating={loadingState} />
          </View>

        );
    };



    render() {
      const { dataList, refreshing, scrollEnabled, loadingState } = this.state;
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            data={dataList}
            renderItem={this.renderTopicItem}
            style={{backgroundColor: '#e3e3e3'}}
            keyExtractor= {(item, index) => item.id}
            onEndReached={() => this.handleLoadMore()}
            refreshing={refreshing}
            onRefresh={() => this.getTopicItem()}
            scrollEnabled={scrollEnabled}
            ListFooterComponent={this.renderFooter}
            extraData={loadingState}
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
    listRow: {
        padding: 15,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        flex: 1,
    },
    listRowAlt: {
        backgroundColor: '#FAFAFA',
    },
    title: {
        fontSize: 15,
        color: '#101010',
    }
});