import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { CatalogCategory } from '../../types/catalog';
import ActionButtons from '../ActionButtons';

interface CategoryFormData {
  name: string;
  description?: string;
  slug: string;
  collection_id: string;
  parent_id?: string;
}

export default function CatalogCategories() {
  const { categories, collections, addCategory, updateCategory, deleteCategory } = useCatalogStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    collection_id: '',
    parent_id: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateCategory(isEditing, formData);
      } else {
        await addCategory(formData);
      }
      
      setFormData({
        name: '',
        description: '',
        slug: '',
        collection_id: '',
        parent_id: undefined
      });
      setIsEditing(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const startEdit = (category: CatalogCategory) => {
    setIsEditing(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      collection_id: category.collection_id,
      parent_id: category.parent_id
    });
  };

  const getParentCategories = (collectionId: string) => {
    return categories.filter(c => 
      c.collection_id === collectionId && !c.parent_id
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-mono-900">Categories</h2>
        <button 
          onClick={() => {
            setIsEditing(null);
            setFormData({
              name: '',
              description: '',
              slug: '',
              collection_id: '',
              parent_id: undefined
            });
          }}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {(isEditing || formData.name) && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-mono-900 mb-4">
            {isEditing ? 'Edit Category' : 'New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Collection
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={formData.collection_id}
                onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                required
              >
                <option value="">Select collection</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

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

            {formData.collection_id && (
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={formData.parent_id || ''}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                >
                  <option value="">None (Top Level)</option>
                  {getParentCategories(formData.collection_id).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                  setFormData({
                    name: '',
                    description: '',
                    slug: '',
                    collection_id: '',
                    parent_id: undefined
                  });
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
        {collections.map(collection => {
          const collectionCategories = categories.filter(c => 
            c.collection_id === collection.id
          );

          return (
            <div key={collection.id} className="p-4">
              <h3 className="text-lg font-medium text-mono-900 mb-4">{collection.name}</h3>
              <div className="space-y-2">
                {collectionCategories.map(category => (
                  <div 
                    key={category.id}
                    className={`p-4 rounded-lg border border-mono-200 ${
                      expandedId === category.id ? 'bg-mono-50' : 'hover:bg-mono-50'
                    }`}
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(category.id)}
                    >
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 text-mono-400 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-mono-900">{category.name}</h4>
                          <p className="text-sm text-mono-500">{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ActionButtons
                          onEdit={() => startEdit(category)}
                          onDelete={() => handleDelete(category.id)}
                        />
                        {expandedId === category.id ? (
                          <ChevronUp className="w-5 h-5 text-mono-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-mono-400" />
                        )}
                      </div>
                    </div>

                    {expandedId === category.id && category.description && (
                      <div className="mt-4 pt-4 border-t border-mono-200">
                        <p className="text-sm text-mono-600">{category.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}