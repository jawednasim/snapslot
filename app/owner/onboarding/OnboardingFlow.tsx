'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPane } from '@/components/ui/GlassPane';
import { Check, ChevronRight, ChevronLeft, Building, MapPin, Image as ImageIcon, Settings, Clock, CreditCard, Rocket, UploadCloud } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Business Info', icon: Building },
  { id: 2, name: 'Location', icon: MapPin },
  { id: 3, name: 'Media', icon: ImageIcon },
  { id: 4, name: 'Configuration', icon: Settings },
  { id: 5, name: 'Slots & Pricing', icon: Clock },
  { id: 6, name: 'Payouts', icon: CreditCard },
  { id: 7, name: 'Review', icon: Rocket }
];

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '', email: '', phone: '', alternatePhone: '', password: '', 
    venueName: '', category: 'TURF', description: '',
    address: '', landmark: '', city: '', state: '', pincode: '', lat: '', lng: '',
    coverImage: '', gallery: [] as string[],
    size: '5v5', surface: 'Artificial Grass', sports: [] as string[], facilities: {} as Record<string, boolean>,
    openTime: '06:00', closeTime: '23:00', price: '',
    bankHolderName: '', accountNumber: '', ifscCode: '', upiId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFacilityChange = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: { ...prev.facilities, [facility]: !prev.facilities[facility] }
    }));
  };

  const handleSportChange = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport) 
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/owner/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/owner?onboarding=success');
      } else {
        alert('Failed to submit application.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred.');
    }
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Account & Business Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Owner Full Name</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="+91 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Alternate Number</label>
                <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="(Optional)" />
              </div>
            </div>
            
            <div className="border-t border-white/10 my-6"></div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Business/Venue Name</label>
                <input type="text" name="venueName" value={formData.venueName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Elite Sports Arena" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Business Type</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none">
                  <option value="TURF">Football/Cricket Turf</option>
                  <option value="COURT">Badminton Court</option>
                  <option value="HALL">Wedding Hall</option>
                  <option value="EVENT_VENUE">Event Venue</option>
                  <option value="LODGE">Lodge / Residency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Describe your venue and services..." />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Location Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Street, Building name..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Landmark</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Near metro station" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="123456" />
              </div>
            </div>
            <div className="w-full h-48 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-col gap-2">
                <MapPin className="w-8 h-8 text-blue-500" />
                <span className="text-gray-400">Interactive Map Preview (Simulated)</span>
                <button className="text-blue-400 text-sm hover:underline">Use Current Location</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Media Upload</h2>
            <p className="text-sm text-gray-400 mb-4">Upload high-quality images to attract more bookings. (Simulated functionality)</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Cover Image URL</label>
              <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 mb-3" placeholder="https://example.com/image.jpg" />
              <div className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center bg-white/[0.02]">
                <div className="text-center">
                    <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload cover image</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 1920x1080 (16:9)</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Venue Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Venue Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none">
                  <option value="5v5">5v5</option>
                  <option value="7v7">7v7</option>
                  <option value="9v9">9v9</option>
                  <option value="11v11">11v11</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Surface Type</label>
                <select name="surface" value={formData.surface} onChange={handleChange} className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none">
                  <option value="Artificial Grass">Artificial Grass</option>
                  <option value="Natural Grass">Natural Grass</option>
                  <option value="Indoor Court - Wooden">Indoor Court - Wooden</option>
                  <option value="Indoor Court - Synthetic">Indoor Court - Synthetic</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-white mb-3">Sports Supported</label>
                <div className="flex flex-wrap gap-3">
                    {['Football', 'Cricket', 'Badminton', 'Volleyball', 'Tennis'].map(sport => (
                        <button
                            key={sport}
                            onClick={() => handleSportChange(sport)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                formData.sports.includes(sport) 
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {sport}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-white mb-3">Facilities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Parking', 'Flood Lights', 'Washroom', 'Drinking Water', 'Seating Area', 'Changing Room', 'WiFi', 'Cafeteria', 'Air Conditioning'].map(facility => (
                        <label key={facility} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={!!formData.facilities[facility]}
                                onChange={() => handleFacilityChange(facility)}
                                className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-600 bg-gray-700" 
                            />
                            <span className="text-sm text-gray-300">{facility}</span>
                        </label>
                    ))}
                </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Slots & Pricing Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Opening Time</label>
                <input type="time" name="openTime" value={formData.openTime} onChange={handleChange} className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Closing Time</label>
                <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} className="w-full bg-[#1e293b] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-sm font-medium text-gray-400 mb-2">Base Hourly Pricing (₹/hr)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-xl font-medium" placeholder="1500" />
            </div>
            
            <GlassPane className="p-4 bg-blue-500/5 border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-blue-100">Dynamic Pricing Tips</h4>
              </div>
              <p className="text-sm text-blue-200/70">You can configure custom weekend and peak-hour pricing from your dashboard once the venue is approved.</p>
            </GlassPane>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display">Payout & Verification</h2>
            <p className="text-gray-400 text-sm">Where should we send your booking revenue?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Bank Account Holder Name</label>
                <input type="text" name="bankHolderName" value={formData.bankHolderName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Account Number</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">IFSC Code</label>
                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 uppercase" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">UPI ID (Optional)</label>
                <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="yourname@upi" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="font-medium text-white mb-3">Verification Documents</h3>
              <div className="border-2 border-dashed border-white/20 p-6 rounded-xl text-center bg-white/[0.02]">
                <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-300">Upload Business License / GST Certificate</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display text-center">Ready to Submit?</h2>
            
            <GlassPane className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-video bg-white/10 rounded-xl overflow-hidden relative">
                   {formData.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                   )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-display text-white">{formData.venueName || 'Your Venue Name'}</h3>
                  <div className="flex items-center gap-2 text-gray-400 mt-1 text-sm">
                    <MapPin className="w-3.5 h-3.5" /> {formData.city || formData.address || 'Address not provided'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-[10px] text-gray-500 uppercase">Hourly Price</p>
                      <p className="font-semibold text-blue-400">₹{formData.price || '0'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <p className="text-[10px] text-gray-500 uppercase">Category</p>
                      <p className="font-semibold text-white">{formData.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="font-medium text-white mb-2">AI Insights & Estimation</h4>
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-3 rounded-lg">
                  <Rocket className="w-4 h-4" />
                  <span>Based on your location and type, you could earn up to <strong>₹1.5L/month</strong> at 60% occupancy.</span>
                </div>
              </div>
            </GlassPane>

            <label className="flex items-start gap-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-600 focus:ring-blue-600 bg-gray-700" />
              <span className="text-sm text-gray-300">
                I confirm that all provided information is accurate and I am authorized to list this business. I agree to the platform&apos;s terms of service and commission structure.
              </span>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Progress */}
      <div className="w-full md:w-64 shrink-0">
        <GlassPane className="p-4 md:sticky md:top-24">
          <div className="space-y-1">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="relative">
                  {idx !== STEPS.length - 1 && (
                    <div className={`absolute left-5 top-10 bottom-[-10px] w-0.5 ${isCompleted ? 'bg-blue-500' : 'bg-white/10'}`}></div>
                  )}
                  <button 
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    disabled={step.id > currentStep}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                      isActive ? 'bg-blue-500/20 text-blue-400' : 
                      isCompleted ? 'text-gray-300 hover:bg-white/5 cursor-pointer' : 
                      'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isActive ? 'bg-blue-500 text-white' : 
                      isCompleted ? 'bg-blue-500/20 text-blue-400' : 
                      'bg-white/10 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <span className="font-medium text-sm">{step.name}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </GlassPane>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <GlassPane className="p-6 md:p-8 min-h-[500px] flex flex-col relative overflow-hidden">
          {/* Subtle bg glow based on step */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex-1 relative z-10">
            {renderStepContent()}
          </div>
          
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10 relative z-10">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-colors ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            
            {currentStep < 7 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </GlassPane>
      </div>
    </div>
  );
}
