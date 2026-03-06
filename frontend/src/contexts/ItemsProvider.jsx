import { useState } from "react";
import { createItem, deleteItem, getItems, updateItem } from "../api/items_api";
import ItemsContext from "./ItemsContext";

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getItems();
      setItems(res);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch items", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const onCreate = async ({ name, price, mediaUrl, mediaId, mediaType }) => {
    try {
      const res = await createItem({
        name,
        price,
        mediaUrl,
        mediaId,
        mediaType,
      });
      setItems((prev) => [...prev, res]);
    } catch (error) {
      console.log("Failed to create an item", error);
      setError(error.message);
    }
  };

  const onEdit = async (
    { name, price, mediaUrl, mediaId, mediaType },
    itemId,
  ) => {
    let originalItem;

    setItems((prev) => {
      originalItem = prev.find((item) => item.id === itemId);

      return prev.map((item) =>
        item.id === itemId
          ? { ...item, name, price, mediaUrl, mediaId, mediaType }
          : item,
      );
    });

    try {
      await updateItem({ name, price, mediaUrl, mediaId, mediaType }, itemId);
    } catch (error) {
      console.log("Failed to edit an item", error);
      setError(error.message);

      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? originalItem : item)),
      );
    }
  };

  const onDelete = async (itemId) => {
    console.log(itemId);
    let previousItems;

    setItems((prev) => {
      previousItems = prev;
      return prev.filter((item) => item.id !== itemId);
    });

    try {
      await deleteItem(itemId);
    } catch (error) {
      console.log("Failed to delete an item", error);
      setError(error.message);

      setItems(previousItems);
    }
  };

  const value = {
    items,
    error,
    loading,
    fetchItems,
    onCreate,
    onEdit,
    onDelete,
  };
  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
}
