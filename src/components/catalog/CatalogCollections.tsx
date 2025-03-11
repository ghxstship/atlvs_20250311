import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { CatalogCollection } from '../../types/catalog';
import ActionButtons from '../ActionButtons';

interface CollectionFormData {
  name: string;
  description?: string;
  slug: string;
}

export default function CatalogCollections() {
  const { collections, addCollection, updateCollection, deleteCollection } = useCatalogStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    description: '',
    slug: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateCollection(isEditing, formData);
      } else {
        await addCollection(formData);
      }
      
      setFormData({ name: '', description: '', slug: '' });
      setIsEditing(null);
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await deleteCollection(id);
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const startEdit = (collection: CatalogCollection) => {
    setIsEditing(collection.id);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      slug: collection.slug
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-mono-900">Collections</h2>
        <button 
          onClick={() => {
            setIsEditing(null);
            setFormData({ name: '', description: '', slug: '' });
          }}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </button>
      </div>

      {(isEditing || formData.name) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-mono-900 mb-4">
            {isEditing ? 'Edit Collection' : 'New Collection'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Slug
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                title="Slug must contain only lowercase letters, numbers, and hyphens"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setFormData({ name: '', description: '', slug: '' });
                }}
                className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow divide-y divide-mono-200">
        {collections.map(collection => (
          <div key={collection.id}>
            <div 
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-mono-50 ${
                expandedId === collection.id ? 'bg-mono-50' : ''
              }`}
              onClick={() => toggleExpand(collection.id)}
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-mono-400 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-mono-900">{collection.name}</h3>
                  <p className="text-sm text-mono-500">{collection.slug}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <ActionButtons
                  onEdit={() => startEdit(collection)}
                  onDelete={() => handleDelete(collection.id)}
                />
                {expandedId === collection.id ? (
                  <ChevronUp className="w-5 h-5 text-mono-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-mono-400" />
                )}
              </div>
            </div>

            {expandedId === collection.id && (
              <div className="p-4 bg-mono-50">
                <div className="space-y-4">
                  {collection.description && (
                    <div>
                      <h4 className="text-sm font-medium text-mono-700 mb-1">Description</h4>
                      <p className="text-sm text-mono-600">{collection.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-mono-700 mb-1">Categories</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categories
                        .filter(c => c.collection_id === collection.id)
                        .map(category => (
                          <div 
                            key={category.id}
                            className="flex items-center justify-between p-2 bg-white rounded border border-mono-200"
                          >
                            <span className="text-sm text-mono-600">{category.name}</span>
                            <span className="text-xs text-mono-500">{category.slug}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}