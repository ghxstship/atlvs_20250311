import React, { useState } from 'react';
import { Files, UploadCloud, Download, ChevronDown, ChevronUp, FileText, FileImage, FileSpreadsheet, File, Calendar, Users, Clock, Tag, Link2, Eye, Plus, Share2 } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import FileForm from '../../components/forms/FileForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';

export default function ProjectFiles() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf': return <File className="w-5 h-5 text-red-500 mr-2" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <FileImage className="w-5 h-5 text-blue-500 mr-2" />;
      case 'xlsx':
      case 'csv': return <FileSpreadsheet className="w-5 h-5 text-green-500 mr-2" />;
      case 'docx':
      case 'doc': return <FileText className="w-5 h-5 text-blue-500 mr-2" />;
      default: return <FileText className="w-5 h-5 text-gray-400 mr-2" />;
    }
  };

  // Mock files data
  const files = [
    {
      id: 1,
      name: 'Stage Layout Plan.pdf',
      project: 'Summer Music Festival',
      category: 'Technical Documents',
      uploadedBy: 'Alex Thompson',
      uploadDate: '2024-03-10',
      size: '2.4 MB',
      description: 'Detailed stage layout and dimensions for the main performance area.',
      version: '1.2',
      status: 'Approved',
      tags: ['Stage', 'Technical', 'Layout', 'Production'],
      collaborators: [
        { name: 'Sarah Chen', role: 'Stage Manager' },
        { name: 'Mike Wilson', role: 'Technical Director' }
      ],
      revisions: [
        { version: '1.2', date: '2024-03-10', author: 'Alex Thompson', notes: 'Updated dimensions' },
        { version: '1.1', date: '2024-03-05', author: 'Sarah Chen', notes: 'Added safety zones' }
      ],
      relatedFiles: [
        { name: 'Equipment List.xlsx', id: 2 },
        { name: 'Safety Guidelines.pdf', id: 3 }
      ],
      permissions: {
        view: ['Production Team', 'Technical Team'],
        edit: ['Technical Director', 'Stage Manager'],
        delete: ['Project Manager']
      },
      metadata: {
        software: 'AutoCAD 2024',
        scale: '1:100',
        pageCount: 4,
        lastPrinted: '2024-03-11'
      },
      comments: [
        { 
          author: 'Mike Wilson',
          date: '2024-03-10',
          text: 'Please verify the loading dock dimensions'
        },
        {
          author: 'Sarah Chen',
          date: '2024-03-09',
          text: 'Added emergency exit routes'
        }
      ]
    }
  ];

  const filteredFiles = activeFilter === 'all' 
    ? files 
    : files.filter(file => {
        if (activeFilter === 'documents') {
          return file.category === 'Technical Documents';
        } else if (activeFilter === 'images') {
          return file.name.match(/\.(jpg|jpeg|png|gif)$/i);
        } else if (activeFilter === 'spreadsheets') {
          return file.name.match(/\.(xlsx|csv)$/i);
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Project Files</h1>
        <button 
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload Files
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Upload Files"
      >
        <FileForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">File Name</div>
          <div>Project</div>
          <div>Category</div>
          <div>Size</div>
          <div></div>
        </div>
        
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <React.Fragment key={file.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === file.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(file.id)}
              >
                <div className="col-span-2 flex items-center">
                  {getFileIcon(file.name)}
                  <div>
                    <div className="font-medium text-mono-900">{file.name}</div>
                    <div className="text-sm text-mono-500">Version {file.version} · {file.uploadDate}</div>
                  </div>
                </div>
                <div className="text-mono-600">{file.project}</div>
                <div className="text-mono-600">{file.category}</div>
                <div className="text-mono-600">{file.size}</div>
                <div className="flex justify-end">
                  {expandedId === file.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === file.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">File Description</h3>
                        <p className="text-sm text-mono-600">{file.description}</p>
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
                          {file.revisions.map((revision, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{revision.version}</div>
                              <div className="text-sm text-mono-600">{revision.date}</div>
                              <div className="text-sm text-mono-600">{revision.author}</div>
                              <div className="text-sm text-mono-600">{revision.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Comments</h3>
                        <div className="space-y-4">
                          {file.comments.map((comment, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-mono-900">{comment.author}</span>
                                <span className="text-xs text-mono-500">{comment.date}</span>
                              </div>
                              <p className="text-sm text-mono-600">{comment.text}</p>
                            </div>
                          ))}
                          <button className="flex items-center text-sm text-mono-600 hover:text-accent">
                            <Plus className="w-4 h-4 mr-1" />
                            Add comment
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">File Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Uploaded by:</span>
                            <span className="text-sm text-mono-900">{file.uploadedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Upload date:</span>
                            <span className="text-sm text-mono-900">{file.uploadDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Status:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              file.status === 'Approved' ? 'bg-green-100  text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {file.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Collaborators</h3>
                        <div className="space-y-2">
                          {file.collaborators.map((collaborator, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-mono-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-mono-600">
                                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-mono-900">{collaborator.name}</p>
                                  <p className="text-xs text-mono-500">{collaborator.role}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Related Files</h3>
                        <div className="space-y-2">
                          {file.relatedFiles.map((relatedFile) => (
                            <div key={relatedFile.id} className="flex items-center">
                              <Link2 className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-accent hover:underline cursor-pointer">{relatedFile.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Technical Details</h3>
                        <div className="space-y-2">
                          {Object.entries(file.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-mono-500 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-sm text-mono-900">{value}</span>
                            </div>
                          ))}
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
          ))
        ) : (
          <EmptyState
            icon={Files}
            title="No files found"
            message={
              activeFilter === 'all' 
                ? "No files have been uploaded yet."
                : "No files found matching the selected filter."
            }
            action={{
              label: "Upload Files",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}