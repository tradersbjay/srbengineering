import React, { useState, useRef, useEffect } from 'react';
import { COMPANY_INFO } from '../constants';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email_address: '',
    interested_service: 'Design & Build',
    message: ''
  });

  // Service options (fallback list used if Supabase not configured)
  const [serviceOptions, setServiceOptions] = useState<string[]>([
    'Design & Build',
    'Structural Engineering',
    'Green Energy Solutions',
    'Water Supply Engineering',
    'Prefab & Steel Structures',
    'Project Estimation',
    'Other'
  ]);

  // Fetch services from Supabase and populate dropdown
  useEffect(() => {
    const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
    const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return;

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('title')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching services for contact form:', error);
          return;
        }

        if (data && data.length > 0) {
          const titles = data.map((s: any) => s.title as string).filter(Boolean);
          if (titles.length > 0) {
            setServiceOptions(titles);
            setFormData(prev => ({ ...prev, interested_service: prev.interested_service || titles[0] }));
          }
        }
      } catch (err) {
        console.error('Failed to load services for contact form:', err);
      }
    };

    fetchServices();
  }, []);

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = (import.meta.env as any).VITE_EMAILJS_PUBLIC_KEY;
    if (!publicKey) {
      console.error('EmailJS public key not configured in environment variables');
      return;
    }
    emailjs.init(publicKey);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!formData.phone_number.trim()) {
        throw new Error('Please enter your phone number');
      }
      if (!formData.email_address.trim()) {
        throw new Error('Please enter your email address');
      }
      if (!formData.message.trim()) {
        throw new Error('Please enter your message');
      }

      // Save to Supabase if configured
      const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL;
      const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseAnonKey) {
        const { error: dbError } = await supabase
          .from('contact_messages')
          .insert([{
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            email_address: formData.email_address,
            interested_service: formData.interested_service,
            message: formData.message
          }]);

        if (dbError) {
          console.error('Error saving message to Supabase:', dbError);
          throw new Error('Failed to save message: ' + dbError.message);
        }
        console.log('Message saved to Supabase');
      }

      // Send email using EmailJS
      const serviceId = (import.meta.env as any).VITE_EMAILJS_SERVICE_ID;
      const templateId = (import.meta.env as any).VITE_EMAILJS_TEMPLATE_ID;
      const fromEmail = (import.meta.env as any).VITE_EMAILJS_FROM_EMAIL;
      const toEmail = (import.meta.env as any).VITE_EMAILJS_RECIPIENT_EMAIL;

      if (!serviceId || !templateId) {
        throw new Error('EmailJS configuration missing. Please contact the administrator.');
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          email_address: formData.email_address,
          interested_service: formData.interested_service,
          message: formData.message,
          from_email: fromEmail || 'noreply@srbeng.com',
          to_email: toEmail || 'info@srbeng.com',
          reply_to: formData.email_address
        }
      );

      // Success
      setSubmitted(true);
      setFormData({
        full_name: '',
        phone_number: '',
        email_address: '',
        interested_service: 'Design & Build',
        message: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-3">Get in Touch</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Start Your Project Today</h3>
            <p className="text-gray-600 mb-10 text-lg">
              Have a project in mind? Contact us for a free consultation and estimate. 
              We are ready to build your vision.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <MapPin className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Head Office</h4>
                  <p className="text-gray-600">{COMPANY_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <Phone className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Phone</h4>
                  <p className="text-gray-600">{COMPANY_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <Mail className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">{COMPANY_INFO.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-full mr-4">
                  <Clock className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Working Hours</h4>
                  <p className="text-gray-600">Sun - Fri: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm relative overflow-hidden">
            {submitted ? (
               <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center text-center p-8 z-10">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                 </div>
                 <h4 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                 <p className="text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
               </div>
            ) : null}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <h4 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h4>
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    id="full_name" 
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    id="phone_number" 
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none bg-white text-gray-900"
                    placeholder="+977"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  id="email_address" 
                  value={formData.email_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="interested_service" className="block text-sm font-medium text-gray-700 mb-1">Interested Service</label>
                <select 
                  id="interested_service" 
                  value={formData.interested_service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none bg-white text-gray-900"
                >
                  {serviceOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  required
                  id="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none bg-white text-gray-900"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-blue text-white font-bold py-4 rounded-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;