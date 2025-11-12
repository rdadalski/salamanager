import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { CustomButton } from "@app/components";
import { useGetAllResourcesQuery } from "@app/api/resource/resource.api";
import { useGetTodayEventsQuery } from "@app/api/event/events.api";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";
import { CalendarNavigationProp } from "@app/navigation/CalendarNavigation";
import Ionicons from "react-native-vector-icons/MaterialIcons";

const CalendarHomeScreen = () => {
  const navigation = useNavigation<CalendarNavigationProp>();
  const { data: resources } = useGetAllResourcesQuery();
  const { data: todayEvents } = useGetTodayEventsQuery();

  const unconfigured = resources?.filter((r) => !r.configured) || [];
  const todayRevenue =
    todayEvents?.reduce(
      (sum, e) =>
        sum + (e.defaultResourcePrice || 0) * (e.attendees?.length || 0),
      0,
    ) || 0;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="bg-blue-500 dark:bg-blue-600 p-6 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold">
          {format(new Date(), "EEEE", { locale: pl })}
        </Text>
        <Text className="text-white/80">
          {format(new Date(), "d MMMM yyyy", { locale: pl })}
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row p-4 gap-3">
        <View className="flex-1 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50">
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            Treningi dziś
          </Text>
          <Text className="font-bold text-lg dark:text-white">
            {todayEvents?.length || 0}
          </Text>
        </View>
        <View className="flex-1 p-3 rounded-xl bg-green-100 dark:bg-green-900/50">
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            Przychód dziś
          </Text>
          <Text className="font-bold text-lg dark:text-white">
            {todayRevenue} zł
          </Text>
        </View>
      </View>

      {/* Alert nieskonfigurowane */}
      {unconfigured.length > 0 && (
        <TouchableOpacity
          className="mx-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded flex-row items-center justify-between"
          onPress={() => navigation.navigate("ConfigureResources")}
        >
          <View className="flex-1 flex-row items-center">
            <Ionicons
              name="warning"
              size={24}
              color="#ca8a04"
              style={{ marginRight: 12 }}
            />
            <View className="flex-1">
              <Text className="font-bold text-yellow-800 dark:text-yellow-400">
                Nieskonfigurowane treningi ({unconfigured.length})
              </Text>
              <Text className="text-yellow-600 dark:text-yellow-500 text-sm">
                Ustaw ceny i limity miejsc
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Akcje */}
      <View className="p-4">
        <Text className="font-bold mb-3 dark:text-white">Szybkie akcje</Text>
        <View className="gap-3">
          <CustomButton
            iconName="calendar"
            title="Kalendarz"
            onPress={() => navigation.navigate("CalendarList")}
          />
          <CustomButton iconName="team" title="Klienci" />
        </View>
      </View>
    </ScrollView>
  );
};

export default CalendarHomeScreen;
