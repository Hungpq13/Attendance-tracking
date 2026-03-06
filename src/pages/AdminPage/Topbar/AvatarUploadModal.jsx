import { useState, useRef } from 'react';
import { useToast } from '../../../hooks/useToast';
import { userAPI } from '../../../services/api';
import { getUserFromToken } from '../../../config/TokenHelper';
import './AvatarUploadModal.css';

function AvatarUploadModal({ isOpen, onClose, onUpload, currentAvatar }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileSelect = (files) => {
    if (files && files[0]) {
      const file = files[0];
      
      // Kiểm tra loại tệp
      if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn tệp hình ảnh', 'error');
        return;
      }

      // Kiểm tra kích thước tệp (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Kích thước tệp không được vượt quá 5MB', 'error');
        return;
      }

      // Lưu tệp và tạo ảnh xem trước
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Vui lòng chọn một ảnh khác', 'error');
      return;
    }

    try {
      setUploading(true);

      // Bước 1: Tải tệp lên và nhận URL
      const uploadResponse = await userAPI.uploadAvatar(selectedFile);
      // Lấy URL avatar từ response (hỗ trợ nhiều cấu trúc dữ liệu)
      const avatarUrl = uploadResponse?.url || uploadResponse?.data || uploadResponse?.avatarUrl;
      const message = uploadResponse?.message || 'Tải ảnh lên thành công';

      if (!avatarUrl) {
        throw new Error('Không nhận được URL từ server: ' + JSON.stringify(uploadResponse));
      }

      // Bước 2: Hiển thị avatar mới và thông báo
      showToast(message, 'success');
      await onUpload(avatarUrl);
      onClose();
      
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Lỗi khi tải ảnh lên',
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(currentAvatar);
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thay đổi ảnh đại diện</h2>
          <button className="modal-close" onClick={handleCancel}>×</button>
        </div>

        <div className="modal-body">
          <div className="preview-section">
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="Xem trước" className="preview-image" />
              </div>
            )}
          </div>

          <div
            className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="drag-drop-content">
              <svg className="drag-drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="drag-drop-text">
                Kéo ảnh vào đây hoặc<br />
                <button
                  type="button"
                  className="browse-button"
                  onClick={handleBrowseClick}
                >
                  chọn từ máy tính
                </button>
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          <p className="file-info">
            Định dạng: JPG, PNG, GIF (Tối đa 5MB)
          </p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={uploading}
          >
            Hủy bỏ
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? 'Đang tải...' : 'Lưu ảnh'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarUploadModal;
