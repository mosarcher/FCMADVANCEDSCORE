// @ts-nocheck
"use client";

import React, { forwardRef } from "react";

/**
 * Web-versie van de KeyboardView.
 * Dit zorgt ervoor dat de build op Vercel slaagt zonder
 * 'react-native' foutmeldingen.
 */
const KeyboardAvoidingAnimatedView = forwardRef((props: any, ref: any) => {
  const {
    children,
    style,
    enabled = true,
    behavior,
    keyboardVerticalOffset,
    contentContainerStyle,
    onLayout,
    ...leftoverProps
  } = props;

  // We gebruiken een simpele <div> omdat browsers op mobiel
  // het toetsenbord-gedrag zelf al goed afhandelen.
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        position: "relative",
        ...style,
      }}
      {...leftoverProps}
    >
      <div style={{ flex: 1, ...contentContainerStyle }}>{children}</div>
    </div>
  );
});

KeyboardAvoidingAnimatedView.displayName = "KeyboardAvoidingAnimatedView";

export default KeyboardAvoidingAnimatedView;
