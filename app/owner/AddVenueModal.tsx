'use client';

import { useState, useRef } from 'react';
import { createVenue } from './actions';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export function AddVenueModal({ trigger }: { trigger: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        category: 'TURF',
        imageUrl: '' // Will store comma-separated URLs
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await uploadFiles(Array.from(files));
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
            await uploadFiles(imageFiles);
        }
    };

    const uploadFiles = async (files: File[]) => {
        setSubmitting(true);
        let uploadedUrls: string[] = [];
        
        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (data.success) {
                    uploadedUrls.push(data.url);
                } else {
                    alert(`Upload failed for ${file.name}: ` + data.error);
                }
            } catch (error) {
                alert(`Failed to upload image ${file.name}`);
            }
        }
        
        if (uploadedUrls.length > 0) {
            setFormData(prev => ({ 
                ...prev, 
                imageUrl: prev.imageUrl ? `${prev.imageUrl},${uploadedUrls.join(',')}` : uploadedUrls.join(',')
            }));
        }
        setSubmitting(false);
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const urls = prev.imageUrl.split(',').filter(Boolean);
            urls.splice(index, 1);
            return { ...prev, imageUrl: urls.join(',') };
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert('Please select an image for the venue');
            return;
        }
        setSubmitting(true);
        const res = await createVenue({
            ...formData,
            price: Number(formData.price),
            ownerIds: [] // Will be set on the server
        });
        if (res.success) {
            setIsOpen(false);
            setFormData({ name: '', description: '', location: '', price: '', category: 'TURF', imageUrl: '' });
        } else {
            alert('Failed to create venue: ' + res.error);
        }
        setSubmitting(false);
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {trigger}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0">
                            <h2 className="font-display font-bold text-xl text-white">Add New Venue</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto w-full flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div className="md:col-span-3 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Venue Name</label>
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                        <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm h-28 resize-none focus:outline-none focus:border-blue-500 text-white" />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Location / Address</label>
                                            <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Price per hour (₹)</label>
                                            <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                            <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm border-r-8 border-transparent focus:outline-none focus:border-blue-500 text-white">
                                                <option value="TURF" className="bg-gray-900">TURF</option>
                                                <option value="HALL" className="bg-gray-900">HALL</option>
                                                <option value="LODGE" className="bg-gray-900">LODGE</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Venue Images</label>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        {formData.imageUrl.split(',').filter(Boolean).map((url, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                                <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={e => e.preventDefault()}
                                            onDrop={handleDrop}
                                            className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors relative overflow-hidden border-white/10 hover:border-white/20 bg-white/5`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 border border-white/10 text-gray-400">
                                                <Upload className="w-4 h-4" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-300">Add Image</p>
                                            <input 
                                                ref={fileInputRef}
                                                type="file" 
                                                accept="image/*" 
                                                multiple
                                                className="hidden" 
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-600">You can upload multiple SVG, PNG, JPG or WEBP images.</p>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {submitting ? 'Creating...' : 'Create Venue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
