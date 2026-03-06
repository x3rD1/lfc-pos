import { useContext, useRef, useState } from "react";
import styles from "./EditItemModal.module.css";
import ItemsContext from "../../contexts/ItemsContext";

function EditItemModal({ item, onClose }) {
  const { onEdit } = useContext(ItemsContext);
  const [input, setInput] = useState({
    name: item.name || "",
    price: item.price || "",
  });
  const [existingMedia, setExistingMedia] = useState({
    mediaUrl: item.mediaUrl || null,
    mediaId: item.mediaId || null,
    mediaType: item.mediaType,
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    e.target.value = "";
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();

    if (existingMedia.mediaUrl) {
      setExistingMedia({ mediaUrl: null, mediaId: null, mediaType: null });
    } else {
      setFile(null);
    }
  };

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

      const args = {
        ...input,
        mediaUrl,
        mediaId,
        mediaType,
      };
      onEdit(args, item.id);
    } catch (error) {
      console.error(error);
    }
    onClose?.();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.accentLine} />

        <div className={styles.header}>
          <h1 className={styles.title}>Edit Item</h1>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className={styles.hiddenInput}
            />

            <div
              className={`${styles.imageZone} ${existingMedia.mediaUrl ? styles.hasImage : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {existingMedia.mediaUrl || file ? (
                <div className={styles.imageWrap}>
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={handleRemoveImage}
                  >
                    ×
                  </button>
                  <img
                    src={
                      existingMedia.mediaUrl
                        ? existingMedia.mediaUrl
                        : URL.createObjectURL(file)
                    }
                    alt="Preview"
                    className={styles.preview}
                  />
                </div>
              ) : (
                <div className={styles.uploadPrompt}>
                  <div className={styles.uploadIcon}>+</div>
                  <span>Change image</span>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;
