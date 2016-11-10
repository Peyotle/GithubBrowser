'use strict';

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  Button,
  ActivityIndicator
} from 'react-native';
var buffer = require('buffer');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProgress: false
    }
  }

  render() {
    var errorCtrl = <View />;

    if(!this.state.success && this.state.badCredentials) {
      errorCtrl = <Text style={styles.error}>
        Wrong username and password combiation
      </Text>;
    }

    if(!this.state.success && this.state.unknownError) {
      errorCtrl = <Text style={styles.error}>
        Unknown error
      </Text>;
    }

    return(
      <View style={styles.container}>
        <Image style={styles.logo}
          source={require('image!Octocat')} />
        <Text style={styles.heading}>
          Github Browser
        </Text>
        <TextInput
          onChangeText={(text) => this.setState({userName: text})}
          style={styles.input}
          placeholder="Github username" />
        <TextInput
          onChangeText={(text) => this.setState({password: text})}
          style={styles.input}
          placeholder="Github password"
          secureTextEntry={true} />
        <Button
          onPress={this.onLoginPressed.bind(this)}
          style={styles.button}
          title="Log in"
          accessibilityLabel="Log In button"
        />

        {errorCtrl}
        <ActivityIndicator
          animating={this.state.showProgress}
          size="large"
          style={styles.loader} />
      </View>
    );
  }

  onLoginPressed() {
    console.log('Attempting to log in username ' + this.state.userName);
    this.setState({showProgress: true});

    var authService = require('./AuthService');
    authService.login({
      username: this.state.username,
      password: this.state.password
    }, (results)=> {
      this.setState(Object.assign({showProgress: false}, results));
    });
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    padding: 10
  },
  logo: {
    width: 66,
    height: 55
  },
  heading: {
    fontSize: 30,
    marginTop: 10
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
    // color: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48bbec',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  loader: {
    marginTop: 20
  },
  error: {
    color: 'red'
  }
});
module.exports = Login;
