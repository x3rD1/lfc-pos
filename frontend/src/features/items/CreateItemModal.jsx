import { useRef, useState } from "react";
import styles from "./CreateItemModal.module.css";

function CreateItemModal({ onClose, onCreate }) {
  const [input, setInput] = useState({ name: "", price: "" });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let mediaUrl;
      let mediaId;
      let mediaType;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/upload/media`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );

        if (!res.ok) throw new Error("Media upload failed");

        const data = await res.json();
        mediaUrl = data.url;
        mediaId = data.public_id;
        mediaType = data.resource_type;
      }

      const args = { ...input, mediaUrl, mediaId, mediaType };
      onCreate(args);
    } catch (error) {
      console.error(error);
    }
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    e.target.value = "";
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.accentLine} />

        <div className={styles.header}>
          <h1 className={styles.title}>Create Item</h1>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />

            <div
              className={`${styles.imageZone} ${file ? styles.hasImage : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className={styles.preview}
                />
              ) : (
                <div className={styles.uploadPrompt}>
                  <div className={styles.uploadIcon}>+</div>
                  <span>Add an image</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Item Name</label>
            <input
              type="text"
              value={input.name}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter item name"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Price</label>
            <div className={styles.priceWrap}>
              <span className={styles.currency}>$</span>
              <input
                type="number"
                value={input.price}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                placeholder="0.00"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.btnSecondary}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateItemModal;
