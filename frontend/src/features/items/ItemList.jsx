import { useState } from "react";
import EditItemModal from "./EditItemModal";
import styles from "./ItemList.module.css";

function ItemList({ items, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  const handleEditClick = (item) => {
    setTargetItem(item);
    setIsEditing(true);
  };

  const handleDeleteClick = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(itemId);
    }
  };

  const closeModal = () => {
    setIsEditing(false);
    setTargetItem(null);
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <h3>No items yet</h3>
        <p>Add your first item to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageContainer}>
              {item.mediaUrl ? (
                <img
                  src={item.mediaUrl}
                  alt={item.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.noImage}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
              <div className={styles.imageOverlay} />
            </div>

            <div className={styles.cardBody}>
              <div className={styles.itemInfo}>
                <h3 className={styles.name}>{item.name}</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span>{item.price}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEditClick(item)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(item.id)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && <EditItemModal item={targetItem} onClose={closeModal} />}
    </>
  );
}

export default ItemList;
