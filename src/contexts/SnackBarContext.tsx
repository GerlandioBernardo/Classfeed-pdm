import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar } from "react-native-paper";
import { COLORS } from "../constants";

type SnackbarType = "success" | "error" | "info";

interface SnackbarContextData {
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextData | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SnackbarType>("info");
  const [duration, setDuration] = useState(3000);

  function showSnackbar(
    text: string,
    snackbarType: SnackbarType = "info",
    snackbarDuration = 3000
  ) {
    setMessage(text);
    setType(snackbarType);
    setDuration(snackbarDuration);
    setVisible(true);
  }

  function getBackgroundColor() {
    switch (type) {
      case "success":
        return COLORS.success
      case "error":
        return COLORS.error;
      default:
        return COLORS.info;
    }
  }

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={duration}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
}
