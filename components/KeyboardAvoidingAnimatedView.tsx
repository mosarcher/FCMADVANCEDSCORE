import React, { useRef, useEffect, forwardRef } from "react";
import {
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ViewLayoutEvent,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const KeyboardAvoidingAnimatedView = forwardRef((props: any, ref: any) => {
  const {
    children,
    behavior = Platform.OS === "ios" ? "padding" : "height",
    keyboardVerticalOffset = 0,
    style,
    contentContainerStyle,
    enabled = true,
    onLayout,
    ...leftoverProps
  } = props;

  const animatedViewLayout = useRef<{ y: number; height: number } | null>(null);
  const initialHeightRef = useRef(0);
  const bottomHeight = useSharedValue(0);

  useEffect(() => {
    if (!enabled) return;

    // Gebruik 'keyboardDidShow' voor Android ondersteuning, 'keyboardWillShow' voor iOS
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onKeyboardShow = (event: any) => {
      const { duration, endCoordinates } = event;
      const layout = animatedViewLayout.current;

      if (!layout) return;

      const keyboardY = endCoordinates.screenY - keyboardVerticalOffset;
      const moveDistance = Math.max(layout.y + layout.height - keyboardY, 0);

      bottomHeight.value = withTiming(moveDistance, {
        duration: duration > 10 ? duration : 300,
      });
    };

    const onKeyboardHide = (event: any) => {
      const duration = event?.duration || 300;
      bottomHeight.value = withTiming(0, { duration });
    };

    const showSubscription = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardVerticalOffset, enabled, bottomHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    if (behavior === "height") {
      return {
        height:
          initialHeightRef.current > 0
            ? initialHeightRef.current - bottomHeight.value
            : undefined,
      };
    }
    if (behavior === "padding") {
      return {
        paddingBottom: bottomHeight.value,
      };
    }
    return {};
  });

  const positionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bottomHeight.value }],
  }));

  const handleLayout = (event: ViewLayoutEvent) => {
    const layout = event.nativeEvent.layout;
    animatedViewLayout.current = layout;

    if (initialHeightRef.current === 0) {
      initialHeightRef.current = layout.height;
    }

    if (onLayout) {
      onLayout(event);
    }
  };

  if (Platform.OS === "web") {
    return (
      <KeyboardAvoidingView
        behavior={behavior}
        style={style}
        keyboardVerticalOffset={keyboardVerticalOffset}
        {...leftoverProps}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <Animated.View
      ref={ref}
      style={[style, animatedStyle]}
      onLayout={handleLayout}
      {...leftoverProps}
    >
      {behavior === "position" ? (
        <Animated.View style={[contentContainerStyle, positionAnimatedStyle]}>
          {children}
        </Animated.View>
      ) : (
        children
      )}
    </Animated.View>
  );
});

KeyboardAvoidingAnimatedView.displayName = "KeyboardAvoidingAnimatedView";

export default KeyboardAvoidingAnimatedView;
