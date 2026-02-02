// @ts-nocheck
import React from "react";
import { View } from "react-native-web"; // We gebruiken de web-versie

export default function KeyboardAvoidingAnimatedView({ children, style }: any) {
  return <div style={{ flex: 1, ...style }}>{children}</div>;
}
