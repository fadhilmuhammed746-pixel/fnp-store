import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Flame,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Category } from '../../types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { useToast } from '../../components/common/Toast';

export const AdminProducts: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      if (cats.length > 0 && !category) {
        setCategory(cats[0].name);
      }
    } catch (err) {
      console.error('Failed to load products list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategory(categories[0]?.name || 'Watches');
    setPrice(4999);
    setSalePrice(0);
    setStock(15);
    setShortDescription('');
    setDescription('');
    setImages(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']);
    setFeatured(false);
    setTrending(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategory(prod.category);
    setPrice(prod.price);
    setSalePrice(prod.salePrice || 0);
    setStock(prod.stock);
    setShortDescription(prod.shortDescription || '');
    setDescription(prod.description);
    setImages(prod.images.length > 0 ? prod.images : ['']);
    setFeatured(prod.featured || false);
    setTrending(prod.trending || false);
    setIsNewArrival(prod.isNewArrival || false);
    setIsBestSeller(prod.isBestSeller || false);
    setPublished(prod.published);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const matchedCat = categories.find(c => c.name.toLowerCase() === category.toLowerCase());
      const categorySlug = matchedCat ? matchedCat.slug : category.toLowerCase().replace(/\s+/g, '-');
      const validImages = images.filter(url => url.trim().length > 0);
      if (validImages.length === 0) {
        validImages.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: name.trim(),
          slug: slug.trim(),
          category,
          categorySlug,
          price: Number(price),
          salePrice: Number(salePrice) > 0 ? Number(salePrice) : undefined,
          stock: Number(stock),
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          images: validImages,
          featured,
          trending,
          isNewArrival,
          isBestSeller,
          published
        });
        showToast(`Updated product "${name}"!`, 'success');
      } else {
        await createProduct({
          name: name.trim(),
          slug: slug.trim(),
          category,
          categorySlug,
          price: Number(price),
          salePrice: Number(salePrice) > 0 ? Number(salePrice) : undefined,
          stock: Number(stock),
          shortDescription: shortDescription.trim(),
          description: description.trim(),
          images: validImages,
          featured,
          trending,
          isNewArrival,
          isBestSeller,
          published
        });
        showToast(`Created new product "${name}"!`, 'success');
      }

      setModalOpen(false);
      await fetchProductsList();
    } catch (err: any) {
      showToast(err?.message || 'Failed to save product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prodName}"?`)) {
      await deleteProduct(id);
      showToast(`Deleted product "${prodName}".`, 'info');
      await fetchProductsList();
    }
  };

  const handleTogglePublish = async (prod: Product) => {
    const newStatus = !prod.published;
    await updateProduct(prod.id, { published: newStatus });
    showToast(newStatus ? `Published "${prod.name}"` : `Unpublished "${prod.name}"`, 'info');
    await fetchProductsList();
  };

  // Filtered products
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.categorySlug === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Inventory Management</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Product Catalog</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Total of {products.length} registered products across all NextGen categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient flex items-center gap-2 shadow-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card bg-surface-card/60 border border-surface-border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#12121A] text-xs text-slate-100 placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#12121A] text-xs font-semibold text-slate-200 py-2 px-3 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12121A] text-slate-400 uppercase tracking-wider text-[11px] border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-purple-950/10 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.name} className="w-11 h-11 rounded-xl object-cover shrink-0 bg-[#12121A]" />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate max-w-xs">{prod.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {prod.trending && (
                            <span className="text-[10px] text-purple-400 font-semibold uppercase">Trending</span>
                          )}
                          {prod.featured && (
                            <span className="text-[10px] text-cyan-400 font-semibold uppercase">• Featured</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">{prod.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white">
                      ₹{(prod.salePrice || prod.price).toLocaleString('en-IN')}
                    </span>
                    {prod.salePrice && (
                      <span className="text-[10px] text-slate-500 line-through block">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-semibold ${prod.stock <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(prod)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        prod.published
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-white/5'
                      }`}
                    >
                      {prod.published ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                      <span>{prod.published ? 'Live' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-600/10 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete product"
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full glass-card bg-[#12121A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <h3 className="text-xl font-bold text-white">
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#0B0B0F] text-xs text-white font-mono px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Sale Price (₹ optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Available Stock Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Short Summary</label>
                <input
                  type="text"
                  placeholder="Single-sentence punchy overview"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Multiple Images Inputs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Product Images (URLs)</label>
                {images.map((imgUrl, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imgUrl}
                      onChange={(e) => {
                        const copy = [...images];
                        copy[i] = e.target.value;
                        setImages(copy);
                      }}
                      className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 font-mono"
                    />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="p-2 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setImages([...images, ''])}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  + Add Another Image URL
                </button>
              </div>

              {/* Feature Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded bg-surface-card accent-purple-600"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="rounded bg-surface-card accent-purple-600"
                  />
                  <span>Trending</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded bg-surface-card accent-purple-600"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded bg-surface-card accent-purple-600"
                  />
                  <span>Published</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient shadow-glow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
