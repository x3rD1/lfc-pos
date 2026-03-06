import { useContext, useEffect, useState } from "react";
import ItemContext from "../../contexts/ItemsContext";
import CreateItemModal from "./CreateItemModal";
import ItemList from "./ItemList";
import styles from "./Items.module.css";

function Items() {
  const { items, fetchItems, onCreate, onDelete } = useContext(ItemContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (!items) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Items</h1>
          <p className={styles.subtitle}>Manage your inventory</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <span>+</span>
          Add item
        </button>
      </div>

      <div className={styles.content}>
        <ItemList items={items} onDelete={onDelete} />
      </div>

      {isModalOpen && (
        <CreateItemModal onClose={closeModal} onCreate={onCreate} />
      )}
    </div>
  );
}

export default Items;
