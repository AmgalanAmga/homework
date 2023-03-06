import React, { useState } from "react";
import notifee from "@notifee/react-native";
import { launchImageLibrary } from "react-native-image-picker";
import {
  TapGestureHandler,
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import {
  SafeAreaView,
  Button,
  Image,
  Pressable,
  Text,
  Alert,
  FlatList,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Contacts from "react-native-contacts";
import { PERMISSIONS, request } from "react-native-permissions";

function App() {
  const [emoji, setEmoji] = useState<any>("");
  const [imgUrl, setImgUrl] = useState<any>("");
  const [contactData, setContactData] = useState<any>([]);
  const emojiScaleup = useSharedValue(1);
  const x = useSharedValue(50);
  const y = useSharedValue(40);
  const defaultImg =
    "https://images.pexels.com/photos/1674625/pexels-photo-1674625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const getImage = async () => {
    request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY).then(async result => {
      if (result === "granted") {
        await launchImageLibrary({ mediaType: "mixed" }, res => {
          res.assets?.forEach(img => {
            setImgUrl(img.uri);
          });
        });
      } else if (result === "denied") {
        Alert.alert(
          "The permission has not been requested / is denied but requestable",
        );
      }
    });
  };
  const displayNotification = async () => {
    const status = await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    if (status.authorizationStatus) {
      await notifee.displayNotification({
        title: "Notification Title",
        body: "Main body content of the notification",

        ios: {
          sound: "loca.wav",
          attachments: [
            // {
            //   url: "https://images.pexels.com/photos/15521519/pexels-photo-15521519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            // },
            {
              url: require("./assets/1.jpeg"),
            },
          ],
        },
      });
    } else {
      const res = await notifee.requestPermission();
      console.log("User has notification permissions disabled");
    }
  };
  const selectEmoji = async () => {
    request(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY).then(async result => {
      await launchImageLibrary({ mediaType: "mixed" }, res => {
        res.assets?.forEach(img => {
          setEmoji(img.uri);
        });
      });
    });
  };
  const scalingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScaleup.value }],
  }));
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });
  const scaleUpEmoji = useAnimatedGestureHandler({
    onStart: () => {
      emojiScaleup.value = withTiming(emojiScaleup.value);
    },
    onEnd: () => {
      emojiScaleup.value = withTiming(emojiScaleup.value + 3);
    },
  });
  const getAllContacts = () => {
    Contacts.getAll().then(contacts => {
      setContactData(
        contacts.sort((a, b) => a.givenName.localeCompare(b.givenName)).map(el => {
          return {
            [el.givenName[0]]: { name: el.givenName, number: el.phoneNumbers },
          };
        })
        );
       console.log(Object.entries(contactData))
    });
  };
  const dragEmojiEvent = () => {};

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Button title="Get Image" onPress={getImage} />
        <Button title="Display notification" onPress={displayNotification} />
        <Image
          source={{ uri: imgUrl ? imgUrl : defaultImg }}
          style={{ width: 150, height: 150, borderRadius: 10, marginTop: 25 }}
        />
        <Pressable
          onPress={selectEmoji}
          style={{
            height: 30,
            width: 30,
            backgroundColor: "#4adede",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            marginTop: 25,
          }}>
          <Text style={{ fontSize: 20 }}>+</Text>
        </Pressable>
        <TapGestureHandler onGestureEvent={scaleUpEmoji} numberOfTaps={2}>
          <Animated.View style={[scalingStyle]}>
            {emoji && (
              <Image
                source={{ uri: emoji }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginTop: 25,
                }}
              />
            )}
          </Animated.View>
        </TapGestureHandler>

        <Button title="Get contact" onPress={getAllContacts} />
        <FlatList
          data={Object.entries(contactData)}
          renderItem={({ item }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <Text style={{ fontWeight: "600" }}>{item[0]}</Text>
              {/* <Text style={{ marginLeft: 10, width: 150 }}>
                {item.number[0].number}
              </Text> */}
            </View>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
