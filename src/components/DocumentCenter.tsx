import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Upload, 
  Download, 
  Share2, 
  Trash2, 
  Search, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  X,
  FilePlus,
  FileSignature,
  Truck,
  Receipt,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { generatePDF, uploadDocument } from '../services/documentService';
import { cn } from '../lib/utils';
import { User } from '../types';

interface Document {
  id: string;
  name: string;
  type: 'proforma_invoice' | 'commercial_invoice' | 'packing_list' | 'freight_quotation' | 'other';
  url: string;
  rfqId?: string;
  shipmentId?: string;
  ownerId: string;
  sharedWith: string[];
  createdAt: any;
}

export function DocumentCenter({ user }: { user: User }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<Document['type']>('proforma_invoice');
  const [shareDocId, setShareDocId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'documents'),
      where('ownerId', '==', auth.currentUser.uid)
    );

    const qShared = query(
      collection(db, 'documents'),
      where('sharedWith', 'array-contains', auth.currentUser.uid)
    );

    const unsubOwn = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Document));
      setDocuments(prev => {
        const otherDocs = prev.filter(d => d.ownerId !== auth.currentUser?.uid);
        return [...docs, ...otherDocs].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      });
      setLoading(false);
    });

    const unsubShared = onSnapshot(qShared, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Document));
      setDocuments(prev => {
        const ownDocs = prev.filter(d => d.ownerId === auth.currentUser?.uid);
        return [...ownDocs, ...docs].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      });
    });

    // Fetch users for sharing
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(d => d.data() as User));
    });

    return () => {
      unsubOwn();
      unsubShared();
      unsubUsers();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDoc(doc(db, 'documents', id));
      } catch (e) {
        console.error('Failed to delete document', e);
      }
    }
  };

  const handleShare = async () => {
    if (!shareDocId || !shareEmail) return;
    const targetUser = users.find(u => u.email === shareEmail);
    if (!targetUser) {
      alert('User not found');
      return;
    }

    try {
      await updateDoc(doc(db, 'documents', shareDocId), {
        sharedWith: arrayUnion(targetUser.uid)
      });
      setShareDocId(null);
      setShareEmail('');
      alert('Document shared successfully');
    } catch (e) {
      console.error('Failed to share document', e);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Center</h1>
          <p className="text-slate-500">Manage, generate, and share your logistics documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button 
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Generate Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
          >
            <option value="all">All Types</option>
            <option value="proforma_invoice">Proforma Invoice</option>
            <option value="commercial_invoice">Commercial Invoice</option>
            <option value="packing_list">Packing List</option>
            <option value="freight_quotation">Freight Quotation</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-lg",
                  doc.type === 'proforma_invoice' ? "bg-blue-50 text-blue-600" :
                  doc.type === 'commercial_invoice' ? "bg-emerald-50 text-emerald-600" :
                  doc.type === 'packing_list' ? "bg-amber-50 text-amber-600" :
                  doc.type === 'freight_quotation' ? "bg-purple-50 text-purple-600" :
                  "bg-slate-50 text-slate-600"
                )}>
                  {doc.type === 'proforma_invoice' ? <Receipt className="w-6 h-6" /> :
                   doc.type === 'commercial_invoice' ? <FileSignature className="w-6 h-6" /> :
                   doc.type === 'packing_list' ? <Plus className="w-6 h-6" /> :
                   doc.type === 'freight_quotation' ? <Truck className="w-6 h-6" /> :
                   <FileText className="w-6 h-6" />}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setShareDocId(doc.id)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 truncate">{doc.name}</h3>
              <p className="text-xs text-slate-500 mb-4">
                {doc.type.replace('_', ' ').toUpperCase()} • {doc.createdAt?.toDate().toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400">
                  {doc.ownerId === auth.currentUser?.uid ? 'Owned by you' : 'Shared with you'}
                </span>
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  <Download className="w-4 h-4" />
                  View PDF
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No documents found</h3>
          <p className="text-slate-500">Start by generating or uploading a document</p>
        </div>
      )}

      {/* Generator Modal */}
      <AnimatePresence>
        {showGenerator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Generate New Document</h2>
                <button onClick={() => setShowGenerator(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <DocumentGenerator onComplete={() => setShowGenerator(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
                <button onClick={() => setShowUploader(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6">
                <DocumentUploader onComplete={() => setShowUploader(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareDocId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Share Document</h2>
                <button onClick={() => setShareDocId(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
                  <input 
                    type="email"
                    placeholder="Enter user email..."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button 
                  onClick={handleShare}
                  disabled={!shareEmail}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Share Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocumentGenerator({ onComplete }: { onComplete: () => void }) {
  const [type, setType] = useState<Document['type']>('proforma_invoice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<any>({
    customerName: '',
    customerAddress: '',
    reference: '',
    origin: '',
    destination: '',
    mode: 'Sea',
    items: [{ description: '', quantity: 1, unitPrice: 0, weight: 0, dimensions: '' }],
    freightCost: 0,
    customsCost: 0,
    insuranceCost: 0,
    otherCost: 0,
    freightDesc: 'Ocean Freight',
    customsDesc: 'Import Clearance',
    insuranceDesc: 'Marine Insurance',
    otherDesc: 'Handling Fees'
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, weight: 0, dimensions: '' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_: any, i: number) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const total = formData.items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0) + 
                    (formData.freightCost || 0) + (formData.customsCost || 0) + (formData.insuranceCost || 0) + (formData.otherCost || 0);
      
      const pdfBlob = await generatePDF(type, { ...formData, total });
      const fileName = `${type}_${formData.reference || Date.now()}.pdf`;
      await uploadDocument(pdfBlob, fileName, type);
      onComplete();
    } catch (e) {
      console.error('Failed to generate document', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="proforma_invoice">Proforma Invoice</option>
            <option value="commercial_invoice">Commercial Invoice</option>
            <option value="packing_list">Packing List</option>
            <option value="freight_quotation">Freight Quotation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reference Number</label>
          <input 
            type="text"
            required
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {(type === 'proforma_invoice' || type === 'commercial_invoice') && (
          <>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
              <input 
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Customer Address</label>
              <textarea 
                required
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-20"
              />
            </div>
          </>
        )}

        {(type === 'packing_list' || type === 'freight_quotation') && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origin</label>
              <input 
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input 
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {type === 'freight_quotation' && (
          <div className="col-span-2 grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <h4 className="col-span-2 text-sm font-semibold text-slate-900">Cost Breakdown</h4>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Freight Cost ($)</label>
              <input type="number" value={formData.freightCost} onChange={(e) => setFormData({ ...formData, freightCost: parseFloat(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Customs Cost ($)</label>
              <input type="number" value={formData.customsCost} onChange={(e) => setFormData({ ...formData, customsCost: parseFloat(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Insurance Cost ($)</label>
              <input type="number" value={formData.insuranceCost} onChange={(e) => setFormData({ ...formData, insuranceCost: parseFloat(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Other Cost ($)</label>
              <input type="number" value={formData.otherCost} onChange={(e) => setFormData({ ...formData, otherCost: parseFloat(e.target.value) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Items / Cargo Details</h3>
          <button type="button" onClick={handleAddItem} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
        {formData.items.map((item: any, index: number) => (
          <div key={index} className="p-4 border border-slate-100 rounded-xl space-y-3 relative group">
            <button 
              type="button" 
              onClick={() => handleRemoveItem(index)}
              className="absolute -top-2 -right-2 p-1 bg-white border border-slate-200 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">Description</label>
                <input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Qty</label>
                <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
              </div>
              {type !== 'packing_list' ? (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Unit Price ($)</label>
                  <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Weight (kg)</label>
                  <input type="number" value={item.weight} onChange={(e) => handleItemChange(index, 'weight', parseFloat(e.target.value))} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button 
        type="submit"
        disabled={isGenerating}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating PDF...
          </span>
        ) : 'Generate and Save PDF'}
      </button>
    </form>
  );
}

function DocumentUploader({ onComplete }: { onComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<Document['type']>('other');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadDocument(file, file.name, type);
      onComplete();
    } catch (e) {
      console.error('Failed to upload document', e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="proforma_invoice">Proforma Invoice</option>
            <option value="commercial_invoice">Commercial Invoice</option>
            <option value="packing_list">Packing List</option>
            <option value="freight_quotation">Freight Quotation</option>
            <option value="other">Other Document</option>
          </select>
        </div>

        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors group">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3 group-hover:text-indigo-500 transition-colors" />
          <p className="text-sm text-slate-600">
            {file ? <span className="text-indigo-600 font-medium">{file.name}</span> : 'Click or drag to upload document'}
          </p>
          <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG or PNG up to 10MB</p>
        </div>
      </div>

      <button 
        type="submit"
        disabled={!file || isUploading}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading...
          </span>
        ) : 'Upload Document'}
      </button>
    </form>
  );
}
