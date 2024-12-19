import { View, Image, ImageProps, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

import { icons } from "../../constants";

interface ITabIcon {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<ITabIcon> = ({
  icon,
  color,
  name,
  focused,
}): JSX.Element => {
  return (
    <View className="flex-1 w-20 items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout: React.FC = (): JSX.Element => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarLabelStyle: {
            fontSize: 16,
            fontFamily: "Georgia",
            fontWeight: 300,
          },
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 80,
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        ></Tabs.Screen>
      </Tabs>
    </>
  );
};

export default TabsLayout;
