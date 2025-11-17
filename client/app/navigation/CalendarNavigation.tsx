import { CalendarEvents } from "@app/Screens/Calendar/components/CalendarEvents";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { CalendarList } from "@app/Screens/Calendar/CalendarList";
import { CustomButton } from "@app/components";
import CalendarHomeScreen from "@app/Screens/Calendar/CalendarScreen";
import ConfigureResourcesScreen from "@app/Screens/Resource/ConfigureResource";
import ResourceEdit from "@app/Screens/Resource/ResourceEdit";
import { SafeAreaView } from "react-native-safe-area-context";

export type CalendarStackParamList = {
  CalendarList: undefined;
  CalendarEvents: { calendarId: string };
  CalendarScreen: undefined;
  ConfigureResourceScreen: undefined;
  ResourceEditScreen: { resourceId: string };
};

export type CalendarNavigationProp =
  NativeStackNavigationProp<CalendarStackParamList>;

const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStackNavigator = () => {
  return (
    <SafeAreaView className={"flex-1"}>
      <CalendarStack.Navigator>
        <CalendarStack.Screen
          name="CalendarScreen"
          component={CalendarHomeScreen}
          options={{ title: "Calendar home screen" }}
        />
        <CalendarStack.Screen
          name="CalendarList"
          component={CalendarList}
          options={{ title: "Calendar List" }}
        />
        <CalendarStack.Screen
          name="ResourceEditScreen"
          component={ResourceEdit}
          options={{ title: "Resource edit screen" }}
        />
        <CalendarStack.Screen
          name="ConfigureResourceScreen"
          component={ConfigureResourcesScreen}
          options={{ title: "Configure Resource Screen" }}
        />
        <CalendarStack.Screen
          name="CalendarEvents"
          component={CalendarEvents}
          options={({ navigation }) => ({
            title: "Calendar Events",
            headerLeft: () => (
              <CustomButton
                title={""}
                iconName="calendar"
                onPress={() => navigation.navigate("CalendarList")}
              />
            ),
          })}
        />
      </CalendarStack.Navigator>
    </SafeAreaView>
  );
};
