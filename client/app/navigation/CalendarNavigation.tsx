import { CalendarEvents } from "@app/Screens/Calendar/components/CalendarEvents";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalendarList } from "@app/Screens/Calendar/CalendarList";
import { CustomButton } from "@app/components";

export type CalendarStackParamList = {
  CalendarList: undefined;
  CalendarEvents: { calendarId: string };
};

const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStackNavigator = () => {
  return (
    <CalendarStack.Navigator>
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
