import { CalendarEvents } from "@app/Screens/Calendar/components/CalendarEvents";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { CalendarList } from "@app/Screens/Calendar/CalendarList";
import { CustomButton } from "@app/components";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarHomeScreen from "@app/Screens/Calendar/CalendarScreen";

export type CalendarStackParamList = {
  CalendarList: undefined;
  CalendarEvents: { calendarId: string };
  CalendarScreen: undefined;
};

export type CalendarNavigationProp =
  NativeStackNavigationProp<CalendarStackParamList>;

const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStackNavigator = () => {
  return (
    <SafeAreaView className={"flex-1 bg-white"}>
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
