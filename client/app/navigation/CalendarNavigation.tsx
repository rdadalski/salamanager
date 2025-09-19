import { CalendarEvents } from "@app/Screens/Calendar/components/CalendarEvents";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalendarList } from "@app/Screens/Calendar/CalendarList";
import { CustomButton } from "@app/components";
import { CalendarScreen } from "@app/Screens/Calendar/CalendarScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export type CalendarStackParamList = {
  "Calendar List": undefined;
  "Calendar Events": { calendarId: string };
};

const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStackNavigator = () => {
  return (
    <SafeAreaView className={"flex-1 bg-white"}>
      <CalendarStack.Navigator>
        {/*<CalendarStack.Screen name="CalendarScreen" component={CalendarScreen} />*/}
        <CalendarStack.Screen name="Calendar List" component={CalendarList} />
        <CalendarStack.Screen
          name="Calendar Events"
          component={CalendarEvents}
          options={({ navigation }) => ({
            headerLeft: () => (
              <CustomButton
                title={""}
                iconName="calendar"
                onPress={() => navigation.navigate("Calendar List")}
              />
            ),
          })}
        />
      </CalendarStack.Navigator>
    </SafeAreaView>
  );
};
