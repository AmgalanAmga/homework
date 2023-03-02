import React, { useState } from "react";
import notifee from '@notifee/react-native';
import { launchImageLibrary } from "react-native-image-picker";
import { TapGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, Button, Image, Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withTiming } from "react-native-reanimated";

function App() {
  const [emoji, setEmoji] = useState<any>('');
  const [imgUrl, setImgUrl] = useState<any>('');
  const emojiScaleup = useSharedValue(1);
  const defaultImg = 'https://images.pexels.com/photos/1674625/pexels-photo-1674625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  const getImage = async () => {
    await launchImageLibrary({ mediaType: 'mixed' }, res => {
      setImgUrl(res.assets[0].uri)
    });
  };
  const displayNotification = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  };
  const selectEmoji = async () => {
    await launchImageLibrary({ mediaType: 'mixed' }, res => {
      setEmoji(res.assets[0].uri)
    });
  };
  const scalingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScaleup.value }]
  }));
  const scaleUpEmoji = useAnimatedGestureHandler({
    onStart: () => {
      emojiScaleup.value = withTiming(emojiScaleup.value);
    },
    onEnd: () => {
      emojiScaleup.value = withTiming(emojiScaleup.value + 1);
    },
  });
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button title="Get Image" onPress={getImage} />
        <Button title="Display notification" onPress={displayNotification} />
        <Image source={{ uri: imgUrl ? imgUrl : defaultImg }} style={{ width: 300, height: 300, borderRadius: 10, marginTop: 25 }} />
        <Pressable onPress={selectEmoji} style={{ height: 70, width: 70, backgroundColor: "#4adede", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 50, marginTop: 25 }}>
          <Text style={{ fontSize: 50 }}>+</Text>
        </Pressable>
        <TapGestureHandler onGestureEvent={scaleUpEmoji}
          numberOfTaps={2}>
          <Animated.View style={[scalingStyle]}>
            {emoji &&
              <Image source={{ uri: emoji }} style={{ width: 50, height: 50, borderRadius: 25, marginTop: 25 }} />
            }
          </Animated.View>
        </TapGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
