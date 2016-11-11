'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ListView,
  Image,
  Button,
  TouchableHighlight
} from 'react-native';

var moment = require('moment');

class Feed extends Component {
  constructor(props) {
    super(props);

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });

    this.state = {
      dataSource: ds,
      showProgress: true
    };

    this.fetchFeed = this.fetchFeed.bind(this)
  }

  componentDidMount(){
    this.fetchFeed();
  }

  fetchFeed(){
    require('./AuthService').getAuthInfo((err, authInfo)=> {
      if (err) {
        console.log("Error: " + err);
      }
      var url = 'https://api.github.com/users/'
      + authInfo.user.login
      + '/received_events';

      fetch(url, {
        headers: authInfo.header
      })
      .then((response)=> response.json())
      .then((responseData)=> {
        var feedItems = responseData.filter((ev)=> ev.type == 'WatchEvent');
        var dataS = this.state.dataSource.cloneWithRows(feedItems)
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(feedItems),
          showProgress: false
        });
      })
    });
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={()=> this.pressRow(rowData)}
        underlayColor='#ddd'
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center',
          borderColor: '#D7D7D7',
          borderBottomWidth: 1,
          backgroundColor: '#fff'
        }}>
          <Image
            source={{uri: rowData.actor.avatar_url}}
            style={{
              height: 36,
              width: 36,
              borderRadius: 18
            }}
          />
          <View style={{
            paddingLeft: 20
          }}>
            <Text>
              {moment(rowData.created_at).fromNow()}
            </Text>
            <Text>
              <Text style={{
                fontWeight: '600'
              }}>{rowData.actor.login}</Text>
            </Text>
            <Text>
              at <Text style={{
                fontWeight: '600'
              }}>{rowData.repo.name}</Text>
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
        // return <Text style={{
        //   color: '#333',
        //   alignSelf: 'center'
        // }}>
        //   {rowData.actor.login}
        // </Text>
  }

  pressRow() {
    console.log("Press row");
  }

  render() {
    if(this.state.showProgress){
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
          <ActivityIndicator
            size="large"
            animating={true} />
          </View>
      )
    }
    return(
      <View style={{
        flex: 1,
        justifyContent: 'flex-start'
      }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }
}

module.exports = Feed;
