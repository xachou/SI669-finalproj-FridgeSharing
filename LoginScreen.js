import React from 'react';
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { styles } from './Styles';

import firebase from 'firebase';
import '@firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAK4Tn8HNnIbrdfh5e1uR5JECM3T4J99N0",
    authDomain: "finalproj-fridge.firebaseapp.com",
    databaseURL: "https://finalproj-fridge.firebaseio.com",
    projectId: "finalproj-fridge",
    storageBucket: "finalproj-fridge.appspot.com",
    messagingSenderId: "601009921612",
    appId: "1:601009921612:web:fc4ecc77b48d4cd6409ee9"
  };

export class LoginScreen extends React.Component {
    constructor(props)  {
      super(props);
      if (firebase.apps.length == 0) {
        console.log('before config###########')
        console.log(firebase.apps.length)
        firebase.initializeApp(firebaseConfig);
        console.log('after config###########')
        console.log(firebase.apps.length)
      }
      this.db = firebase.firestore(); 
      this.usersRef = this.db.collection('users');

      this.state = {
        errorMessage: '',
        usernameText: '',
        passwordText: '',
      }
    }
  
    handleLogin = () => {
      let username = this.state.usernameText;
      this.usersRef.where('username', '==', username).get().then(querySnapshot => {
        if (querySnapshot.empty) {
          this.setState({errorMessage: 'no such user'});
        } else {
          let user = querySnapshot.docs[0].data();
          user.key = querySnapshot.docs[0].id;
          if (user.password === this.state.passwordText) {
            this.props.navigation.navigate('Home', {
                mode: 'returning', 
                user: user,
                login: this,
            });
          } else {
            this.setState({errorMessage: 'wrong password'});
          }
        }
      });
    }
  
    handleCreateAccount = () => {
      let username = this.state.usernameText;
      this.usersRef.where('username', '==', username).get().then(queryRef => {
        if (queryRef.empty) {
          let newUser = {
            username: username, 
            password: this.state.passwordText
          };
          this.usersRef.add(newUser).then(docRef => {
            newUser.key = docRef.id;
            this.props.navigation.navigate('Home', {
                mode: 'new', 
                user: newUser,
                login: this,
            });
            this.setState({      
              errorMessage: '',
              usernameText: '',
              passwordText: ''})
          });
        } else {
          this.setState({errorMessage: 'user already exists'});
        }
      });
    }
  
    render() {
      return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Log in</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text>{this.state.errorMessage}</Text>
            <View style={styles.bodyRow}>
              <Text>Username:</Text>
              <Input
                placeholder="Username"
                autoCapitalize="none"
                value={this.state.usernameText}
                onChangeText={(text)=>{this.setState({usernameText: text})}}
              />
            </View>
            <View style={styles.bodyRow}>
              <Text>Password:</Text>
              <Input
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry={true}
                value={this.state.passwordText}
                onChangeText={(text)=>{this.setState({passwordText: text})}}
              />
            </View>
          </View>
          <View style={styles.footerContainer}>
            <Button
              title="Login"
              containerStyle={styles.buttonContainer}
              onPress={this.handleLogin}
            />
            <Button
              title="Create Account"
              containerStyle={styles.buttonContainer}
              onPress={this.handleCreateAccount}
            />
          </View>
        </KeyboardAvoidingView>
      );
    }
  }