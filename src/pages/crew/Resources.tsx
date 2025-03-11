import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Download, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, Users, Eye, Share2, History, Lock, Info, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import DocumentForm from '../../components/forms/DocumentForm';
import useModal from '../../hooks/useModal';

export default function Resources() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error adding resource:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const resources = [
    {
      id: 1,
      title: 'Employee Handbook',
      category: 'Policies',
      department: 'All',
      lastUpdated: '2024-03-10',
      status: 'Active',
      size: '2.4 MB',
      description: 'Comprehensive guide to company policies, procedures, and employee expectations.',
      version: '2.1',
      author: 'HR Department',
      created: '2023-12-01',
      format: 'PDF',
      tags: ['Policy', 'HR', 'Guidelines', 'Procedures'],
      accessLevel: 'All Employees',
      permissions: {
        view: ['All Employees'],
        edit: ['HR Team', 'Management'],
        delete: ['HR Director']
      },
      revisions: [
        { version: '2.1', date: '2024-03-10', author: 'Sarah Chen', notes: 'Updated remote work policy' },
        { version: '2.0', date: '2024-01-15', author: 'Mike Thompson', notes: 'Annual review and updates' }
      ],
      relatedDocs: [
        { id: 4, title: 'Code of Conduct' },
        { id: 5, title: 'Benefits Guide' }
      ],
      review: {
        lastReview: '2024-03-10',
        nextReview: '2024-09-10',
        reviewers: ['HR Director', 'Legal Team']
      }
    }
  ];

  const filteredResources = activeFilter === 'all' 
    ? resources 
    : resources.filter(resource => {
        if (activeFilter === 'active') {
          return resource.status === 'Active';
        } else if (activeFilter === 'review') {
          return resource.status === 'Under Review';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Resources</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Resource"
      >
        <DocumentForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Resource</div>
          <div>Category</div>
          <div>Department</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredResources.map(resource => (
          <React.Fragment key={resource.id}>
            <div 
              className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === resource.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(resource.id)}
            >
              <div className="col-span-2 flex items-center">
                <FileText className="w-5 h-5 text-mono-400 mr-2" />
                <div>
                  <div className="font-medium text-mono-900">{resource.title}</div>
                  <div className="text-sm text-mono-500">Version {resource.version} · {resource.size}</div>
                </div>
              </div>
              <div className="text-mono-600">{resource.category}</div>
              <div className="text-mono-600">{resource.department}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  resource.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {resource.status}
                </span>
              </div>
              <div className="flex justify-end">
                {expandedId === resource.id ? (
                  <ChevronUp className="w-5 h-5 text-mono-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-mono-400" />
                )}
              </div>
            </div>

            {expandedId === resource.id && (
              <div className="col-span-6 bg-mono-50 p-6 border-b">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Resource Information</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-mono-600 mb-4">{resource.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Details</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-mono-500">Format:</span>
                                <span className="text-sm text-mono-900">{resource.format}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-mono-500">Created:</span>
                                <span className="text-sm text-mono-900">{resource.created}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-mono-500">Author:</span>
                                <span className="text-sm text-mono-900">{resource.author}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mono-100 text-mono-800"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Revision History</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Version</div>
                          <div>Date</div>
                          <div>Author</div>
                          <div>Notes</div>
                        </div>
                        {resource.revisions.map((revision, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{revision.version}</div>
                            <div className="text-sm text-mono-600">{revision.date}</div>
                            <div className="text-sm text-mono-600">{revision.author}</div>
                            <div className="text-sm text-mono-600">{revision.notes}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Related Resources</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="space-y-2">
                          {resource.relatedDocs.map((doc) => (
                            <div key={doc.id} className="flex items-center">
                              <Link2 className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-accent hover:underline cursor-pointer">{doc.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Access Control</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium text-mono-700 mb-2">View Access</h4>
                          <div className="flex flex-wrap gap-2">
                            {resource.permissions.view.map((group, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Eye className="w-3 h-3 mr-1" />
                                {group}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-mono-700 mb-2">Edit Access</h4>
                          <div className="flex flex-wrap gap-2">
                            {resource.permissions.edit.map((group, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FileText className="w-3 h-3 mr-1" />
                                {group}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-mono-700 mb-2">Delete Access</h4>
                          <div className="flex flex-wrap gap-2">
                            {resource.permissions.delete.map((group, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Lock className="w-3 h-3 mr-1" />
                                {group}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Review Schedule</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <History className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Last Review:</span>
                          <span className="text-sm text-mono-900">{resource.review.lastReview}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Next Review:</span>
                          <span className="text-sm text-mono-900">{resource.review.nextReview}</span>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500">Reviewers:</span>
                          </div>
                          <div className="pl-6">
                            {resource.review.reviewers.map((reviewer, index) => (
                              <div key={index} className="text-sm text-mono-600">{reviewer}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <ActionButtons />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}