import { CalendarEvents } from "@app/Screens/Calendar/components/CalendarEvents";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalendarList } from "@app/Screens/Calendar/CalendarList";
import { CustomButton } from "@app/components";
import { CalendarScreen } from "@app/Screens/Calendar/CalendarScreen";

export type CalendarStackParamList = {
  CalendarList: undefined;
  CalendarEvents: { calendarId: string };
  CalendarScreen: undefined;
};

const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStackNavigator = () => {
  return (
    <CalendarStack.Navigator>
      {/*<CalendarStack.Screen name="CalendarScreen" component={CalendarScreen} />*/}
      <CalendarStack.Screen name="CalendarList" component={CalendarList} />
      <CalendarStack.Screen
        name="CalendarEvents"
        component={CalendarEvents}
        options={({ navigation }) => ({
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
  );
};
