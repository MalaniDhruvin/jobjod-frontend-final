import { Trash2, Eye, Edit, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { EditDocumentModal } from "./EditDocumentModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ViewDocumentModal } from "./ViewDocumentModal";
import { BASE_URL } from "../config";

export default function LegalDocuments() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch user documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/legaldocs/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(response.data.data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    if (userId && token) fetchDocuments();
  }, [userId, token]);

  // Handle file upload
  const handleFileChange = async (e) => {
    if (!e.target.files[0] || !selectedDocument) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("documentType", selectedDocument.name);
    formData.append("documentFile", file);

    try {
      const response = await axios.post(`${BASE_URL}/legaldocs/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const newDoc = response.data.data[0]; // Adjust based on backend response
      setDocuments((prev) => [
        ...prev.filter((doc) => doc.id !== selectedDocument.id),
        newDoc,
      ]);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle delete
  const confirmDelete = async () => {
    if (!selectedDocument?.id) return;

    try {
      await axios.delete(`${BASE_URL}/legaldocs/${selectedDocument.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId }, // Pass userId in body
      });
      setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDocument.id));
      setShowDeleteModal(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Handle edit
  const handleSaveEdit = async (updatedDoc) => {
    if (!updatedDoc?.id) return;

    try {
      const response = await axios.put(
        `${BASE_URL}/legaldocs/${updatedDoc.id}`,
        { ...updatedDoc, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === updatedDoc.id ? response.data.data : doc))
      );
      setShowEditModal(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // Other handlers remain the same
  const triggerFileInput = (docId) => {
    setSelectedDocument(documents.find((doc) => doc.id === docId) || null);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleDelete = (docId) => {
    setSelectedDocument(documents.find((doc) => doc.id === docId) || null);
    setShowDeleteModal(true);
  };

  const handleView = (docId) => {
    setSelectedDocument(documents.find((doc) => doc.id === docId) || null);
    setShowViewModal(true);
  };

  const handleEdit = (docId) => {
    setSelectedDocument(documents.find((doc) => doc.id === docId) || null);
    setShowEditModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Legal Information</h1>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-200 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{doc.documentType}</h3>
                <p className="text-sm text-gray-500">
                  {doc.filePath ? doc.filePath.split('-').pop() : "Not Uploaded"}
                </p>
              </div>
            </div>
            {doc.filePath ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleView(doc.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(doc.id)}
                  className="p-2 text-purple-500 hover:text-purple-700 rounded-full hover:bg-purple-50"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => triggerFileInput(doc.id)}
                className="px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-50"
              >
                Upload
              </button>
            )}
          </div>
        ))}
      </div>

      {showViewModal && selectedDocument && (
        <ViewDocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
      {showEditModal && selectedDocument && (
        <EditDocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDocument(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
      {showDeleteModal && selectedDocument && (
        <DeleteConfirmModal
          document={selectedDocument}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedDocument(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}