import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { CATEGORIES } from "../../data/dummy-data";
import CategoriesGridTile from "../components/CategoriesGridTile";
import Category from "../../models/category";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";

const _CategoriesScreen: React.FC<{}> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderCategoryItem: ListRenderItem<Category> | null | undefined = (
    itemData,
  ) => {
    const handleTilePress = () => {
      navigation.navigate("MealsOverview", { categoryId: itemData.item.id });
    };

    return (
      <CategoriesGridTile
        title={itemData.item.title}
        color={itemData.item.color}
        onPress={handleTilePress}
      />
    );
  };

  return (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      numColumns={2}
    />
  );
};

export default _CategoriesScreen;
