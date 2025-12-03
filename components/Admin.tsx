import React, { useState, useEffect } from 'react';
import { useData } from '../DataContext';
import { Project, Service } from '../types';
import { Plus, LayoutDashboard, LogOut, Edit2, Trash2, Save, X, Wrench, Key } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { signInWithEmail, signOutUser, updateAdminPassword, getCurrentSession, AdminUser } from '../lib/auth';

// Curated list of icon names that are safe to render (actual icon components, not utilities)
const SAFE_ICON_NAMES = [
  'Activity', 'Airplay', 'AlertCircle', 'AlertTriangle', 'AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight',
  'Anchor', 'Aperture', 'Archive', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Award',
  'BarChart', 'BarChart2', 'Battery', 'BatteryCharging', 'Bell', 'Bluetooth', 'Bold', 'Book', 'Bookmark',
  'Box', 'Briefcase', 'Building', 'Building2', 'Calendar', 'Camera', 'Cast', 'Check', 'CheckCircle',
  'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'Circle', 'Clipboard', 'Clock', 'Cloud',
  'Code', 'Coffee', 'Cog', 'Columns', 'Command', 'Compass', 'Container', 'Copy', 'CreditCard', 'Crop',
  'Database', 'Delete', 'Disc', 'DollarSign', 'Download', 'Droplet', 'Droplets', 'Edit', 'Edit2', 'Edit3',
  'ExternalLink', 'Eye', 'EyeOff', 'Facebook', 'FastForward', 'Feather', 'File', 'FileText', 'Film', 'Filter',
  'Flag', 'Folder', 'Frown', 'Gift', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest', 'Github', 'Globe',
  'Grid', 'Hammer', 'HardDrive', 'HardHat', 'Hash', 'Headphones', 'Heart', 'HelpCircle', 'Home', 'House',
  'Image', 'Inbox', 'Info', 'Instagram', 'Italic', 'Key', 'Layers', 'Layout', 'LayoutDashboard', 'LifeBuoy',
  'Link', 'Link2', 'Linkedin', 'List', 'Loader', 'Lock', 'LogIn', 'LogOut', 'Mail', 'Map', 'MapPin',
  'Maximize', 'Maximize2', 'Meh', 'Menu', 'MessageCircle', 'MessageSquare', 'Mic', 'MicOff', 'Minimize',
  'Minimize2', 'Minus', 'Monitor', 'Moon', 'MoreHorizontal', 'MoreVertical', 'Move', 'Music', 'Navigation',
  'Navigation2', 'Octagon', 'Package', 'Paperclip', 'Pause', 'PauseCircle', 'PenTool', 'Pencil', 'PencilRuler',
  'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded', 'PhoneIncoming', 'PhoneMissed', 'PhoneOff', 'PhoneOutgoing',
  'PieChart', 'Pin', 'Play', 'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket', 'Power', 'Printer',
  'Radio', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Rewind', 'RotateCcw', 'RotateCw', 'Rss', 'Ruler', 'Save',
  'Scissors', 'Search', 'Send', 'Server', 'Settings', 'Share', 'Share2', 'Shield', 'ShieldOff', 'ShoppingBag',
  'ShoppingCart', 'Shuffle', 'Sidebar', 'SkipBack', 'SkipForward', 'Slack', 'Slash', 'Sliders', 'Smartphone',
  'Smile', 'Speaker', 'Square', 'SquareGantt', 'Star', 'StopCircle', 'Sun', 'Sunrise', 'Sunset', 'Tablet',
  'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown', 'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Tool',
  'Trash', 'Trash2', 'Trello', 'TrendingDown', 'TrendingUp', 'Triangle', 'Truck', 'Tv', 'Twitter', 'Type',
  'Umbrella', 'Underline', 'Unlock', 'Upload', 'UploadCloud', 'User', 'UserCheck', 'UserMinus', 'UserPlus',
  'UserX', 'Users', 'Video', 'VideoOff', 'Voicemail', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Watch',
  'Wifi', 'WifiOff', 'Wind', 'Wrench', 'X', 'XCircle', 'XSquare', 'Youtube', 'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut'
];

// Helper component to render icons (URL or Lucide name)
const IconRenderer: React.FC<{ icon?: string; className?: string }> = ({ icon, className = 'w-6 h-6' }) => {
  if (!icon) return <Wrench className={className} />;
  
  // Check if it's a URL
  if (/^(https?:\/\/|data:)/i.test(icon)) {
    // For external URLs, use proxy on production to avoid CORS issues
    let imageUrl = icon;
    
    // Check if it's an external URL (not data URI) and we're in production
    if (/^https?:\/\//.test(icon) && typeof window !== 'undefined') {
      // On production (vercel), use the proxy endpoint
      const isProduction = window.location.hostname !== 'localhost' && 
                          window.location.hostname !== '127.0.0.1';
      
      if (isProduction) {
        imageUrl = `/api/proxy-icon?url=${encodeURIComponent(icon)}`;
      }
    }
    
    return (
      <img 
        src={imageUrl} 
        alt="icon" 
        className={className} 
        style={{ filter: 'brightness(0) saturate(100%) invert(28%) sepia(84%) saturate(1211%) hue-rotate(172deg) brightness(101%) contrast(101%)' }}
        onError={(e) => {
          // If proxy fails, try the original URL
          if ((e.target as HTMLImageElement).src !== icon) {
            (e.target as HTMLImageElement).src = icon;
          }
        }}
      />
    );
  }
  
  // Fall back to wrench for invalid icons
  return <Wrench className={className} />;
};

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePasswordStatus, setChangePasswordStatus] = useState('');
  const { projects, services, addProject, updateProject, deleteProject, addService, updateService, deleteService } = useData();

  // Check for existing session on mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setIsAuthenticated(true);
    }
  }, []);

  // Navigation helper
  const goHome = () => {
    window.location.hash = '';
  };

  // New Project State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    category: 'Residential',
    year: new Date().getFullYear().toString()
  });

  // New Service State
  const [newService, setNewService] = useState<Partial<Service>>({});

  // Edit states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service>>({});

  // Save status states
  const [savingProject, setSavingProject] = useState(false);
  const [savingService, setSavingService] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerTarget, setIconPickerTarget] = useState<'new' | 'edit'>('new');
  const [iconSearch, setIconSearch] = useState('');

  const openIconPicker = (target: 'new' | 'edit') => {
    setIconPickerTarget(target);
    setIconSearch('');
    setIconPickerOpen(true);
  };

  const selectIconFromLibrary = (iconUrl: string) => {
    if (iconPickerTarget === 'new') {
      setNewService(prev => ({ ...prev, icon: iconUrl }));
    } else {
      setEditingService(prev => ({ ...prev, icon: iconUrl }));
    }
    setIconPickerOpen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      if (!email || !code) {
        setLoginError('Please enter email and password');
        setIsLoggingIn(false);
        return;
      }

      const result = await signInWithEmail(email, code);

      if (result.success) {
        setCurrentUser(result.data as AdminUser);
        setIsAuthenticated(true);
      } else {
        setLoginError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError('An error occurred during login.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordStatus('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setChangePasswordStatus('❌ Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordStatus('❌ New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePasswordStatus('❌ New passwords do not match');
      return;
    }

    try {
      const result = await updateAdminPassword(
        currentUser?.email || email,
        currentPassword,
        newPassword
      );

      if (result.success) {
        setChangePasswordStatus('✅ Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          setShowChangePassword(false);
          setChangePasswordStatus('');
        }, 2000);
      } else {
        setChangePasswordStatus('❌ ' + result.error);
      }
    } catch (err: any) {
      setChangePasswordStatus('❌ Failed to update password');
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setEmail('');
    setCode('');
  };

  const handleImageUpload = async (file: File, isEdit: boolean = false) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      isEdit ? setUploadingEditImage(true) : setUploadingImage(true);

      // Convert file to base64 (client-side, no server needed)
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        
        // Update the appropriate state with the base64 image URL
        if (isEdit) {
          setEditingProject({ ...editingProject, image: base64String });
        } else {
          setNewProject({ ...newProject, image: base64String });
        }
        alert('Image uploaded successfully!');
        isEdit ? setUploadingEditImage(false) : setUploadingImage(false);
      };

      reader.onerror = () => {
        console.error('File read error');
        alert('Failed to read image file. Please try again.');
        isEdit ? setUploadingEditImage(false) : setUploadingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to process image. Please try again.');
      isEdit ? setUploadingEditImage(false) : setUploadingImage(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setSaveMessage('');
    
    try {
      // Validation
      if (!newProject.title?.trim()) {
        setSaveMessage('❌ Please enter a project title');
        setSavingProject(false);
        return;
      }
      if (!newProject.image?.trim()) {
        setSaveMessage('❌ Please upload or enter an image URL');
        setSavingProject(false);
        return;
      }
      if (!newProject.category) {
        setSaveMessage('❌ Please select a category');
        setSavingProject(false);
        return;
      }
      
      await addProject({
        id: Date.now().toString(),
        title: newProject.title!.trim(),
        year: newProject.year || '2025',
        category: newProject.category as any,
        location: (newProject.location || 'Kathmandu').trim(),
        image: newProject.image!.trim(),
        description: (newProject.description || '').trim()
      });
      setNewProject({ category: 'Residential', year: new Date().getFullYear().toString() });
      setSaveMessage('✅ Project added successfully!');
    } catch (error) {
      setSaveMessage('❌ Failed to add project. Please try again.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingService(true);
    setSaveMessage('');
    
    try {
      // Validation
      if (!newService.title?.trim()) {
        setSaveMessage('❌ Please enter a service title');
        setSavingService(false);
        return;
      }
      if (!newService.description?.trim()) {
        setSaveMessage('❌ Please enter a service description');
        setSavingService(false);
        return;
      }
      
      await addService({
        id: Date.now().toString(),
        title: newService.title!.trim(),
        description: newService.description!.trim(),
        icon: (newService.icon || '').trim() || null,
      });
      setNewService({});
      setSaveMessage('✅ Service added successfully!');
    } catch (error) {
      setSaveMessage('❌ Failed to add service. Please try again.');
    } finally {
      setSavingService(false);
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingProject(project);
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setEditingProject({});
  };

  const saveEditProject = async () => {
    setSavingProject(true);
    setSaveMessage('');
    
    try {
      // Validation
      if (!editingProjectId) return;
      
      if (!editingProject.title?.trim()) {
        setSaveMessage('❌ Please enter a project title');
        setSavingProject(false);
        return;
      }
      if (!editingProject.image?.trim()) {
        setSaveMessage('❌ Please upload or enter an image URL');
        setSavingProject(false);
        return;
      }
      
      await updateProject(editingProjectId, editingProject);
      setEditingProjectId(null);
      setEditingProject({});
      setSaveMessage('✅ Project updated successfully!');
    } catch (error) {
      setSaveMessage('❌ Failed to update project. Please try again.');
    } finally {
      setSavingProject(false);
    }
  };

  const startEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setEditingService(service);
  };

  const cancelEditService = () => {
    setEditingServiceId(null);
    setEditingService({});
  };

  const saveEditService = async () => {
    setSavingService(true);
    setSaveMessage('');
    
    try {
      // Validation
      if (!editingServiceId) return;
      
      if (!editingService.title?.trim()) {
        setSaveMessage('❌ Please enter a service title');
        setSavingService(false);
        return;
      }
      if (!editingService.description?.trim()) {
        setSaveMessage('❌ Please enter a service description');
        setSavingService(false);
        return;
      }
      
      await updateService(editingServiceId, editingService);
      setEditingServiceId(null);
      setEditingService({});
      setSaveMessage('✅ Service updated successfully!');
    } catch (error) {
      setSaveMessage('❌ Failed to update service. Please try again.');
    } finally {
      setSavingService(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-center text-brand-blue">Admin Login</h2>
          <p className="text-center text-gray-600 text-sm mb-6">S.R.B Engineering & Construction</p>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-800 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                disabled={isLoggingIn}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                disabled={isLoggingIn}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-brand-blue text-white p-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={goHome}
              className="w-full text-sm text-gray-600 hover:text-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 font-bold text-brand-blue text-xl">
          <LayoutDashboard /> SRB Admin
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowChangePassword(true)} className="flex items-center gap-1 text-gray-600 hover:text-brand-blue">
            <Key size={18} /> Change Password
          </button>
          <button onClick={goHome} className="text-gray-600 hover:text-brand-blue">View Site</button>
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:text-red-700">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
              <button onClick={() => { setShowChangePassword(false); setChangePasswordStatus(''); }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              
              {changePasswordStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  changePasswordStatus.includes('✅')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {changePasswordStatus}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowChangePassword(false); setChangePasswordStatus(''); }}
                  className="flex-1 border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-blue text-white p-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {saveMessage && (
        <div className={`max-w-7xl mx-auto px-6 ${saveMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
          <div className={`p-3 rounded ${saveMessage.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
            {saveMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Stats Preview */}
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-4">Current Stats (Auto-Calculated)</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-brand-blue">{projects.length}</div>
              <div className="text-xs text-gray-600">Total Projects</div>
            </div>
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-brand-blue">{projects.filter(p => p.category === 'Residential').length}</div>
              <div className="text-xs text-gray-600">Residential</div>
            </div>
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-brand-blue">{projects.filter(p => p.category === 'Commercial').length}</div>
              <div className="text-xs text-gray-600">Commercial</div>
            </div>
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-brand-blue">{services.length}</div>
              <div className="text-xs text-gray-600">Services</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Add Project */}
          <div className="bg-white p-6 rounded shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={20} /> Add New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Title</label>
                <input required type="text" className="w-full border p-2 rounded"
                  value={newProject.title || ''} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select className="w-full border p-2 rounded"
                    value={newProject.category}
                    onChange={e => setNewProject({ ...newProject, category: e.target.value as any })}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Steel/Prefab">Steel/Prefab</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year</label>
                  <input type="text" className="w-full border p-2 rounded"
                    value={newProject.year || ''} onChange={e => setNewProject({ ...newProject, year: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" className="w-full border p-2 rounded"
                  value={newProject.location || ''} onChange={e => setNewProject({ ...newProject, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, false);
                    }}
                    className="w-full border p-2 rounded text-sm"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <div className="text-sm text-blue-600">Uploading image...</div>
                  )}
                  {newProject.image && (
                    <div className="mt-2">
                      <img src={newProject.image} alt="Preview" className="w-full h-32 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => setNewProject({ ...newProject, image: '' })}
                        className="text-xs text-red-600 hover:underline mt-1"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Or enter image URL manually:
                  </div>
                  <input
                    type="text"
                    className="w-full border p-2 rounded text-sm"
                    placeholder="https://..."
                    value={newProject.image || ''}
                    onChange={e => setNewProject({ ...newProject, image: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="w-full border p-2 rounded"
                  value={newProject.description || ''} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
              </div>
              <button 
                type="button" 
                onClick={handleAddProject}
                disabled={savingProject}
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProject ? 'Saving...' : 'Add Project'}
              </button>
            </form>

            <div className="mt-8 border-t pt-4">
              <h4 className="font-bold text-sm text-gray-500 mb-2">Manage Projects ({projects.length})</h4>
              <div className="h-96 overflow-y-auto space-y-2">
                {projects.map(p => (
                  <div key={p.id}>
                    {editingProjectId === p.id ? (
                      // Edit Mode
                      <div className="p-3 bg-blue-50 rounded border-2 border-brand-blue space-y-2">
                        <input
                          type="text"
                          className="w-full border p-1 rounded text-sm"
                          value={editingProject.title || ''}
                          onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                          placeholder="Title"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="w-full border p-1 rounded text-sm"
                            value={editingProject.category}
                            onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })}>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Steel/Prefab">Steel/Prefab</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            className="w-full border p-1 rounded text-sm"
                            value={editingProject.year || ''}
                            onChange={e => setEditingProject({ ...editingProject, year: e.target.value })}
                            placeholder="Year"
                          />
                        </div>
                        <input
                          type="text"
                          className="w-full border p-1 rounded text-sm"
                          value={editingProject.location || ''}
                          onChange={e => setEditingProject({ ...editingProject, location: e.target.value })}
                          placeholder="Location"
                        />
                        <div className="space-y-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, true);
                            }}
                            className="w-full border p-1 rounded text-xs"
                            disabled={uploadingEditImage}
                          />
                          {uploadingEditImage && (
                            <div className="text-xs text-blue-600">Uploading...</div>
                          )}
                          {editingProject.image && (
                            <img src={editingProject.image} alt="Preview" className="w-full h-20 object-cover rounded border" />
                          )}
                          <input
                            type="text"
                            className="w-full border p-1 rounded text-xs"
                            value={editingProject.image || ''}
                            onChange={e => setEditingProject({ ...editingProject, image: e.target.value })}
                            placeholder="Or enter image URL"
                          />
                        </div>
                        <textarea
                          className="w-full border p-1 rounded text-sm"
                          value={editingProject.description || ''}
                          onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                          placeholder="Description"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEditProject}
                            disabled={savingProject}
                            className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                            <Save size={14} /> {savingProject ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditProject}
                            className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 flex items-center justify-center gap-1">
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="text-sm p-2 bg-gray-50 rounded flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-gray-500">{p.category} • {p.year}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditProject(p)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Service */}
          <div className="bg-white p-6 rounded shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus size={20} /> Add New Service</h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Title</label>
                <input required type="text" className="w-full border p-2 rounded"
                  value={newService.title || ''} onChange={e => setNewService({ ...newService, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required className="w-full border p-2 rounded h-32"
                  value={newService.description || ''} onChange={e => setNewService({ ...newService, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon (token or URL)</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openIconPicker('new')}
                    className="px-3 py-2 bg-gray-100 rounded border text-sm hover:bg-gray-200"
                  >
                    Pick from library
                  </button>
                  <div className="text-xs text-gray-500">(or enter URL below)</div>
                </div>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="(optional) enter image URL - or keep blank to use library token"
                  value={newService.icon || ''}
                  onChange={e => setNewService({ ...newService, icon: e.target.value })}
                />
                {newService.icon && /^(https?:\/\/|data:)/i.test(newService.icon) && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-10 h-10 p-1 rounded bg-white border">
                      <IconRenderer icon={newService.icon} />
                    </div>
                    <div className="text-xs text-gray-600 truncate">{newService.icon}</div>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={handleAddService}
                disabled={savingService}
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingService ? 'Saving...' : 'Add Service'}
              </button>
            </form>

            <div className="mt-8 border-t pt-4">
              <h4 className="font-bold text-sm text-gray-500 mb-2">Manage Services ({services.length})</h4>
              <div className="h-96 overflow-y-auto space-y-2">
                {services.map(s => (
                  <div key={s.id}>
                    {editingServiceId === s.id ? (
                      // Edit Mode
                      <div className="p-3 bg-blue-50 rounded border-2 border-brand-blue space-y-2">
                        <input
                          type="text"
                          className="w-full border p-1 rounded text-sm"
                          value={editingService.title || ''}
                          onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                          placeholder="Title"
                        />
                        <textarea
                          className="w-full border p-1 rounded text-sm"
                          value={editingService.description || ''}
                          onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                          placeholder="Description"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openIconPicker('edit')}
                              className="px-3 py-1 bg-gray-100 rounded border text-sm hover:bg-gray-200"
                            >
                              Pick from library
                            </button>
                            <div className="text-xs text-gray-500">(or keep URL below)</div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Or Icon URL</label>
                            <input
                              type="text"
                              className="w-full border p-1 rounded text-sm"
                              placeholder="https://... or data:image/..."
                              value={editingService.icon || ''}
                              onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                            />
                          </div>
                        </div>
                        {/* Preview for edit */}
                        {editingService.icon && /^(https?:\/\/|data:)/i.test(editingService.icon) && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-10 h-10 p-1 rounded bg-white border">
                              <IconRenderer icon={editingService.icon} />
                            </div>
                            <div className="text-xs text-gray-600 truncate">{editingService.icon}</div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={saveEditService}
                            disabled={savingService}
                            className="flex-1 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                            <Save size={14} /> {savingService ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditService}
                            className="flex-1 bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600 flex items-center justify-center gap-1">
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="text-sm p-2 bg-gray-50 rounded flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{s.title}</div>
                          <div className="text-xs text-gray-400 line-clamp-1">{s.description}</div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditService(s)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Icon URL picker modal */}
      {iconPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIconPickerOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Add Icon URL</h4>
              <button onClick={() => setIconPickerOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL</label>
                <input
                  type="text"
                  value={iconSearch}
                  onChange={e => setIconSearch(e.target.value)}
                  placeholder="https://example.com/icon.png or https://cdn.jsdelivr.net/npm/lucide@latest/icons/wrench.svg"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-2 font-semibold">Popular icon sources:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Lucide Icons: <code className="bg-white px-1 rounded">https://cdn.jsdelivr.net/npm/lucide@latest/icons/[icon-name].svg</code></li>
                  <li>• Heroicons: <code className="bg-white px-1 rounded">https://heroicons.dev/[icon-name].svg</code></li>
                  <li>• Upload any PNG/SVG image</li>
                </ul>
              </div>
              {iconSearch && (
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img 
                    src={iconSearch} 
                    alt="Icon preview" 
                    className="h-12 w-12 object-contain" 
                    style={{ filter: 'brightness(0) saturate(100%) invert(28%) sepia(84%) saturate(1211%) hue-rotate(172deg) brightness(101%) contrast(101%)' }}
                    onError={() => {}} 
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIconPickerOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (iconSearch.trim()) {
                      selectIconFromLibrary(iconSearch.trim());
                    }
                  }}
                  disabled={!iconSearch.trim()}
                  className="flex-1 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Add Icon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;