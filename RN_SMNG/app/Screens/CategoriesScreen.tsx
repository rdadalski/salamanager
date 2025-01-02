import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { CATEGORIES } from "../../data/dummy-data";
import CategoriesGridTile from "../components/CategoriesGridTile";
import Category from "../../models/category";

const renderCategoryItem: ListRenderItem<Category> | null | undefined = (
  itemData
) => {
  return (
    <CategoriesGridTile
      title={itemData.item.title}
      color={itemData.item.color}
      onPress={() => {}}
    />
  );
};

const CategoriesScreen: React.FC = () => {
  return (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      numColumns={2}
    />
  );
};

export default CategoriesScreen;
