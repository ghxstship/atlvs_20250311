import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../components/auth/AuthProvider';
import { supabase } from '../lib/supabase';
import { HelpCircle, MessageSquare, Phone, Mail, Upload, Loader2, Search, ChevronDown, ChevronUp } from 'lucide-react';

const supportTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  attachments: z.array(z.any()).optional()
});

type SupportTicketFormData = z.infer<typeof supportTicketSchema>;

const faqData = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. Follow the instructions sent to your email to create a new password.'
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Go to your Profile page by clicking on your avatar in the top right corner. From there, you can edit your personal information, upload a new profile picture, and update your preferences.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. For enterprise customers, we also support wire transfers and purchase orders.'
  },
  {
    question: 'How do I contact technical support?',
    answer: 'You can reach our technical support team by submitting a ticket through this support portal, or by emailing support@example.com. For urgent matters, please call our 24/7 support line.'
  },
  {
    question: 'What are your support hours?',
    answer: 'Our support team is available 24/7 for urgent issues. For non-urgent matters, our standard support hours are Monday through Friday, 9 AM to 6 PM Eastern Time.'
  }
];

export default function Support() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema)
  });

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: SupportTicketFormData) => {
    try {
      setIsSubmitting(true);

      // Upload attachments if any
      const attachmentUrls = [];
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('support-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('support-attachments')
          .getPublicUrl(filePath);

        attachmentUrls.push(publicUrl);
      }

      // Create support ticket
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id,
          subject: data.subject,
          category: data.category,
          description: data.description,
          priority: data.priority,
          attachments: attachmentUrls,
          status: 'open'
        });

      if (error) throw error;

      // Reset form
      reset();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-mono-900 mb-6">Submit a Ticket</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    placeholder="Brief description of your issue"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    placeholder="Please provide as much detail as possible"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Priority
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Attachments
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-mono-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-mono-400" />
                      <div className="flex text-sm text-mono-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
                          <span>Upload files</span>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-mono-500">
                        Up to 10 files (PDF, PNG, JPG)
                      </p>
                    </div>
                  </div>
                  {selectedFiles.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between py-1">
                          <span className="text-sm text-mono-600">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Ticket'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ and Contact Info */}
        <div className="space-y-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-mono-900 mb-4">Frequently Asked Questions</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                  <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="border border-mono-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-mono-900">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-mono-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-mono-400" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4">
                        <p className="text-mono-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-mono-900 mb-4">Contact Us</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-mono-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-mono-900">Live Chat</h3>
                    <p className="text-sm text-mono-500">Available 24/7 for immediate assistance</p>
                    <button className="mt-1 text-sm text-accent hover:text-accent-dark">
                      Start Chat
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-mono-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-mono-900">Phone Support</h3>
                    <p className="text-sm text-mono-500">Mon-Fri, 9 AM - 6 PM ET</p>
                    <a href="tel:+1-555-123-4567" className="mt-1 text-sm text-accent hover:text-accent-dark">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-mono-400 mt-1 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-mono-900">Email</h3>
                    <p className="text-sm text-mono-500">Response within 24 hours</p>
                    <a href="mailto:support@example.com" className="mt-1 text-sm text-accent hover:text-accent-dark">
                      support@example.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}