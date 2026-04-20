import * as ImagePicker from "expo-image-picker";

export type MediaPickResult =
  | { status: "success"; uri: string }
  | { status: "cancelled" }
  | { status: "denied"; canAskAgain: boolean };

function toResult(result: ImagePicker.ImagePickerResult): MediaPickResult {
  if (result.canceled) return { status: "cancelled" };
  const uri = result.assets?.[0]?.uri;
  if (!uri) return { status: "cancelled" };
  return { status: "success", uri };
}

export async function pickImageFromGallery(): Promise<MediaPickResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return { status: "denied", canAskAgain: permission.canAskAgain };
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.9,
    aspect: [1, 1],
  });
  return toResult(result);
}

export async function takePhotoWithCamera(): Promise<MediaPickResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    return { status: "denied", canAskAgain: permission.canAskAgain };
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.9,
    aspect: [1, 1],
  });
  return toResult(result);
}
