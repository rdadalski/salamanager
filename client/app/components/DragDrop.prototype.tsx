import { FC, useRef, useState } from "react";
import { PanResponder, Animated, Image, StyleSheet } from "react-native";

export const DragAndDropImage: FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDragging(true);
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: position.x,
            dy: position.y,
          },
        ],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        setDragging(false);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.imageContainer,
        {
          transform: position.getTranslateTransform(),
          opacity: dragging ? 0.8 : 1,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Image style={styles.image} source={{ uri: imageUrl }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
