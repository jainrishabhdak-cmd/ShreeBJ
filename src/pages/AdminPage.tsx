import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { translations } from '../translations';
import { Product, ProductCategory, AuditLog } from '../types';
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  Shield,
  Settings,
  Database,
  TrendingUp,
  History,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { language, adminToken, loginAdmin, logoutAdmin, settings, products, refreshData, setCurrentPage } = useStore();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'rates' | 'audit' | 'password'>('products');
  
  // Login Form State
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Settings Edit State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Products Management State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminToken) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setUploadingImage(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            filename: file.name,
            dataUrl: base64Data
          })
        });

        const data = await res.json();
        if (!res.ok) {
          setUploadError(data.error || 'Failed to upload image');
        } else {
          setEditingProduct((prev) => (prev ? { ...prev, image: data.url } : null));
        }
      } catch {
        setUploadError('Network error uploading image');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Password Change State
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    if (adminToken && activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [adminToken, activeTab]);

  const fetchAuditLogs = async () => {
    if (!adminToken) return;
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const logs = await res.json();
        setAuditLogs(logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    const res = await loginAdmin(passwordInput);
    setLoggingIn(false);

    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials or rate limit reached.');
    } else {
      setPasswordInput('');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setSettingsSaving(true);
    setSettingsSuccess('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settingsForm)
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save settings.');
      } else {
        await refreshData();
        setSettingsSuccess(language === 'hi' ? 'सेटिंग्स सफलतापूर्वक सहेजी गईं!' : 'Store settings updated and saved securely!');
        setTimeout(() => setSettingsSuccess(''), 4000);
      }
    } catch {
      alert('Network error while saving settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingProduct) return;
    setProductSaving(true);
    setProductMessage(null);

    const isEdit = Boolean(editingProduct.id);
    const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(editingProduct)
      });

      if (!res.ok) {
        const err = await res.json();
        setProductMessage({ text: err.error || 'Failed to save product', type: 'error' });
      } else {
        await refreshData();
        setProductMessage({
          text: isEdit ? 'Product updated successfully.' : 'New product created successfully.',
          type: 'success'
        });
        setEditingProduct(null);
      }
    } catch {
      setProductMessage({ text: 'Error connecting to server.', type: 'error' });
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    if (!adminToken) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await refreshData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch {
      alert('Error connecting to server.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setPwdSaving(true);
    setPwdMessage(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ currentPassword: pwdCurrent, newPassword: pwdNew })
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdMessage({ text: data.error || 'Failed to change password.', type: 'error' });
      } else {
        setPwdMessage({ text: 'Password updated successfully.', type: 'success' });
        setPwdCurrent('');
        setPwdNew('');
      }
    } catch {
      setPwdMessage({ text: 'Error connecting to server.', type: 'error' });
    } finally {
      setPwdSaving(false);
    }
  };

  // If NOT logged in, show secure login form
  if (!adminToken) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#14213D] border border-[#E5E4E2]/20 rounded-2xl p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-black/80 border border-[#D4AF75]/50 p-1 flex items-center justify-center mb-3">
              <Lock className="w-7 h-7 text-[#D4AF75]" />
            </div>
            <h1 className="font-display text-2xl font-bold">
              {language === 'hi' ? 'व्यवस्थापक प्रमाणीकरण' : 'Admin Security Portal'}
            </h1>
            <p className="text-xs text-[#E5E4E2]/70">
              {language === 'hi'
                ? 'श्री भेरूनाथ ज्वेलर्स सुरक्षित प्रबंधन प्रणाली'
                : 'Shree Bherunath Jewellers Secure Management Console'}
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#E5E4E2]/90 mb-1.5">
                {language === 'hi' ? 'व्यवस्थापक पासवर्ड' : 'Administrator Password'}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-[#E5E4E2]/25 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-[#E5E4E2]/40 focus:border-[#D4AF75] focus:outline-none"
              />
              <p className="text-[11px] text-[#E5E4E2]/50 mt-1">
                {language === 'hi' ? 'डिफ़ॉल्ट आरंभिक पासवर्ड: sbj-royal-2026' : 'Default initial store password: sbj-royal-2026'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 bg-[#D4AF75] hover:bg-[#e2930f] disabled:opacity-50 text-[#000000] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loggingIn ? 'Verifying...' : 'Access Console'}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs text-[#E5E4E2]/60 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged In Admin Console
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E4E2]/15">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF75] block mb-1">
            Authenticated Administration
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {settings.brandNameEn} Control Panel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className="px-3.5 py-1.5 bg-[#14213D] border border-[#E5E4E2]/20 hover:border-white text-xs font-medium text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-xs font-medium text-red-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#E5E4E2]/15 touch-scroll -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {[
          { key: 'products', label: 'Jewellery Products', icon: Database },
          { key: 'settings', label: 'Store Information & Contacts', icon: Settings },
          { key: 'rates', label: 'Bullion Benchmark Rates', icon: TrendingUp },
          { key: 'audit', label: 'Security & Audit Logs', icon: History },
          { key: 'password', label: 'Security Credentials', icon: KeyRound }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-[#D4AF75] text-[#000000] font-semibold shadow-md'
                  : 'bg-[#14213D] text-[#E5E4E2] hover:text-white border border-[#E5E4E2]/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Jewellery Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Inventory Catalog ({products.length} items)
            </h2>
            <button
              onClick={() =>
                setEditingProduct({
                  nameEn: '',
                  nameHi: '',
                  category: 'Gold Jewellery',
                  materialEn: '22K Gold (916 BIS Hallmarked)',
                  materialHi: '२२ कैरेट सोना (९१६ हॉलमार्क)',
                  purity: '22K (916 BIS)',
                  weight: '25.0 g',
                  dimensions: '',
                  price: null,
                  availability: 'In Stock',
                  isFeatured: false,
                  image: '/sbj-logo.jpg',
                  descriptionEn: '',
                  descriptionHi: ''
                })
              }
              className="px-4 py-2 bg-[#D4AF75] text-[#000000] text-xs font-semibold rounded-lg hover:bg-[#e2930f] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {productMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                productMessage.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-300 border border-red-500/30'
              }`}
            >
              {productMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{productMessage.text}</span>
            </div>
          )}

          {/* Add / Edit Product Form Drawer/Modal */}
          {editingProduct && (
            <div className="bg-[#14213D] border border-[#D4AF75]/40 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E4E2]/15">
                <h3 className="font-display text-base font-semibold text-white">
                  {editingProduct.id ? 'Edit Product' : 'Create New Product Entry'}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-[#E5E4E2]/60 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">English Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Hindi Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.nameHi || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameHi: e.target.value })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white font-hindi"
                  />
                </div>

                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Category</label>
                  <select
                    value={editingProduct.category || 'Gold Jewellery'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  >
                    <option value="Gold Jewellery">Gold Jewellery</option>
                    <option value="Silver Jewellery">Silver Jewellery</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Traditional Jewellery">Traditional Jewellery</option>
                    <option value="Bridal Jewellery">Bridal Jewellery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Purity Hallmark</label>
                  <input
                    type="text"
                    value={editingProduct.purity || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, purity: e.target.value })}
                    placeholder="e.g. 22K (916 BIS) or 92.5% Silver"
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Weight</label>
                  <input
                    type="text"
                    value={editingProduct.weight || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    placeholder="e.g. 42.5 g"
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Verified Price (INR)</label>
                  <input
                    type="number"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Leave empty for 'Price on Request'"
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  />
                  <span className="text-[10px] text-[#E5E4E2]/50">Leave empty to display "Price on Request"</span>
                </div>

                <div>
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Availability</label>
                  <select
                    value={editingProduct.availability || 'In Stock'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value as any })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  >
                    <option value="In Stock">In Stock (Ready in Showroom)</option>
                    <option value="Made to Order">Made to Order (Bespoke Handcrafted)</option>
                    <option value="Available on Request">Available on Request</option>
                  </select>
                </div>

                <div className="md:col-span-2 p-3.5 bg-black/40 rounded-xl border border-[#E5E4E2]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#E5E4E2]/90 font-medium">
                      Product Photograph (Upload from Device or Enter URL)
                    </label>
                    <span className="text-[10px] text-[#D4AF75]">PNG, JPG, WebP (Max 10MB)</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#D4AF75]/40 bg-black/70 flex items-center justify-center shrink-0">
                      {editingProduct.image ? (
                        <img
                          src={editingProduct.image}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[#E5E4E2]/40" />
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer px-3.5 py-1.5 bg-[#D4AF75] hover:bg-[#c49a55] text-[#0B0B0C] font-semibold rounded-md text-xs inline-flex items-center gap-1.5 transition-colors">
                          <UploadCloud className="w-4 h-4" />
                          <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image from Device'}</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/jpg"
                            disabled={uploadingImage}
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {uploadingImage && (
                          <span className="text-xs text-[#D4AF75] animate-pulse">Processing upload...</span>
                        )}
                      </div>

                      {uploadError && (
                        <p className="text-xs text-red-400">{uploadError}</p>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#E5E4E2]/60 whitespace-nowrap">Or Image URL:</span>
                        <input
                          type="text"
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          placeholder="/uploads/... or /sbj-logo.png"
                          className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">English Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.descriptionEn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionEn: e.target.value })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Hindi Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.descriptionHi || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descriptionHi: e.target.value })}
                    className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2 text-white font-hindi"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded border-[#E5E4E2]/20"
                  />
                  <label htmlFor="isFeatured" className="text-[#E5E4E2]/90 font-medium cursor-pointer">
                    Display in Featured Homepage Highlights
                  </label>
                </div>

                <div className="md:col-span-2 pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-[#E5E4E2]/20 text-[#E5E4E2] rounded hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={productSaving}
                    className="px-5 py-2 bg-[#D4AF75] text-[#000000] font-semibold rounded hover:bg-[#e2930f] flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{productSaving ? 'Saving...' : 'Save Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Mobile Product Cards View (< md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-[#14213D]/60 border border-[#E5E4E2]/15 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-lg bg-black/70 border border-[#D4AF75]/40 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={p.image}
                      alt={p.nameEn}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/sbj-logo.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-medium text-[#D4AF75] bg-[#D4AF75]/10 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      {p.isFeatured && (
                        <span className="text-[10px] text-amber-300 font-medium bg-amber-400/10 px-1.5 py-0.5 rounded">
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-sm mt-1 truncate">{p.nameEn}</h3>
                    <p className="text-xs text-[#E5E4E2]/60 font-hindi truncate">{p.nameHi}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#E5E4E2]/10">
                  <div>
                    <span className="text-[10px] text-[#E5E4E2]/50 block">Purity / Wt</span>
                    <span className="font-mono text-white text-xs">{p.purity}</span>
                    <span className="text-[10px] text-[#E5E4E2]/60 block">{p.weight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#E5E4E2]/50 block">Price / Status</span>
                    <span className="font-mono text-[#D4AF75] text-xs font-semibold block">
                      {p.price ? '₹' + p.price.toLocaleString('en-IN') : 'Price on Request'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">{p.availability}</span>
                  </div>
                </div>

                {/* Touch-Friendly Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className="min-h-[44px] px-3 py-2 bg-[#14213D] hover:bg-[#1a2d54] border border-[#D4AF75]/40 text-[#D4AF75] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id, p.nameEn)}
                    className="min-h-[44px] px-3 py-2 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Products Table (md and above) */}
          <div className="hidden md:block overflow-x-auto border border-[#E5E4E2]/15 rounded-xl bg-[#14213D]/40">
            <table className="w-full text-left text-xs text-[#E5E4E2]/90">
              <thead className="bg-[#14213D] text-[#E5E4E2]/70 uppercase tracking-wider text-[10px] border-b border-[#E5E4E2]/15">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Purity / Wt</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E2]/10">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-black/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{p.nameEn}</div>
                      <div className="text-[11px] text-[#E5E4E2]/60 font-hindi">{p.nameHi}</div>
                    </td>
                    <td className="py-3 px-4 text-[#D4AF75]">{p.category}</td>
                    <td className="py-3 px-4 font-mono">
                      <div>{p.purity}</div>
                      <div className="text-[10px] text-[#E5E4E2]/60">{p.weight}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {p.price ? '₹' + p.price.toLocaleString('en-IN') : (
                        <span className="text-[#E5E4E2]/50 italic">Price on Request</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-medium text-emerald-400">{p.availability}</span>
                      {p.isFeatured && (
                        <span className="block text-[10px] text-[#D4AF75]">★ Featured</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-2 rounded hover:bg-[#14213D] text-[#E5E4E2] hover:text-[#D4AF75]"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.nameEn)}
                          className="p-2 rounded hover:bg-red-950/60 text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Store Information & Contact Details */}
      {activeTab === 'settings' && (
        <div className="bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-white mb-1">
              Store Identity, Contact & Social Links
            </h2>
            <p className="text-xs text-[#E5E4E2]/70">
              Changes saved here update immediately across the website header, footer, contact page, and WhatsApp click-to-chat.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{settingsSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">WhatsApp Number (e.g. 919829012345)</label>
              <input
                type="text"
                required
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white font-mono"
              />
              <span className="text-[10px] text-[#E5E4E2]/50">Country code without + or spaces</span>
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Store Telephone (for tel: clicks)</label>
              <input
                type="text"
                required
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Physical Showroom Address (English)</label>
              <input
                type="text"
                required
                value={settingsForm.addressEn}
                onChange={(e) => setSettingsForm({ ...settingsForm, addressEn: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Physical Showroom Address (Hindi)</label>
              <input
                type="text"
                required
                value={settingsForm.addressHi}
                onChange={(e) => setSettingsForm({ ...settingsForm, addressHi: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white font-hindi"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Opening Hours (English)</label>
              <input
                type="text"
                value={settingsForm.openingHoursEn}
                onChange={(e) => setSettingsForm({ ...settingsForm, openingHoursEn: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Opening Hours (Hindi)</label>
              <input
                type="text"
                value={settingsForm.openingHoursHi}
                onChange={(e) => setSettingsForm({ ...settingsForm, openingHoursHi: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white font-hindi"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Instagram Profile URL</label>
              <input
                type="url"
                value={settingsForm.instagramUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Google Maps Directions Link</label>
              <input
                type="url"
                value={settingsForm.mapsUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, mapsUrl: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div className="md:col-span-2 pt-3 flex justify-end">
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-6 py-2.5 bg-[#D4AF75] text-[#000000] font-semibold rounded-lg hover:bg-[#e2930f] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{settingsSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Bullion Benchmark Rates */}
      {activeTab === 'rates' && (
        <div className="bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-white mb-1">
              Bullion Benchmark Rates Configuration
            </h2>
            <p className="text-xs text-[#E5E4E2]/70">
              Manage daily gold & silver rates displayed on the storefront ticker.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs max-w-xl">
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="liveRatesEnabled"
                checked={settingsForm.liveRatesEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, liveRatesEnabled: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="liveRatesEnabled" className="text-white font-medium cursor-pointer">
                Enable Live Rates Ticker on Website
              </label>
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">24K Pure Gold Rate (₹ per 10g)</label>
              <input
                type="number"
                value={settingsForm.gold24kRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, gold24kRate: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">22K Jewellery Gold Rate (₹ per 10g)</label>
              <input
                type="number"
                value={settingsForm.gold22kRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, gold22kRate: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Fine Silver Rate (₹ per 1kg)</label>
              <input
                type="number"
                value={settingsForm.silverRate}
                onChange={(e) => setSettingsForm({ ...settingsForm, silverRate: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Attribution Source</label>
              <input
                type="text"
                value={settingsForm.ratesSource}
                onChange={(e) => setSettingsForm({ ...settingsForm, ratesSource: e.target.value })}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-6 py-2.5 bg-[#D4AF75] text-[#000000] font-semibold rounded-lg hover:bg-[#e2930f] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{settingsSaving ? 'Updating...' : 'Update Bullion Rates'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Security & Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-white mb-1">
                Security & Action Audit Trail
              </h2>
              <p className="text-xs text-[#E5E4E2]/70">
                Immutable records of logins, product updates, rate alterations, and incoming customer inquiries.
              </p>
            </div>
            <button
              onClick={fetchAuditLogs}
              className="px-3 py-1.5 text-xs bg-[#14213D] border border-[#E5E4E2]/20 rounded hover:text-white"
            >
              Refresh Logs
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {loadingLogs ? (
              <p className="text-[#E5E4E2]/60">Loading audit records...</p>
            ) : auditLogs.length > 0 ? (
              auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-black/50 border border-[#E5E4E2]/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-mono text-[#D4AF75] text-[11px] mr-2">[{log.action}]</span>
                    <span className="text-[#E5E4E2]">{log.details}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#E5E4E2]/50 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[#E5E4E2]/60">No audit records found.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Change Admin Password */}
      {activeTab === 'password' && (
        <div className="bg-[#14213D]/40 border border-[#E5E4E2]/15 rounded-2xl p-6 sm:p-8 space-y-6 max-w-lg">
          <div>
            <h2 className="font-display text-lg font-semibold text-white mb-1">
              Change Security Password
            </h2>
            <p className="text-xs text-[#E5E4E2]/70">
              Passwords are salted and cryptographically hashed with scrypt.
            </p>
          </div>

          {pwdMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                pwdMessage.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-300 border border-red-500/30'
              }`}
            >
              <span>{pwdMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">Current Password</label>
              <input
                type="password"
                required
                value={pwdCurrent}
                onChange={(e) => setPwdCurrent(e.target.value)}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-[#E5E4E2]/90 mb-1 font-medium">New Password (Min 8 characters)</label>
              <input
                type="password"
                required
                minLength={8}
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                className="w-full bg-black/60 border border-[#E5E4E2]/20 rounded-md p-2.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={pwdSaving}
              className="px-5 py-2.5 bg-[#D4AF75] text-[#000000] font-semibold rounded-lg hover:bg-[#e2930f] transition-colors"
            >
              {pwdSaving ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
