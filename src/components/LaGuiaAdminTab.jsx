import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Edit3,
  UploadCloud,
  Save,
  Phone,
  Mail,
  Globe,
  Instagram,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { optimizeImage, uploadAffiliateImageToStorage } from '../lib/imageOptimizer';
import {
  DEFAULT_GUIDE_CATEGORIES,
  fetchGuideCatalog,
  saveGuideCategories,
  saveGuideProviders,
  subscribeToGuideRealtime,
} from '../lib/guideCatalogSync';

export function LaGuiaAdminTab() {
  const [categories, setCategories] = useState(DEFAULT_GUIDE_CATEGORIES);
  const [providers, setProviders] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [statusMessage, setStatusMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Category edit modal/inline state
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [catTitleInput, setCatTitleInput] = useState('');
  const [catImageInput, setCatImageInput] = useState('');
  const catFileRef = useRef(null);

  // Provider form state
  const [isProviderFormOpen, setIsProviderFormOpen] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState(null);
  const [provForm, setProvForm] = useState({
    categoryId: 'restaurantes',
    name: '',
    photo: '',
    phone: '',
    email: '',
    instagram: '',
    website: '',
    location: '',
  });
  const provFileRef = useRef(null);

  useEffect(() => {
    fetchGuideCatalog().then(({ categories: cats, providers: provs }) => {
      if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
      if (Array.isArray(provs)) setProviders(provs);
    });

    const unsubscribe = subscribeToGuideRealtime(({ categories: cats, providers: provs }) => {
      if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
      if (Array.isArray(provs)) setProviders(provs);
    });

    return () => unsubscribe();
  }, []);

  const flashSuccess = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // --- Category photo / title editing ---
  const openEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCatTitleInput(cat.title);
    setCatImageInput(cat.image || '');
  };

  const handleCatPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategoryId) return;
    setIsUploadingPhoto(true);
    try {
      const opt = await optimizeImage(file, {
        maxWidth: 1000,
        maxHeight: 750,
        quality: 0.82,
        preferredFormat: 'image/webp',
      });
      const res = await uploadAffiliateImageToStorage(
        opt.blob,
        `guide-cat-${editingCategoryId}`,
        0,
        opt.dataUrl
      );
      setCatImageInput(res.url || opt.dataUrl);
    } catch (err) {
      alert('No se pudo procesar la foto de la sección.');
    } finally {
      setIsUploadingPhoto(false);
      if (catFileRef.current) catFileRef.current.value = '';
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!editingCategoryId) return;
    const updated = categories.map((c) =>
      c.id === editingCategoryId
        ? { ...c, title: catTitleInput.trim() || c.title, image: catImageInput.trim() || c.image }
        : c
    );
    setCategories(updated);
    await saveGuideCategories(updated);
    setEditingCategoryId(null);
    flashSuccess('Sección de La Guía actualizada y sincronizada en tiempo real.');
  };

  // --- Provider CRUD ---
  const openNewProvider = () => {
    setEditingProviderId(null);
    setProvForm({
      categoryId: selectedCategoryId !== 'all' ? selectedCategoryId : categories[0]?.id || 'restaurantes',
      name: '',
      photo: '',
      phone: '',
      email: '',
      instagram: '',
      website: '',
      location: '',
    });
    setIsProviderFormOpen(true);
  };

  const openEditProvider = (prov) => {
    setEditingProviderId(prov.id);
    setProvForm({
      categoryId: prov.categoryId || 'restaurantes',
      name: prov.name || '',
      photo: prov.photo || '',
      phone: prov.phone || '',
      email: prov.email || '',
      instagram: prov.instagram || '',
      website: prov.website || '',
      location: prov.location || '',
    });
    setIsProviderFormOpen(true);
  };

  const handleProviderPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const opt = await optimizeImage(file, {
        maxWidth: 1000,
        maxHeight: 750,
        quality: 0.80,
        preferredFormat: 'image/webp',
      });
      const res = await uploadAffiliateImageToStorage(
        opt.blob,
        `guide-prov-${Date.now()}`,
        0,
        opt.dataUrl
      );
      setProvForm((prev) => ({ ...prev, photo: res.url || opt.dataUrl }));
    } catch (err) {
      alert('Error al cargar la foto del prestador.');
    } finally {
      setIsUploadingPhoto(false);
      if (provFileRef.current) provFileRef.current.value = '';
    }
  };

  const handleSaveProvider = async (e) => {
    e.preventDefault();
    if (!provForm.name.trim()) return;

    let updated;
    if (editingProviderId) {
      updated = providers.map((p) =>
        p.id === editingProviderId ? { ...p, ...provForm, updated_at: new Date().toISOString() } : p
      );
    } else {
      const newEntry = {
        ...provForm,
        id: `prov-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      updated = [newEntry, ...providers];
    }

    setProviders(updated);
    await saveGuideProviders(updated);
    setIsProviderFormOpen(false);
    setEditingProviderId(null);
    flashSuccess('Prestador guardado en Supabase y publicado en tiempo real en La Guía.');
  };

  const handleDeleteProvider = async (provId, name) => {
    if (!window.confirm(`¿Deseas eliminar a "${name}" de La Guía?`)) return;
    const updated = providers.filter((p) => p.id !== provId);
    setProviders(updated);
    await saveGuideProviders(updated);
    flashSuccess('Prestador eliminado de La Guía.');
  };

  const filteredProviders =
    selectedCategoryId === 'all'
      ? providers
      : providers.filter((p) => p.categoryId === selectedCategoryId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Gestión en Tiempo Real • Portada Pública</span>
          </div>
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
            La Guía del Visitante
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Personaliza las 8 secciones de portada y agrega prestadores de servicios (afiliados o no afiliados) con su ficha básica: nombre, 1 foto, contacto, redes sociales y web.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewProvider}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Prestador</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Part 1: 8 Secciones de La Guía */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="font-playfair font-bold text-lg text-slate-900">
              Secciones de Portada (8 Categorías)
            </h4>
            <p className="text-xs text-slate-500">
              Haz clic en una categoría para filtrar sus prestadores o en el lápiz para cambiar su foto/título.
            </p>
          </div>
          {selectedCategoryId !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Ver todas las categorías ({providers.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = providers.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                className={`rounded-2xl border p-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C85A32] bg-[#FAF3EB] shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:border-amber-300'
                }`}
                onClick={() => setSelectedCategoryId(isSelected ? 'all' : cat.id)}
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 mb-2">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditCategory(cat);
                    }}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 shadow-xs"
                    title="Editar título o foto de esta sección"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900 truncate">{cat.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shrink-0">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inline Category Edit Box */}
        {editingCategoryId && (
          <form onSubmit={handleSaveCategory} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Editar Sección de La Guía
              </span>
              <button type="button" onClick={() => setEditingCategoryId(null)} className="text-slate-500 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título de la Sección</label>
                <input
                  type="text"
                  value={catTitleInput}
                  onChange={(e) => setCatTitleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Foto (URL o Subir)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={catImageInput}
                    onChange={(e) => setCatImageInput(e.target.value)}
                    placeholder="https://... o /images/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  <input ref={catFileRef} type="file" accept="image/*" className="hidden" onChange={handleCatPhotoUpload} />
                  <button
                    type="button"
                    onClick={() => catFileRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? '...' : 'Subir'}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Sección</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Part 2: Lista de Prestadores */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-playfair font-bold text-lg text-slate-900">
            Prestadores Registrados ({filteredProviders.length})
          </h4>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">
              No hay prestadores cargados en esta selección. Haz clic en <strong>Agregar Prestador</strong> para crear la primera ficha básica.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((prov) => {
              const catObj = categories.find((c) => c.id === prov.categoryId);
              return (
                <div key={prov.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] bg-slate-200">
                      <img
                        src={prov.photo || catObj?.image || '/images/merida_hero_gastronomica.jpg'}
                        alt={prov.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold">
                        {catObj?.title || prov.categoryId}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h5 className="font-playfair font-bold text-base text-slate-900">{prov.name}</h5>
                      {prov.location && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C85A32]" />
                          <span>{prov.location}</span>
                        </p>
                      )}
                      <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                        {prov.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{prov.phone}</span>
                          </div>
                        )}
                        {prov.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{prov.email}</span>
                          </div>
                        )}
                        {prov.instagram && (
                          <div className="flex items-center gap-1.5">
                            <Instagram className="w-3 h-3 text-slate-400" />
                            <span>{prov.instagram}</span>
                          </div>
                        )}
                        {prov.website && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{prov.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProvider(prov)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProvider(prov.id, prov.name)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Agregar / Editar Prestador */}
      {isProviderFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-playfair font-bold text-xl text-slate-900">
                {editingProviderId ? 'Editar Prestador' : 'Agregar Prestador a La Guía'}
              </h4>
              <button type="button" onClick={() => setIsProviderFormOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProvider} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sección de La Guía *</label>
                <select
                  value={provForm.categoryId}
                  onChange={(e) => setProvForm({ ...provForm, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Empresa / Prestador *</label>
                <input
                  type="text"
                  required
                  value={provForm.name}
                  onChange={(e) => setProvForm({ ...provForm, name: e.target.value })}
                  placeholder="Ej. Hotel Belensate / Transfers Mérida"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1 Foto del Establecimiento</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={provForm.photo}
                    onChange={(e) => setProvForm({ ...provForm, photo: e.target.value })}
                    placeholder="Pega una URL o sube una foto"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  />
                  <input ref={provFileRef} type="file" accept="image/*" className="hidden" onChange={handleProviderPhotoUpload} />
                  <button
                    type="button"
                    onClick={() => provFileRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <UploadCloud className="w-4 h-4 text-amber-400" />
                    <span>{isUploadingPhoto ? 'Subiendo...' : 'Subir Foto'}</span>
                  </button>
                </div>
                {provForm.photo && (
                  <img src={provForm.photo} alt="Vista previa" className="mt-2 h-28 w-full object-cover rounded-xl border border-slate-200" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={provForm.phone}
                    onChange={(e) => setProvForm({ ...provForm, phone: e.target.value })}
                    placeholder="+58 414-0000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={provForm.email}
                    onChange={(e) => setProvForm({ ...provForm, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram / RRSS</label>
                  <input
                    type="text"
                    value={provForm.instagram}
                    onChange={(e) => setProvForm({ ...provForm, instagram: e.target.value })}
                    placeholder="@usuario"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Página Web</label>
                  <input
                    type="text"
                    value={provForm.website}
                    onChange={(e) => setProvForm({ ...provForm, website: e.target.value })}
                    placeholder="https://www.ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación / Sector (Opcional)</label>
                <input
                  type="text"
                  value={provForm.location}
                  onChange={(e) => setProvForm({ ...provForm, location: e.target.value })}
                  placeholder="Ej. Av. Las Américas / El Valle / Páramo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsProviderFormOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#b54d28] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Save className="w-4 h-4" />
                  <span>Guardar en La Guía</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
