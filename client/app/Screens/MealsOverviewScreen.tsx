import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useLayoutEffect } from "react";
import { View, FlatList, ListRenderItem } from "react-native";
import { RootStackParamList } from "../App";
import { CATEGORIES, MEALS } from "../../data/dummy-data";
import Meal from "../../models/meal";
import MealItem from "../components/MealItem";

type Props = NativeStackScreenProps<RootStackParamList, "MealsOverview">;

const MealsOverviewScreen: FC<Props> = ({ route, navigation }): JSX.Element => {
  const categoryId = route.params.categoryId;

  const dispalayedMeals = MEALS.filter((mealItem) => {
    return mealItem.categoryIds.indexOf(categoryId) >= 0;
  });

  useLayoutEffect(() => {
    const categoryTitle = CATEGORIES.find((category) => category.id === categoryId)?.title;

    navigation.setOptions({
      title: categoryTitle,
    });
  }, [categoryId, navigation]);

  const renderMealItem: ListRenderItem<Meal> | null | undefined = (itemData) => {
    const mealItemProps = {
      title: itemData.item.title,
      imageUri: itemData.item.imageUrl,
      duration: itemData.item.duration,
      complexity: itemData.item.complexity,
      affordability: itemData.item.affordability,
    };

    return <MealItem {...mealItemProps} />;
  };

  return (
    <View>
      <FlatList
        data={dispalayedMeals}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
      ></FlatList>
    </View>
  );
};

export default MealsOverviewScreen;
