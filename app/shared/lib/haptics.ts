import ReactNativeHapticFeedback from "react-native-haptic-feedback"
const options = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false }
export const hapticToggle = () => ReactNativeHapticFeedback.trigger("selection", options)
export const hapticSuccess = () => ReactNativeHapticFeedback.trigger("impactMedium", options)
export const hapticWarning = () => ReactNativeHapticFeedback.trigger("notificationWarning", options)
export const hapticError = () => ReactNativeHapticFeedback.trigger("notificationError", options)
