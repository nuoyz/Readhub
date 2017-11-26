import React from 'react'
import {StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
moment.locale('zh-cn');

export default function topicItem (props) {
    return (
      <TouchableHighlight activeOpacity={.95}
        style={{marginBottom: 8, marginTop: props.index === 0 ? 8 : 0}}
        onPress={props.handlePress}
      >
        <View style={[styles.topicItem]}>
          <View>
            <View>
            <Text ellipsizeMode="tail" numberOfLines={2} style={[styles.topicTitle]}>{props.title}</Text>
            </View>
            <View>
            <Text ellipsizeMode="tail" numberOfLines={3} style={{fontSize: 13, color: '#6b6a6b', marginTop: 6, marginBottom: 6}}>{props.summary}</Text>
            </View>
            <View style={{ height: 5 }}></View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text ellipsizeMode="tail" numberOfLines={3} style={{color: '#808080', fontSize: 12, width: 80}}>{moment(props.publishDate).fromNow()}</Text>
              </View>
          </View>
        </View>
      </TouchableHighlight >
    )
}

const styles = StyleSheet.create({
    topicItem: {
        flexDirection: 'row',
        flex: 1,
        padding: 15,
        backgroundColor: '#ffffff',
    },
    topicTitle: {
        fontSize: 15,
        color: '#101010',
    }
});
