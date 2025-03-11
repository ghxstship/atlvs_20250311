import React, { useState } from 'react';
import { Camera, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, Eye, Download, Share2 } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import MediaForm from '../../components/forms/MediaForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Media() {
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
      console.error('Error uploading media:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock media items data
  const mediaItems = [
    {
      id: 1,
      title: 'Event Promo Video',
      type: 'video',
      event: 'Tech Conference 2024',
      size: '256 MB',
      uploadedAt: '2024-02-15',
      description: 'Official promotional video featuring keynote speakers and venue highlights.',
      duration: '2:45',
      resolution: '3840x2160',
      format: 'MP4',
      codec: 'H.264',
      bitrate: '25 Mbps',
      uploadedBy: 'Sarah Chen',
      lastModified: '2024-02-20 14:30',
      status: 'Published',
      url: 'https://example.com/videos/tech-conf-2024-promo',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      tags: ['Promo', '4K', 'Conference', 'Marketing'],
      usage: [
        { event: 'Tech Conference 2024', purpose: 'Social Media', date: '2024-02-21' },
        { event: 'Tech Conference 2024', purpose: 'Website Header', date: '2024-02-22' }
      ],
      permissions: {
        view: ['All Staff', 'Public'],
        edit: ['Marketing Team', 'Content Creators'],
        delete: ['Marketing Director']
      },
      metadata: {
        camera: 'Sony FX6',
        location: 'Main Conference Hall',
        editor: 'Mike Thompson',
        colorProfile: 'Rec.709'
      }
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => {
        switch (activeFilter) {
          case 'videos':
            return item.type === 'video';
          case 'images':
            return item.type === 'image';
          case 'audio':
            return item.type === 'audio';
          case 'documents':
            return item.type === 'document';
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Media Library</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search media..."
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
            Upload Media
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Upload Media"
      >
        <MediaForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-mono-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            All Media
          </button>
          <button
            onClick={() => setActiveFilter('videos')}
            className={`px-4 py-2 ${activeFilter === 'videos' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveFilter('images')}
            className={`px-4 py-2 ${activeFilter === 'images' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveFilter('audio')}
            className={`px-4 py-2 ${activeFilter === 'audio' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Audio
          </button>
          <button
            onClick={() => setActiveFilter('documents')}
            className={`px-4 py-2 ${activeFilter === 'documents' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Documents
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Name</div>
          <div>Type</div>
          <div>Event</div>
          <div>Size</div>
          <div></div>
        </div>
        
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <React.Fragment key={item.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === item.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Camera className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{item.title}</div>
                    <div className="text-sm text-mono-500">Uploaded: {item.uploadedAt}</div>
                  </div>
                </div>
                <div className="text-mono-600 capitalize">{item.type}</div>
                <div className="text-mono-600">{item.event}</div>
                <div className="text-mono-600">{item.size}</div>
                <div className="flex justify-end">
                  {expandedId === item.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === item.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Media Preview</h3>
                        <div className="aspect-video rounded-lg overflow-hidden bg-mono-100">
                          {item.type === 'video' && (
                            <img 
                              src={item.thumbnail} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <p className="mt-3 text-sm text-mono-600">{item.description}</p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Technical Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Specifications</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Duration:</span>
                                  <span className="text-sm text-mono-900">{item.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Resolution:</span>
                                  <span className="text-sm text-mono-900">{item.resolution}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Format:</span>
                                  <span className="text-sm text-mono-900">{item.format}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Codec:</span>
                                  <span className="text-sm text-mono-900">{item.codec}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Bitrate:</span>
                                  <span className="text-sm text-mono-900">{item.bitrate}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Metadata</h4>
                              <div className="space-y-2">
                                {Object.entries(item.metadata).map(([key, value]) => (
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
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Usage History</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Event</div>
                            <div>Purpose</div>
                            <div>Date</div>
                          </div>
                          {item.usage.map((usage, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{usage.event}</div>
                              <div className="text-sm text-mono-600">{usage.purpose}</div>
                              <div className="text-sm text-mono-600">{usage.date}</div>
                            </div>
                          ))}
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
                              {item.permissions.view.map((group, index) => (
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
                              {item.permissions.edit.map((group, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {group}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
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

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">File Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Uploaded by:</span>
                            <span className="text-sm text-mono-900">{item.uploadedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Upload date:</span>
                            <span className="text-sm text-mono-900">{item.uploadedAt}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last modified:</span>
                            <span className="text-sm text-mono-900">{item.lastModified}</span>
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
          ))
        ) : (
          <EmptyState
            icon={Camera}
            title="No media found"
            message={
              activeFilter === 'all' 
                ? "No media has been uploaded yet."
                : "No media found matching the selected filter."
            }
            action={{
              label: "Upload Media",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}