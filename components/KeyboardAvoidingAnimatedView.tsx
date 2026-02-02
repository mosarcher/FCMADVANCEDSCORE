// @ts-nocheck
"use client";

import React, { forwardRef } from "react";

/**
 * Dit is de Web-vriendelijke versie van de KeyboardAvoidingView.
 * Op een website in de browser wordt het toetsenbord-gedrag
 * automatisch door de browser afgehandeld.
 */
const KeyboardAvoidingAnimatedView = forwardRef((props: any, ref: any) => {
  const { children, style, enabled = true, ...leftoverProps } = props;

  // In de browser (web) gebruiken we een simpele div of een view-container.
  // Dit voorkomt dat Vercel crasht op "react-native" errors.
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        ...style,
      }}
      {...leftoverProps}
    >
      {children}
    </div>
  );
});

KeyboardAvoidingAnimatedView.displayName = "KeyboardAvoidingAnimatedView";

export default KeyboardAvoidingAnimatedView;
