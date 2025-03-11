import React from 'react';
import { CheckCircle, Clock, X, AlertTriangle } from 'lucide-react';

interface Approver {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

interface ApprovalWorkflowProps {
  approvers: Approver[];
  currentStep: number;
  onApprove?: (approverId: string) => void;
  onReject?: (approverId: string, reason: string) => void;
}

export default function ApprovalWorkflow({
  approvers,
  currentStep,
  onApprove,
  onReject
}: ApprovalWorkflowProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-mono-900">Approval Workflow</h3>

      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-6 top-8 bottom-0 w-px bg-mono-200" />

        {/* Approval steps */}
        <div className="space-y-6">
          {approvers.map((approver, index) => (
            <div key={approver.id} className="relative flex items-start">
              {/* Status indicator */}
              <div className={`w-3 h-3 rounded-full ring-4 ring-white z-10 mt-2 ${
                approver.status === 'approved' ? 'bg-green-500' :
                approver.status === 'rejected' ? 'bg-red-500' :
                index === currentStep ? 'bg-blue-500' : 'bg-mono-300'
              }`} />

              {/* Approver details */}
              <div className="ml-8 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-mono-900">{approver.name}</h4>
                    <p className="text-sm text-mono-500">{approver.role}</p>
                  </div>

                  <div className="flex items-center">
                    {approver.status === 'approved' && (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                        {approver.timestamp && (
                          <span className="ml-2 text-mono-500">
                            {new Date(approver.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    )}
                    {approver.status === 'rejected' && (
                      <span className="flex items-center text-red-600 text-sm">
                        <X className="w-4 h-4 mr-1" />
                        Rejected
                        {approver.timestamp && (
                          <span className="ml-2 text-mono-500">
                            {new Date(approver.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    )}
                    {approver.status === 'pending' && (
                      <span className="flex items-center text-mono-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Comments */}
                {approver.comment && (
                  <div className="mt-2 text-sm text-mono-600 bg-mono-50 rounded-lg p-3">
                    {approver.comment}
                  </div>
                )}

                {/* Action buttons for current step */}
                {index === currentStep && approver.status === 'pending' && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => onApprove?.(approver.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject?.(approver.id, '')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy reminders */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Approval Reminders</h4>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              <li>Verify all travel details before approval</li>
              <li>Check compliance with travel policy</li>
              <li>Ensure budget availability</li>
              <li>Review any policy exceptions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}